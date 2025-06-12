"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CodeTab } from "@/components/tabs/code-tab"
import { LogicTab } from "@/components/tabs/logic-tab"
import { SuggestionsTab } from "@/components/tabs/suggestions-tab"
import { TokenomicsTab } from "@/components/tabs/tokenomics-tab"
import { AITab } from "@/components/tabs/ai-tab"

// Define the structure of the data expected by OutputTabs
interface GeneratedData {
  code: string
  logic: any // Replace 'any' with a more specific type for logic breakdown
  suggestions: any[] // Replace 'any' with a more specific type for suggestions
  tokenomics: {
    name: string
    symbol: string
    totalSupply: string
    mintAuthorityRevoked: boolean
    rules: string[]
    warnings: string[]
    governance: string
  }
  // Add other fields if necessary, like original prompt
  prompt?: string
}

interface OutputTabsProps {
  enableAI?: boolean
  // Optional: Allow passing initial data directly as a prop
  initialData?: GeneratedData | null
}

export function OutputTabs({ enableAI = false, initialData = null }: OutputTabsProps) {
  const [isVisible, setIsVisible] = useState(!!initialData)
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(initialData)
  const [aiPrompt, setAiPrompt] = useState("") // Retain for AITab if needed

  useEffect(() => {
    // If initialData is provided, set it and make visible
    if (initialData) {
      setGeneratedData(initialData)
      setIsVisible(true)
    }

    const handleCodeGenerated = (event: CustomEvent<GeneratedData>) => {
      // Expect event.detail to be the full GeneratedData object
      if (event.detail && typeof event.detail.code !== "undefined" && event.detail.tokenomics) {
        // Ensure logic has proper structure
        const logicData = event.detail.logic || {
          purpose: "Generated smart contract logic",
          instructions: [
            {
              name: "initialize",
              description: "Initialize the program with default parameters",
            },
          ],
          accessControl: "Owner-controlled access",
        }

        setGeneratedData({
          ...event.detail,
          logic: logicData,
        })
        setIsVisible(true)
      } else {
        console.warn("Received 'codeGenerated' event with incomplete data structure.", event.detail)
        // Optionally, set a default/error state for generatedData
      }
    }

    window.addEventListener("codeGenerated", handleCodeGenerated as EventListener)
    return () => {
      window.removeEventListener("codeGenerated", handleCodeGenerated as EventListener)
    }
  }, [initialData]) // Rerun if initialData changes

  if (!isVisible || !generatedData) return null

  return (
    <div className="max-w-4xl mx-auto w-full bg-[#131a2c] rounded-lg p-6 mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Generated Output</h2>
        <div className="flex space-x-3">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white">Download DApp Code</Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Send to Launchpad</Button>
        </div>
      </div>

      <Tabs defaultValue="code">
        <TabsList className="bg-[#0d111c] border-b border-gray-700 w-full justify-start mb-6 flex flex-wrap">
          <TabsTrigger value="code" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            🧾 Code
          </TabsTrigger>
          <TabsTrigger value="logic" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            🧠 Logic
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            💡 Suggestions
          </TabsTrigger>
          <TabsTrigger value="tokenomics" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            📊 Tokenomics
          </TabsTrigger>
          {enableAI && (
            <TabsTrigger value="ai" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              🔧 AI Protocol Integration
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="code">
          <CodeTab code={generatedData.code} />
        </TabsContent>

        <TabsContent value="logic">
          <LogicTab logic={generatedData.logic} />
        </TabsContent>

        <TabsContent value="suggestions">
          <SuggestionsTab suggestions={generatedData.suggestions} />
        </TabsContent>

        <TabsContent value="tokenomics">
          {/* Ensure generatedData.tokenomics is passed */}
          <TokenomicsTab tokenomics={generatedData.tokenomics} />
        </TabsContent>

        {enableAI && (
          <TabsContent value="ai">
            {/* Pass original prompt if available and needed by AITab */}
            <AITab prompt={generatedData.prompt || ""} onAIPromptChange={setAiPrompt} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
