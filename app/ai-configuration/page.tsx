"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SynthFiHeader } from "@/components/synthfi-header"
import { SynthFiFooter } from "@/components/synthfi-footer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export default function AIConfigurationPage() {
  const router = useRouter()
  const [originalPrompt, setOriginalPrompt] = useState("")
  const [selectedChain, setSelectedChain] = useState("solana")
  const [aiPrompt, setAiPrompt] = useState("")
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [tokenCost, setTokenCost] = useState(100)

  // AI template examples
  const aiTemplates = [
    {
      id: "governance",
      title: "Governance Automation",
      description: "Automate governance proposals and voting based on predefined rules and thresholds.",
      prompt:
        "Add AI-powered governance automation that can analyze proposals, provide summaries, and execute approved changes automatically.",
      cost: 100,
    },
    {
      id: "analytics",
      title: "Predictive Analytics",
      description: "Analyze usage patterns and predict future trends for protocol optimization.",
      prompt:
        "Integrate predictive analytics to forecast user behavior, optimize protocol parameters, and provide insights to token holders.",
      cost: 150,
    },
    {
      id: "feedback",
      title: "Community Feedback Agent",
      description: "Collect, analyze, and prioritize community feedback for protocol improvements.",
      prompt:
        "Create an AI agent that collects feedback from users, analyzes sentiment, identifies common issues, and suggests improvements.",
      cost: 120,
    },
    {
      id: "risk",
      title: "Risk Assessment",
      description: "Monitor and assess protocol risks in real-time to prevent exploits.",
      prompt:
        "Implement AI-based risk assessment that monitors transactions, identifies suspicious patterns, and alerts administrators of potential security threats.",
      cost: 200,
    },
    {
      id: "rewards",
      title: "Dynamic Rewards",
      description: "Adjust rewards based on user behavior and market conditions.",
      prompt:
        "Add dynamic reward calculation that adjusts based on user participation, market conditions, and protocol health metrics.",
      cost: 180,
    },
  ]

  // Load original prompt and chain from localStorage
  useEffect(() => {
    const savedPrompt = localStorage.getItem("synthfi_prompt")
    const savedChain = localStorage.getItem("synthfi_chain")

    if (savedPrompt) {
      setOriginalPrompt(savedPrompt)
    }

    if (savedChain) {
      setSelectedChain(savedChain)
    }
  }, [])

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template.id)
    setAiPrompt(template.prompt)
    setTokenCost(template.cost)
  }

  const handleContinue = () => {
    if (!aiPrompt.trim()) return

    setIsConfiguring(true)

    // Simulate AI configuration
    setTimeout(() => {
      // Store AI configuration in localStorage
      localStorage.setItem("synthfi_ai_prompt", aiPrompt)
      localStorage.setItem("synthfi_ai_cost", tokenCost.toString())

      // Redirect to launchpad with both prompts
      router.push(
        `/launchpad?prompt=${encodeURIComponent(originalPrompt)}&aiPrompt=${encodeURIComponent(
          aiPrompt,
        )}&enableAI=true`,
      )
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SynthFiHeader />

      <main className="flex-1 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">AI Integration Configuration</h1>
            <p className="text-gray-400">
              Configure AI capabilities for your {selectedChain === "solana" ? "Solana" : "EVM"} application
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6">
                <h2 className="text-xl font-semibold mb-4">Original Prompt</h2>
                <div className="bg-[#1e293b] p-4 rounded-lg text-gray-300 mb-4">{originalPrompt}</div>

                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center mr-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-500"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Describe AI Capabilities</h3>
                </div>

                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe the AI capabilities you want to add to your application..."
                  className="min-h-[150px] bg-[#1e293b] border-zinc-700 text-white mb-4"
                />

                <div className="bg-purple-900/20 border border-purple-900 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-500 mr-2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span className="font-medium">AI Integration Fee</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    A fee of $50 worth of SYNTHFI tokens will be charged upon deployment for AI integration.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
                    onClick={() => router.back()}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M19 12H5" />
                      <path d="M12 19l-7-7 7-7" />
                    </svg>
                    Back
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleContinue}
                    disabled={isConfiguring || !aiPrompt.trim()}
                  >
                    {isConfiguring ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z"
                          ></path>
                        </svg>
                        Configuring...
                      </>
                    ) : (
                      <>
                        Continue to Launchpad
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-2"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6">
                <h2 className="text-xl font-semibold mb-4">Token Utility Configuration</h2>

                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">Tokens Required Per AI Feature</label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[tokenCost]}
                      onValueChange={(value) => setTokenCost(value[0])}
                      min={50}
                      max={500}
                      step={10}
                      className="flex-1"
                    />
                    <div className="w-20 flex items-center">
                      <Input
                        type="number"
                        value={tokenCost}
                        onChange={(e) => setTokenCost(Number(e.target.value))}
                        min={50}
                        max={500}
                        className="bg-[#1e293b] border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#1e293b] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Usage-Based Pricing</h3>
                      <Badge className="bg-green-600">Recommended</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      Users pay tokens based on the number of AI features they use.
                    </p>
                    <div className="text-xs text-gray-500">Lower barrier to entry, higher long-term revenue</div>
                  </div>

                  <div className="bg-[#1e293b] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Subscription Model</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">
                      Users stake tokens for a period to access all AI features.
                    </p>
                    <div className="text-xs text-gray-500">Predictable revenue, higher initial commitment</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">AI Templates</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Select a template or create your own custom AI integration.
                </p>

                <div className="space-y-3">
                  {aiTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? "bg-purple-900/30 border border-purple-600"
                          : "bg-[#1e293b] border border-zinc-700 hover:border-purple-600/50"
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">{template.title}</h3>
                        <div className="text-xs text-gray-400">{template.cost} tokens</div>
                      </div>
                      <p className="text-sm text-gray-400">{template.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <h3 className="font-medium mb-2">AI Features</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500 mr-2"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-sm">Natural Language Processing</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500 mr-2"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-sm">Predictive Analytics</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500 mr-2"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-sm">Automated Decision Making</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500 mr-2"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-sm">Pattern Recognition</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SynthFiFooter />
    </div>
  )
}
