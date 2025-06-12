"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CodeTab } from "./tabs/code-tab"
import { LogicTab } from "./tabs/logic-tab"
import { SuggestionsTab } from "./tabs/suggestions-tab"
import { TokenomicsTab, type TokenomicsData } from "./tabs/tokenomics-tab" // Ensure TokenomicsData is imported if defined there
import { AITab } from "./tabs/ai-tab"
import { useWallet } from "@/contexts/wallet-context"
import { WalletConnectModal } from "./wallet-connect-modal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Bot,
  Sparkles,
  Lightbulb,
  Save,
  AlertOctagon,
  HelpCircle,
  InfoIcon,
  Settings2,
} from "lucide-react"
import { AIIntegrationModal } from "./ai-integration-modal"
import { AIProtocolIntegration } from "./ai-protocol-integration"
import { ChainSelector } from "./chain-selector"
import { TokenomicsEditor } from "./tokenomics-editor"

import type { AITemplate } from "./template-card"
import { SubmitTemplateModal, type NewTemplateData } from "./submit-template-modal"
import { initialMockTemplates } from "@/lib/mock-templates"
import {
  generateSampleCode,
  generateLogicBreakdownForDisplay,
  generateSuggestionsForDisplay,
  generateTokenomicsForDisplay, // This function is key for TokenomicsTab data
  PromptScoring,
} from "@/lib/code-generation-engine"
import { addBuildToHistory, type RemixableBuild } from "@/lib/history-manager"
import { Badge } from "@/components/ui/badge"

type FeedbackSeverity = "critical" | "warning" | "info" | "success"

type FeedbackItem = {
  id: string
  text: string
  severity: FeedbackSeverity
  actionValue?: string
  reasoning: string
  learnMoreLink?: string
}

type DetailedPromptAnalysisResult = {
  overallStatus: FeedbackSeverity
  overallMessage: string
  feedbackItems: FeedbackItem[]
  scoring: PromptScoring
} | null

// Define the structure for generated code/AI code state
interface GeneratedOutputData {
  name: string
  symbol: string
  code: any // Replace 'any' with more specific types if available
  logic: any // Replace 'any' with more specific types if available
  suggestions: any // Replace 'any' with more specific types if available
  tokenomics: TokenomicsData // Use the imported or defined TokenomicsData type
  error?: string
}

interface CreateAppSectionProps {
  remixPrompt?: string | null
  onRemixApplied?: () => void
}

export function CreateAppSection({ remixPrompt, onRemixApplied }: CreateAppSectionProps) {
  const router = useRouter()
  const { walletAddress, isConnected } = useWallet()
  const [selectedChain, setSelectedChain] = useState<string>("solana")
  const [prompt, setPrompt] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const [generatedCode, setGeneratedCode] = useState<GeneratedOutputData | null>(null)
  const [aiGeneratedCode, setAiGeneratedCode] = useState<GeneratedOutputData | null>(null)

  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false)
  const [enableAI, setEnableAI] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("code")
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false)

  const [selectedAITemplate, setSelectedAITemplate] = useState<string | null>(null)
  const [aiUtilityDescription, setAiUtilityDescription] = useState<string>("")
  // const [aiInstruction, setAiInstruction] = useState<string>("") // aiUtilityDescription is now used for this

  const [detailedPromptFeedback, setDetailedPromptFeedback] = useState<DetailedPromptAnalysisResult>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null)

  const [showTokenomicsEditor, setShowTokenomicsEditor] = useState<boolean>(false)

  useEffect(() => {
    if (remixPrompt && promptTextareaRef.current) {
      setPrompt(remixPrompt)
      promptTextareaRef.current.focus()
      if (onRemixApplied) {
        onRemixApplied()
      }
    }
  }, [remixPrompt, onRemixApplied])

  const [templates, setTemplates] = useState<AITemplate[]>(initialMockTemplates)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false)

  const isMounted = useRef<boolean>(true)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [showDebug, setShowDebug] = useState<boolean>(false)

  const addDebugLog = (message: string) => {
    console.log(`[DEBUG] ${message}`)
    setDebugInfo((prev) => [...prev.slice(-9), `${new Date().toISOString().split("T")[1].slice(0, 8)} - ${message}`])
  }

  useEffect(() => {
    isMounted.current = true
    try {
      const storedTemplates = localStorage.getItem("synthfi_custom_templates")
      if (storedTemplates) {
        const parsedTemplates = JSON.parse(storedTemplates) as AITemplate[]
        const combined = [
          ...parsedTemplates,
          ...initialMockTemplates.filter((mt) => !parsedTemplates.find((st) => st.id === mt.id)),
        ]
        setTemplates(combined)
      } else {
        setTemplates(initialMockTemplates)
      }
    } catch (error) {
      console.error("Failed to load templates from localStorage:", error)
      setTemplates(initialMockTemplates)
    }
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (templates !== initialMockTemplates) {
      try {
        const userSubmittedTemplates = templates.filter((t) => t.submittedBy)
        localStorage.setItem("synthfi_custom_templates", JSON.stringify(userSubmittedTemplates))
      } catch (error) {
        console.error("Failed to save templates to localStorage:", error)
      }
    }
  }, [templates])

  const handleAddNewSubmittedTemplate = (newTemplateData: NewTemplateData) => {
    const newTemplate: AITemplate = {
      id: `user-${Date.now().toString()}`,
      ...newTemplateData,
      author: walletAddress || "Anonymous User",
      submittedBy: walletAddress,
      useCount: 0,
      createdAt: new Date().toISOString(),
      isStaffPick: false,
      icon: "Package",
    }
    setTemplates((prevTemplates) => [newTemplate, ...prevTemplates])
    setIsSubmitModalOpen(false)
    addDebugLog(`Added new template: ${newTemplate.name}`)
  }

  const analyzeMainPrompt = useCallback((currentPrompt: string): DetailedPromptAnalysisResult => {
    const lowerPrompt = currentPrompt.toLowerCase().trim()
    const feedbackItems: FeedbackItem[] = []
    let clarity = 10
    let riskScore = 0
    let complexityScore = 0
    const detectedFeatures: string[] = []

    if (!lowerPrompt) return null

    if (lowerPrompt.includes("token") || lowerPrompt.includes("coin") || lowerPrompt.includes("create a token")) {
      detectedFeatures.push("Token Creation")
      complexityScore = Math.max(complexityScore, 0)
      if (!lowerPrompt.match(/supply of|total supply|max supply/)) {
        feedbackItems.push({
          id: "token_no_supply",
          text: "No token supply specified. Define a total or max supply.",
          severity: "critical",
          actionValue: " with a total supply of [AMOUNT]",
          reasoning: "A token must have a defined supply to control its scarcity and distribution.",
          learnMoreLink: "/docs/tokenomics#supply",
        })
        clarity -= 3
        riskScore = Math.max(riskScore, 2)
      }
      if (!lowerPrompt.match(/name for|token name|named as/)) {
        feedbackItems.push({
          id: "token_no_name",
          text: "Token name missing.",
          severity: "warning",
          actionValue: " named [TOKEN_NAME]",
          reasoning: "Helps identify the token.",
          learnMoreLink: "/docs/token#name",
        })
        clarity -= 1
      }
      if (!lowerPrompt.match(/symbol for|token symbol|symbol as/)) {
        feedbackItems.push({
          id: "token_no_symbol",
          text: "Token symbol missing.",
          severity: "warning",
          actionValue: " with symbol [SYMBOL]",
          reasoning: "A short ticker for the token.",
          learnMoreLink: "/docs/token#symbol",
        })
        clarity -= 1
      }
    }

    const isStakingPrompt =
      lowerPrompt.includes("staking") || lowerPrompt.includes("stake tokens") || lowerPrompt === "staking pool"
    if (isStakingPrompt) {
      detectedFeatures.push("Staking")
      complexityScore = Math.max(complexityScore, 1)
      if (!lowerPrompt.match(/reward token|pays rewards in|reward pool uses/)) {
        feedbackItems.push({
          id: "staking_no_reward_token",
          text: "The token used for distributing rewards is not specified.",
          severity: "warning",
          actionValue: " that pays rewards in [TOKEN_SYMBOL_OR_ADDRESS]",
          reasoning: "Clarifies what token stakers will receive as rewards.",
          learnMoreLink: "/docs/staking#reward-token",
        })
        clarity -= 2
        riskScore = Math.max(riskScore, 1)
      }
      if (!lowerPrompt.match(/apr of|apy of|interest rate|reward rate/)) {
        feedbackItems.push({
          id: "staking_no_apr",
          text: "Annual Percentage Rate (APR) or reward rate not specified.",
          severity: "warning",
          actionValue: " with an APR of [X%]",
          reasoning: "Stakers need to know their potential return on investment.",
          learnMoreLink: "/docs/staking#apr",
        })
        clarity -= 1
      }
      if (!lowerPrompt.match(/lockup|unstake period|stake duration|lock-up/)) {
        feedbackItems.push({
          id: "staking_no_lockup",
          text: "No lock-up period defined for staked assets.",
          severity: "info",
          actionValue: " with a lock-up period of [DURATION]",
          reasoning: "A lock-up period can provide stability. If none, funds are liquid.",
          learnMoreLink: "/docs/staking#lockup",
        })
        clarity -= 1
      }
      if (lowerPrompt.match(/lockup|lock-up/) && !lowerPrompt.match(/early withdrawal|emergency unstake/)) {
        feedbackItems.push({
          id: "staking_early_withdrawal",
          text: "No rule for early withdrawal from lock-up. Penalty or blocked?",
          severity: "warning",
          actionValue: " allowing early withdrawal with a [Y%] penalty",
          reasoning: "Clarifies if users can access funds before lock-up ends.",
          learnMoreLink: "/docs/staking#early-withdrawal",
        })
        clarity -= 1
      }
      if (!lowerPrompt.match(/access control|who can stake|restricted to/)) {
        feedbackItems.push({
          id: "staking_no_access_control",
          text: "Access control for staking/unstaking functions is not defined.",
          severity: "info",
          reasoning: "Determines who can interact (e.g., any wallet, DAO members). Default is open.",
          learnMoreLink: "/docs/staking#access-control",
        })
      }
      if (!lowerPrompt.match(/rewards vest|vesting for rewards/)) {
        feedbackItems.push({
          id: "staking_reward_vesting",
          text: "Consider if rewards should vest over time or be immediately claimable.",
          severity: "info",
          actionValue: " and rewards vest over [REWARD_VESTING_DURATION]",
          reasoning: "Vesting rewards can align long-term incentives.",
          learnMoreLink: "/docs/staking#reward-vesting",
        })
      }
    }
    if (lowerPrompt.includes("vesting") || lowerPrompt.includes("vested tokens")) {
      detectedFeatures.push("Vesting")
      complexityScore = Math.max(complexityScore, 1)
      if (!lowerPrompt.match(/cliff/)) {
        feedbackItems.push({
          id: "vesting_no_cliff",
          text: "Missing cliff duration for vesting.",
          severity: "warning",
          actionValue: " with a [CLIFF_DURATION] cliff",
          reasoning: "A cliff period before any tokens unlock is common in vesting schedules.",
          learnMoreLink: "/docs/vesting#cliff",
        })
        clarity -= 2
      }
      if (!lowerPrompt.match(/unlock frequency|vesting schedule|linear|batch/)) {
        feedbackItems.push({
          id: "vesting_no_unlock_frequency",
          text: "No unlock frequency or schedule type (e.g., linear, batched).",
          severity: "warning",
          actionValue: " with [linear/monthly] unlocking",
          reasoning: "Specifies how tokens are released over the vesting period after the cliff.",
          learnMoreLink: "/docs/vesting#schedule",
        })
        clarity -= 1
      }
    }

    if (lowerPrompt.length < 20 && feedbackItems.length === 0) {
      feedbackItems.push({
        id: "general_too_short",
        text: "Prompt is quite short. Describe more details for accurate generation.",
        severity: "info",
        reasoning: "More context helps generate relevant code.",
        learnMoreLink: "/docs/prompt-guide#details",
      })
      clarity -= 3
    }

    clarity = Math.max(0, Math.min(10, clarity))
    let overallStatus: FeedbackSeverity = "success"
    let overallMessage = "Prompt looks good and seems ready for generation!"
    if (feedbackItems.some((f) => f.severity === "critical")) {
      overallStatus = "critical"
      overallMessage = "Critical issues found! Address these for a functional contract."
      riskScore = Math.max(riskScore, 2)
    } else if (feedbackItems.some((f) => f.severity === "warning")) {
      overallStatus = "warning"
      overallMessage = "Some details are missing or unclear. Consider these suggestions."
      riskScore = Math.max(riskScore, 1)
    } else if (feedbackItems.some((f) => f.severity === "info") && clarity < 10) {
      overallStatus = "info"
      overallMessage = "Prompt is understandable, but could be more specific. See tips."
    } else if (feedbackItems.length === 0 && lowerPrompt.length < 30 && !lowerPrompt.includes("test")) {
      overallStatus = "info"
      overallMessage = "Prompt is a bit short. Add more details for a comprehensive output."
    }

    return {
      overallStatus,
      overallMessage,
      feedbackItems,
      scoring: new PromptScoring(clarity, riskScore, complexityScore, detectedFeatures),
    }
  }, [])

  const handleFeedbackItemClick = (actionValue?: string) => {
    if (!actionValue) return
    setPrompt((prev) => {
      const newPrompt = (prev.trim() + " " + actionValue).trim()
      return newPrompt
    })
    promptTextareaRef.current?.focus()
  }

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    if (prompt.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        const analysis = analyzeMainPrompt(prompt)
        setDetailedPromptFeedback(analysis)
      }, 750)
    } else {
      setDetailedPromptFeedback(null)
    }
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [prompt, analyzeMainPrompt])

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }, [])

  const handlePromptBlur = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    if (prompt.trim()) {
      const analysis = analyzeMainPrompt(prompt)
      setDetailedPromptFeedback(analysis)
    } else {
      setDetailedPromptFeedback(null)
    }
  }, [prompt, analyzeMainPrompt])

  const handleGenerateCode = () => {
    if (!prompt.trim()) {
      const emptyPromptAnalysis = analyzeMainPrompt("")
      setDetailedPromptFeedback(emptyPromptAnalysis)
      return
    }
    if (!isConnected) {
      setIsWalletModalOpen(true)
      return
    }
    setIsGenerating(true)
    setGeneratedCode(null)
    setAiGeneratedCode(null)

    const currentAiInstruction = enableAI ? aiUtilityDescription : ""

    setTimeout(() => {
      try {
        const codeOutput = generateSampleCode(prompt, enableAI, selectedChain, currentAiInstruction)
        const logicOutput = generateLogicBreakdownForDisplay(prompt, enableAI, selectedChain, currentAiInstruction)
        const suggestionsOutput = generateSuggestionsForDisplay(prompt, enableAI, selectedChain, currentAiInstruction)
        const tokenomicsOutput = generateTokenomicsForDisplay(prompt, enableAI, selectedChain, currentAiInstruction) // This must return a valid TokenomicsData object

        const outputData: GeneratedOutputData = {
          name: "SynthFi Program", // Example name, can be dynamic
          symbol: "SFP", // Example symbol, can be dynamic
          code: codeOutput,
          logic: logicOutput,
          suggestions: suggestionsOutput,
          tokenomics: tokenomicsOutput, // tokenomicsOutput is now typed
        }

        if (enableAI) {
          setAiGeneratedCode(outputData)
        } else {
          const buildData: RemixableBuild = {
            id: `direct-${Date.now()}`,
            timestamp: Date.now(),
            type: "direct_prompt",
            originalPrompt: prompt,
            customizedPrompt: prompt,
            selectedChain,
            enableAI,
            aiInstruction: undefined,
          }
          addBuildToHistory(buildData)
          setGeneratedCode(outputData)
        }
        setActiveTab("code")
      } catch (e: any) {
        addDebugLog(`Error generating code: ${e.message}`)
        const errorOutput: GeneratedOutputData = {
          name: "Error",
          symbol: "ERR",
          code: `// Error: ${e.message}`,
          logic: `Error generating logic: ${e.message}`,
          suggestions: `Error generating suggestions: ${e.message}`,
          tokenomics: {
            // Provide default structure on error for tokenomics
            name: "Error",
            symbol: "ERR",
            totalSupply: "0",
            mintAuthorityRevoked: false,
            rules: [],
            warnings: [{ id: "gen-error", text: `Generation Error: ${e.message}`, severity: "critical" }],
            governance: "Error",
          },
          error: `Failed to generate code: ${e.message}`,
        }
        if (enableAI) setAiGeneratedCode(errorOutput)
        else setGeneratedCode(errorOutput)
      } finally {
        if (isMounted.current) {
          setIsGenerating(false)
        }
      }
    }, 1500)
  }

  const handleEnableAI = (enabled: boolean) => setEnableAI(enabled)

  const handleAIUtilityTemplateSelect = (templateId: string) => {
    setSelectedAITemplate(templateId)
  }
  const handleAIUtilityDescriptionUpdate = (description: string) => {
    setAiUtilityDescription(description)
  }

  const handleSendToLaunchpad = () => {
    const currentAiInstruction = enableAI ? aiUtilityDescription : undefined
    const buildData: RemixableBuild = {
      id: `direct-launch-${Date.now()}`,
      timestamp: Date.now(),
      type: "direct_prompt",
      originalPrompt: prompt,
      customizedPrompt: prompt,
      selectedChain,
      enableAI,
      aiInstruction: currentAiInstruction,
    }
    addBuildToHistory(buildData)

    router.push(
      `/launchpad?prompt=${encodeURIComponent(prompt)}&aiInstruction=${encodeURIComponent(currentAiInstruction || "")}&enableAI=${enableAI}&selectedChain=${selectedChain}`,
    )
  }

  const handleTabChange = (value: string) => setActiveTab(value)
  const handleChainSelect = (chain: string) => {
    setSelectedChain(chain)
    setPrompt("")
    if (promptTextareaRef.current) promptTextareaRef.current.value = ""
    setGeneratedCode(null)
    setAiGeneratedCode(null)
    setDetailedPromptFeedback(null)
  }
  const openSubmitTemplateModal = () => {
    if (prompt.trim()) setIsSubmitModalOpen(true)
  }
  const testEventHandling = () => console.log("Test event handling")

  const handleApplyTokenomicsToPrompt = (tokenomicsString: string) => {
    setPrompt((prev) => prev.trim() + (prev.trim().length > 0 ? " " : "") + tokenomicsString)
    setShowTokenomicsEditor(false)
    promptTextareaRef.current?.focus()
  }

  const displayedCodeData = enableAI && aiGeneratedCode ? aiGeneratedCode : generatedCode
  const examplePrompts =
    selectedChain === "solana"
      ? [
          "Staking pool with 9% APR, 15-day lockup, early withdrawal penalty 5%, rewards vest over 30 days, reward token MyRewardToken",
          "Token vesting for 12 months with 1 month cliff",
          "Create a token named MyCoin (MYC) with 1M supply",
        ]
      : ["Base token deflationary", "Cross-chain bridge Base", "DAO governance Base"]

  const getFeedbackIcon = (severity: FeedbackSeverity) => {
    switch (severity) {
      case "critical":
        return <AlertOctagon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-amber-400" />
      case "info":
        return <Lightbulb className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-blue-400" />
      case "success":
        return <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-green-400" />
      default:
        return <HelpCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
    }
  }
  const getFeedbackColorClasses = (severity: FeedbackSeverity) => {
    switch (severity) {
      case "critical":
        return "bg-red-900/30 text-red-300 border-red-700/50"
      case "warning":
        return "bg-amber-900/30 text-amber-300 border-amber-700/50"
      case "info":
        return "bg-blue-900/30 text-blue-300 border-blue-700/50"
      case "success":
        return "bg-green-900/30 text-green-300 border-green-700/50"
      default:
        return "bg-zinc-800/30 text-gray-300 border-zinc-700/50"
    }
  }

  return (
    <section className="py-12 md:py-16 bg-[#0D111C] text-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Create Onchain Apps with Natural Language</h2>
        {process.env.NODE_ENV === "development" && (
          <div className="text-center mb-4">
            <button onClick={() => setShowDebug(!showDebug)} className="text-xs text-gray-600 hover:text-gray-400">
              {showDebug ? "Hide Debug" : "Show Debug"}
            </button>
          </div>
        )}
        {showDebug && (
          <div className="mb-4 bg-black/50 border border-yellow-600 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-yellow-400 font-bold">Debug Info</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDebug(false)}
                className="text-yellow-400 border-yellow-600 hover:bg-yellow-700/20"
              >
                Hide
              </Button>
            </div>
            <div className="space-y-1 text-xs font-mono text-yellow-300 max-h-40 overflow-y-auto">
              {debugInfo.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" onClick={testEventHandling} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Test Events
              </Button>
              <Button size="sm" onClick={() => setDebugInfo([])} className="bg-gray-600 hover:bg-gray-700">
                Clear Logs
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Prompt Input Column */}
          <div className="space-y-6">
            <ChainSelector selectedChain={selectedChain} onSelectChain={handleChainSelect} />
            <div>
              <textarea
                ref={promptTextareaRef}
                id="prompt-textarea"
                value={prompt}
                onChange={handlePromptChange}
                onBlur={handlePromptBlur}
                placeholder={`Describe your ${selectedChain} program... e.g., "Create a token with 1M supply"`}
                className="w-full min-h-[150px] p-4 bg-[#131A2C] border-2 border-purple-600 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="text-xs text-gray-400 mt-2">Current prompt length: {prompt.length} characters</p>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => setShowTokenomicsEditor(!showTokenomicsEditor)}
                className="w-full text-purple-400 border-purple-600 hover:bg-purple-700/20 flex items-center justify-center"
              >
                <Settings2 className="mr-2 h-5 w-5" />
                {showTokenomicsEditor ? "Hide Tokenomics Editor" : "Configure Custom Tokenomics"}
              </Button>
            </div>

            <TokenomicsEditor
              isVisible={showTokenomicsEditor}
              onApplyTokenomics={handleApplyTokenomicsToPrompt}
              currentPrompt={prompt}
            />

            {detailedPromptFeedback && (
              <div className="space-y-4 mt-4">
                <div
                  className={`p-3 rounded-md text-sm flex items-start ${getFeedbackColorClasses(detailedPromptFeedback.overallStatus)}`}
                >
                  {getFeedbackIcon(detailedPromptFeedback.overallStatus)}
                  <p>{detailedPromptFeedback.overallMessage}</p>
                </div>
                {detailedPromptFeedback.feedbackItems.length > 0 && (
                  <div className="p-4 bg-[#1A1F30] border border-zinc-700 rounded-lg shadow-md space-y-3">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-purple-400" /> Suggestions &amp; Warnings:
                    </h4>
                    {detailedPromptFeedback.feedbackItems.map((item) => (
                      <div key={item.id} className={`p-3 rounded-md border ${getFeedbackColorClasses(item.severity)}`}>
                        <div className="flex items-start">
                          {getFeedbackIcon(item.severity)}
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {item.text}
                              {item.actionValue && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() => handleFeedbackItemClick(item.actionValue)}
                                  className="text-purple-400 hover:text-purple-300 p-0 ml-1 h-auto inline font-medium"
                                >
                                  (Auto-fix)
                                </Button>
                              )}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              <span className="italic">Why:</span> {item.reasoning}
                              {item.learnMoreLink && (
                                <TooltipProvider delayDuration={100}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <a
                                        href={item.learnMoreLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-1 text-blue-400 hover:text-blue-300 inline-flex items-center text-xs"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          alert(`Learn More: ${item.learnMoreLink} (placeholder)`)
                                        }}
                                      >
                                        <InfoIcon size={12} className="mr-0.5" /> Learn More
                                      </a>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-[#1e293b] border-zinc-700 text-white max-w-xs text-xs p-2">
                                      <p>Click to learn more. (Docs: {item.learnMoreLink})</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-4 bg-[#1A1F30] border border-zinc-700 rounded-lg shadow-md space-y-2">
                  <h4 className="text-sm font-semibold text-gray-300 mb-1 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-purple-400" /> Prompt Analysis:
                  </h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>
                      Clarity:{" "}
                      <Badge
                        variant={
                          detailedPromptFeedback.scoring.clarity > 7
                            ? "default"
                            : detailedPromptFeedback.scoring.clarity > 4
                              ? "secondary"
                              : "destructive"
                        }
                        className="bg-opacity-50"
                      >
                        {detailedPromptFeedback.scoring.clarity}/10
                      </Badge>
                    </p>
                    <p>
                      Risk Assessment:{" "}
                      <Badge
                        variant={
                          detailedPromptFeedback.scoring.risk === "Low"
                            ? "default"
                            : detailedPromptFeedback.scoring.risk === "Medium"
                              ? "secondary"
                              : "destructive"
                        }
                        className="bg-opacity-50"
                      >
                        {detailedPromptFeedback.scoring.risk}
                      </Badge>
                    </p>
                    <p>
                      Estimated Complexity: <Badge variant="outline">{detailedPromptFeedback.scoring.complexity}</Badge>
                    </p>
                    <p>
                      Detected Features:{" "}
                      {detailedPromptFeedback.scoring.detectedFeatures.map((feature) => (
                        <Badge key={feature} variant="outline" className="mr-1">
                          {feature}
                        </Badge>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="ai-integration"
                checked={enableAI}
                onCheckedChange={handleEnableAI}
                className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-zinc-700"
              />
              <Label htmlFor="ai-integration" className="text-sm text-gray-300">
                Enable AI Integration
              </Label>
            </div>
            {enableAI && (
              <AIProtocolIntegration
                selectedTemplate={selectedAITemplate}
                onSelectTemplate={handleAIUtilityTemplateSelect}
                utilityDescription={aiUtilityDescription}
                onUpdateDescription={handleAIUtilityDescriptionUpdate}
              />
            )}
            <div className="pt-2">
              <p className="text-xs text-gray-500 mb-2">Or try an example:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <Button
                    key={index}
                    type="button"
                    onClick={() => {
                      setPrompt(example)
                    }}
                    variant="outline"
                    className="bg-[#2C3249] hover:bg-[#3A405A] text-gray-300 border-[#4A5069] hover:border-purple-500 text-sm px-3 py-1.5"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              type="button"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-semibold mt-4 flex items-center justify-center"
              onClick={handleGenerateCode}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Code <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          {/* Generated Output Column */}
          <div className="bg-[#131A2C] rounded-lg border border-zinc-700 min-h-[500px] flex flex-col">
            {!displayedCodeData ? (
              <div className="flex items-center justify-center flex-1 p-8">
                <div className="text-center">
                  <Bot size={48} className="mx-auto mb-4 text-purple-500" />
                  <p className="text-gray-400 text-sm">Enter a prompt to generate your {selectedChain} program.</p>
                  <p className="text-xs text-gray-600 mt-2">Your generated code and analysis will appear here.</p>
                </div>
              </div>
            ) : displayedCodeData.error && !displayedCodeData.tokenomics ? ( // Check if error exists and tokenomics is not fallback
              <div className="flex items-center justify-center flex-1 p-8 text-red-400">
                <AlertTriangle size={48} className="mx-auto mb-4" /> <p>{displayedCodeData.error}</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-zinc-700 gap-3">
                  <h3 className="font-medium flex items-center text-lg whitespace-nowrap">
                    Generated Output
                    {enableAI && aiGeneratedCode && (
                      <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-500/50 py-1 px-2 text-xs">
                        <Sparkles className="mr-1 h-3 w-3" /> AI Enhanced
                      </Badge>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-end w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="text-sm border-zinc-600 hover:bg-zinc-700 hover:text-white flex-grow sm:flex-grow-0"
                    >
                      Download DApp Code
                    </Button>
                    <Button
                      onClick={handleSendToLaunchpad}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-sm flex-grow sm:flex-grow-0"
                    >
                      Send to Launchpad
                    </Button>
                    <Button
                      variant="outline"
                      className="text-sm border-green-600 text-green-400 hover:bg-green-700/20 hover:text-green-300 flex-grow sm:flex-grow-0"
                      onClick={openSubmitTemplateModal}
                      disabled={!prompt.trim()}
                    >
                      <Save className="mr-2 h-4 w-4" /> Save as Template
                    </Button>
                  </div>
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
                    {enableAI && displayedCodeData && (
                      <TabsTrigger
                        value="ai"
                        className="px-3 py-2.5 text-sm data-[state=active]:bg-[#2a0f4a] data-[state=active]:text-purple-300 data-[state=active]:shadow-none rounded-t-md hover:bg-zinc-800/50 text-gray-400 data-[state=inactive]:border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500"
                      >
                        <Sparkles className="mr-2 h-4 w-4" /> AI Protocol
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>
                <div className="flex-1 overflow-auto p-4 bg-[#0A0D14]">
                  <TabsContent value="code" className="h-full mt-0">
                    <CodeTab code={displayedCodeData.code} />
                  </TabsContent>
                  <TabsContent value="logic" className="h-full mt-0">
                    <LogicTab logic={displayedCodeData.logic} />
                  </TabsContent>
                  <TabsContent value="suggestions" className="h-full mt-0">
                    <SuggestionsTab suggestions={displayedCodeData.suggestions} />
                  </TabsContent>
                  <TabsContent value="tokenomics" className="h-full mt-0">
                    {/* Ensure displayedCodeData.tokenomics is passed and is valid */}
                    <TokenomicsTab tokenomics={displayedCodeData.tokenomics} />
                  </TabsContent>
                  {enableAI && displayedCodeData && (
                    <TabsContent value="ai" className="h-full mt-0">
                      <AITab
                        initialBasePrompt={prompt}
                        onAIPromptChange={setAiUtilityDescription}
                        currentMainPrompt={prompt}
                        onOpenSubmitTemplateModal={openSubmitTemplateModal}
                      />
                    </TabsContent>
                  )}
                </div>
              </Tabs>
            )}
          </div>
        </div>
      </div>
      <WalletConnectModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
      <AIIntegrationModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onConfirm={() => {
          setIsAIModalOpen(false)
        }}
      />
      <SubmitTemplateModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleAddNewSubmittedTemplate}
        categories={["DeFi", "NFT", "DAO", "Tokenomics", "Utility", "Other"]}
        initialPrompt={prompt}
      />
    </section>
  )
}
