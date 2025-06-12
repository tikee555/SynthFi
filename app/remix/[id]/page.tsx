"use client"

import Link from "next/link"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { getBuildById, type RemixableBuild, addBuildToHistory } from "@/lib/history-manager"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeTab } from "@/components/tabs/code-tab"
import { LogicTab } from "@/components/tabs/logic-tab"
import { SuggestionsTab } from "@/components/tabs/suggestions-tab"
import { TokenomicsTab } from "@/components/tabs/tokenomics-tab"
import SynthFiHeader from "@/components/synthfi-header"
import { SynthFiFooter } from "@/components/synthfi-footer"
import { Loader2, ArrowRight, Sparkles, AlertTriangle, Bot, Settings2, BrainCircuit } from "lucide-react"
import {
  generateSampleCode,
  generateLogicBreakdownForDisplay,
  generateSuggestionsForDisplay,
  generateTokenomicsForDisplay,
} from "@/lib/code-generation-engine"
import type { RemixLaunchConfig } from "@/components/templates/template-types" // Ensure RemixLaunchConfig is defined
import { ChainSelector } from "@/components/chain-selector"

export default function RemixPage() {
  const router = useRouter()
  const params = useParams()
  const buildId = params.id as string

  const [originalBuild, setOriginalBuild] = useState<RemixableBuild | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Editable fields
  const [projectName, setProjectName] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenDecimals, setTokenDecimals] = useState<number>(9)
  const [customizedPrompt, setCustomizedPrompt] = useState("")
  const [selectedChain, setSelectedChain] = useState("solana")
  const [enableAI, setEnableAI] = useState(false)
  const [aiInstruction, setAiInstruction] = useState("")

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedOutput, setGeneratedOutput] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("code")

  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (buildId) {
      const build = getBuildById(buildId)
      if (build) {
        setOriginalBuild(build)
        setProjectName(build.projectName || "")
        setTokenName(build.tokenName || "")
        setTokenSymbol(build.tokenSymbol || "")
        setTokenDecimals(build.tokenDecimals !== undefined ? build.tokenDecimals : 9)
        setCustomizedPrompt(build.customizedPrompt)
        setSelectedChain(build.selectedChain)
        setEnableAI(build.enableAI)
        setAiInstruction(build.aiInstruction || "")
      }
      setIsLoading(false)
    }
  }, [buildId])

  const handleRegenerate = () => {
    if (!customizedPrompt.trim()) return
    setIsGenerating(true)
    setGeneratedOutput(null)

    setTimeout(() => {
      // Simulate generation
      try {
        const code = generateSampleCode(customizedPrompt, enableAI, selectedChain, aiInstruction)
        const logic = generateLogicBreakdownForDisplay(customizedPrompt, enableAI, selectedChain)
        const suggestions = generateSuggestionsForDisplay(customizedPrompt, enableAI, selectedChain)
        const tokenomics = generateTokenomicsForDisplay(customizedPrompt, enableAI, selectedChain)

        if (isMounted.current) {
          setGeneratedOutput({ code, logic, suggestions, tokenomics, name: projectName || "Remixed Project" })
          setActiveTab("code")
        }
      } catch (error) {
        console.error("Error during regeneration:", error)
        if (isMounted.current) {
          setGeneratedOutput({ error: "Failed to regenerate code." })
        }
      } finally {
        if (isMounted.current) {
          setIsGenerating(false)
        }
      }
    }, 1500)
  }

  const handleContinueToLaunchpad = () => {
    if (!originalBuild) return

    const launchConfig: RemixLaunchConfig = {
      // originalBuildData: originalBuild, // Could be useful for Launchpad to know origin
      originalPrompt: originalBuild.originalPrompt,
      customizedPrompt: customizedPrompt,
      projectName,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      selectedChain,
      enableAI,
      aiInstruction: enableAI ? aiInstruction : undefined,
    }
    localStorage.setItem("synthfi_remix_launch_config", JSON.stringify(launchConfig))

    // Optionally, save this remixed version as a new build in history
    addBuildToHistory({
      type: "direct_prompt", // All remixes become 'direct_prompt' for simplicity or a new 'remix' type
      originalPrompt: originalBuild.originalPrompt, // Keep original for lineage
      customizedPrompt: customizedPrompt,
      projectName,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      selectedChain,
      enableAI,
      aiInstruction,
    })

    router.push("/launchpad?fromRemix=true")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <p className="mt-4">Loading Remix Data...</p>
      </div>
    )
  }

  if (!originalBuild) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4">Build not found. It might have been removed from history.</p>
        <Link href="/" passHref className="mt-4">
          <Button variant="outline">Go to Homepage</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SynthFiHeader />
      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Remix Your Build
          </h1>
          <p className="text-center text-gray-400 mb-10">
            Editing: <span className="font-semibold text-purple-300">{originalBuild.displayTitle}</span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Configuration Column */}
            <div className="space-y-6 p-6 bg-[#0D111C] rounded-lg border border-zinc-700">
              <h2 className="text-xl font-semibold text-purple-300 flex items-center">
                <Settings2 className="mr-2" />
                Configuration
              </h2>
              <div>
                <Label htmlFor="customizedPrompt" className="text-gray-300">
                  Prompt
                </Label>
                <Textarea
                  id="customizedPrompt"
                  value={customizedPrompt}
                  onChange={(e) => setCustomizedPrompt(e.target.value)}
                  placeholder="Describe your program..."
                  className="mt-1 min-h-[150px] bg-zinc-800 border-zinc-700 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <ChainSelector selectedChain={selectedChain} onSelectChain={setSelectedChain} />

              <div>
                <Label htmlFor="projectName" className="text-gray-300">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-1 bg-zinc-800 border-zinc-700"
                  placeholder="e.g., My Remixed Project"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tokenName" className="text-gray-300">
                    Token Name
                  </Label>
                  <Input
                    id="tokenName"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="mt-1 bg-zinc-800 border-zinc-700"
                    placeholder="e.g., RemixToken"
                  />
                </div>
                <div>
                  <Label htmlFor="tokenSymbol" className="text-gray-300">
                    Symbol
                  </Label>
                  <Input
                    id="tokenSymbol"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                    className="mt-1 bg-zinc-800 border-zinc-700"
                    placeholder="e.g., RMX"
                  />
                </div>
                <div>
                  <Label htmlFor="tokenDecimals" className="text-gray-300">
                    Decimals
                  </Label>
                  <Input
                    id="tokenDecimals"
                    type="number"
                    value={tokenDecimals}
                    onChange={(e) => setTokenDecimals(Number(e.target.value))}
                    className="mt-1 bg-zinc-800 border-zinc-700"
                    min="0"
                    max="18"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="enableAI"
                  checked={enableAI}
                  onCheckedChange={setEnableAI}
                  className="data-[state=checked]:bg-purple-500"
                />
                <Label htmlFor="enableAI" className="text-gray-300">
                  Enable AI Integration
                </Label>
              </div>
              {enableAI && (
                <div>
                  <Label htmlFor="aiInstruction" className="text-gray-300">
                    AI Instruction:
                  </Label>
                  <Textarea
                    id="aiInstruction"
                    value={aiInstruction}
                    onChange={(e) => setAiInstruction(e.target.value)}
                    placeholder="e.g., Optimize for low gas fees..."
                    className="mt-1 min-h-[80px] bg-zinc-800 border-zinc-700"
                  />
                </div>
              )}
              <Button
                onClick={handleRegenerate}
                disabled={isGenerating || !customizedPrompt.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-semibold mt-4"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Regenerating Preview...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Regenerate Preview
                  </>
                )}
              </Button>
            </div>

            {/* Output Column */}
            <div className="bg-[#131A2C] rounded-lg border border-zinc-700 min-h-[500px] flex flex-col">
              {!generatedOutput ? (
                <div className="flex items-center justify-center flex-1 p-8">
                  <div className="text-center">
                    <Bot size={48} className="mx-auto mb-4 text-purple-500" />
                    <p className="text-gray-400 text-sm">Edit your prompt and click "Regenerate Preview".</p>
                  </div>
                </div>
              ) : generatedOutput.error ? (
                <div className="flex items-center justify-center flex-1 p-8 text-red-400">
                  <AlertTriangle size={48} className="mx-auto mb-4" /> <p>{generatedOutput.error}</p>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                  <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-zinc-700 gap-3">
                    <h3 className="font-medium flex items-center text-lg whitespace-nowrap">
                      Generated Output
                      {enableAI && (
                        <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400">
                          <BrainCircuit className="h-3.5 w-3.5" /> AI Enhanced
                        </span>
                      )}
                    </h3>
                    <Button
                      onClick={handleContinueToLaunchpad}
                      disabled={isGenerating}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm"
                    >
                      Continue to Launchpad <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="border-b border-zinc-700 px-2">
                    <TabsList className="bg-transparent p-0">
                      {["code", "logic", "suggestions", "tokenomics"].map((tabVal) => (
                        <TabsTrigger
                          key={tabVal}
                          value={tabVal}
                          className="px-3 py-2.5 text-sm data-[state=active]:bg-[#2a0f4a] data-[state=active]:text-purple-300 data-[state=active]:shadow-none rounded-t-md hover:bg-zinc-800/50 text-gray-400 data-[state=inactive]:border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                        >
                          {tabVal === "code" && "🧾 Code"} {tabVal === "logic" && "🧠 Logic"}{" "}
                          {tabVal === "suggestions" && "💡 Suggestions"} {tabVal === "tokenomics" && "📊 Tokenomics"}
                        </TabsTrigger>
                      ))}
                      {/* Add AITab if AI is enabled and output exists */}
                    </TabsList>
                  </div>
                  <div className="flex-1 overflow-auto p-4 bg-[#0A0D14]">
                    <TabsContent value="code" className="h-full mt-0">
                      <CodeTab code={generatedOutput.code} />
                    </TabsContent>
                    <TabsContent value="logic" className="h-full mt-0">
                      <LogicTab logic={generatedOutput.logic} />
                    </TabsContent>
                    <TabsContent value="suggestions" className="h-full mt-0">
                      <SuggestionsTab suggestions={generatedOutput.suggestions} />
                    </TabsContent>
                    <TabsContent value="tokenomics" className="h-full mt-0">
                      <TokenomicsTab tokenomics={generatedOutput.tokenomics} />
                    </TabsContent>
                    {/* AITab content if needed */}
                  </div>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </main>
      <SynthFiFooter />
    </div>
  )
}
