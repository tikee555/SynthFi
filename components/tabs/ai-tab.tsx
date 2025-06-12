"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, Sparkles, Cpu, KeyRound, Bot, Loader2, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  generateAIInstructionFeedback,
  type AIPromptFeedbackType,
  type AIFeedbackAction,
  // AIFeedbackSegment is implicitly used by AIPromptFeedbackType
} from "@/lib/ai-feedback-engine"

interface AITabProps {
  initialBasePrompt: string
  onAIPromptChange: (aiPrompt: string) => void
  currentMainPrompt: string // New prop: the main prompt from CreateAppSection
  onOpenSubmitTemplateModal: () => void // New prop: callback to open modal
}

export function AITab({
  initialBasePrompt,
  onAIPromptChange,
  currentMainPrompt, // Added
  onOpenSubmitTemplateModal, // Added
}: AITabProps) {
  const [aiInstruction, setAiInstruction] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<AIPromptFeedbackType>(null)
  const [aiProcessingResult, setAiProcessingResult] = useState<string | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const aiInstructionTextareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  const handleFeedbackActionClick = (action: AIFeedbackAction) => {
    if (action.type === "append") {
      const newValue = aiInstruction + action.value
      setAiInstruction(newValue)
      onAIPromptChange(newValue)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(() => {
        setFeedback(generateAIInstructionFeedback(newValue))
      }, 50)
    } else if (action.type === "replace") {
      setAiInstruction(action.value)
      onAIPromptChange(action.value)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(() => {
        setFeedback(generateAIInstructionFeedback(action.value))
      }, 50)
    }
    aiInstructionTextareaRef.current?.focus()
  }

  const handleInstructionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInstruction = event.target.value
    setAiInstruction(newInstruction)
    onAIPromptChange(newInstruction)
    setAiProcessingResult(null)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    if (newInstruction.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        const currentFeedback = generateAIInstructionFeedback(newInstruction)
        setFeedback(currentFeedback)
      }, 1500)
    } else {
      setFeedback(null)
    }
  }

  const handleInstructionBlur = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    if (aiInstruction.trim()) {
      const currentFeedback = generateAIInstructionFeedback(aiInstruction)
      setFeedback(currentFeedback)
    } else {
      setFeedback(null)
    }
  }

  const handleProcessRequest = () => {
    if (!aiInstruction.trim()) return

    setIsLoading(true)
    setAiProcessingResult(null)

    setTimeout(() => {
      setIsLoading(false)
      const mockResponse = `Simulated AI Processing Complete for: "${aiInstruction.substring(0, 100)}${
        aiInstruction.length > 100 ? "..." : ""
      }"

Key integrations identified:
- Dynamic Parameter Adjustment Module (Simulated)
- On-chain Data Oracle Hook (Simulated)

Estimated complexity: Medium.
Next steps: Review generated AI-enhanced code snippets (feature not yet implemented in demo).`
      setAiProcessingResult(mockResponse)

      toast({
        title: "AI Request Processed (Simulated)",
        description: "Mock AI integration details are now displayed below.",
        variant: "default",
      })
      console.log("AI Request Processed:", aiInstruction)
    }, 2000)
  }

  useEffect(() => {
    if (initialBasePrompt) {
      let generatedAIInstruction = `Integrate AI to enhance the capabilities of the generated smart contract based on the prompt: "${initialBasePrompt}". `
      if (initialBasePrompt.toLowerCase().includes("staking")) {
        generatedAIInstruction +=
          "For example, the AI could dynamically adjust staking rewards based on network conditions or user behavior, or predict optimal re-staking periods."
      } else if (initialBasePrompt.toLowerCase().includes("vesting")) {
        generatedAIInstruction +=
          "For instance, AI could monitor for conditions that might trigger early release clauses if defined, or provide analytics on vesting schedule impacts."
      } else if (initialBasePrompt.toLowerCase().includes("token")) {
        generatedAIInstruction +=
          "Consider AI for features like automated liquidity management, dynamic transaction fees based on usage, or anomaly detection in token transfers."
      } else {
        generatedAIInstruction += "Specify how AI should interact with or augment the contract's core logic."
      }
      setAiInstruction(generatedAIInstruction)
      onAIPromptChange(generatedAIInstruction) // Ensure this is called
      const initialFeedback = generateAIInstructionFeedback(generatedAIInstruction)
      setFeedback(initialFeedback)
      setAiProcessingResult(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBasePrompt]) // Removed onAIPromptChange from deps as it can cause loops if not memoized

  return (
    <div className="space-y-6 p-1">
      <Card className="bg-[#131A2C]/70 border-zinc-700">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <Bot size={24} className="mr-3 text-purple-400" />
              AI Protocol Integration
            </CardTitle>
            <Badge
              variant="outline"
              className="border-purple-500/50 bg-purple-500/10 text-purple-300 text-xs py-1 px-2"
            >
              <Sparkles className="mr-1.5 h-3 w-3" />
              Premium Feature
            </Badge>
          </div>
          <p className="text-sm text-gray-400 pt-1">
            Enhance your smart contract with AI capabilities powered by SynthFi. Describe how the AI should interact
            with your contract.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="ai-instruction" className="text-sm font-medium text-gray-300 mb-1 block">
                AI Instruction
              </label>
              <Textarea
                id="ai-instruction"
                ref={aiInstructionTextareaRef}
                value={aiInstruction}
                onChange={handleInstructionChange}
                onBlur={handleInstructionBlur}
                placeholder="e.g., Integrate AI to dynamically adjust airdrop eligibility thresholds based on network activity and user behavior..."
                className="min-h-[120px] w-full bg-[#0D111C] border-zinc-600 text-gray-200 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
              {feedback && (
                <div
                  className={`mt-2 p-2.5 rounded-md text-xs flex items-start ${
                    feedback.type === "success"
                      ? "bg-green-800/30 text-green-300 border border-green-700/50"
                      : "bg-amber-800/30 text-amber-300 border border-amber-700/50"
                  }`}
                >
                  <div className="flex-shrink-0 mr-2 pt-0.5">
                    {feedback.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    )}
                  </div>
                  <div>
                    {typeof feedback.message === "string" ? (
                      <span>{feedback.message}</span>
                    ) : (
                      feedback.message.map((segment, index) =>
                        segment.action ? (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleFeedbackActionClick(segment.action!)}
                            className="underline hover:text-purple-300 text-purple-400 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-0.5 py-0 mx-px bg-transparent"
                          >
                            {segment.text}
                          </button>
                        ) : (
                          <span key={index}>{segment.text}</span>
                        ),
                      )
                    )}
                  </div>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Example: "Add market prediction capabilities using an oracle" or "Integrate AI for dynamic fee
                adjustments based on transaction volume."
              </p>
            </div>
            <Button
              onClick={handleProcessRequest}
              disabled={isLoading || !aiInstruction.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 text-sm"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Process AI Request (Simulated)
            </Button>

            {aiProcessingResult && !isLoading && (
              <Card className="mt-4 bg-[#0D111C] border-zinc-600 animate-in fade-in-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-300">Simulated AI Processing Output:</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap p-3 bg-[#131A2C]/50 rounded-md border border-zinc-700">
                    {aiProcessingResult}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3">AI Integration Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#131A2C]/70 border-zinc-700">
            <CardHeader className="flex flex-row items-center space-x-3 pb-2">
              <div className="p-2 bg-purple-500/10 rounded-md">
                <Cpu size={20} className="text-purple-400" />
              </div>
              <CardTitle className="text-base font-medium text-gray-200">On-Chain AI Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400">
                Execute AI models and logic directly on-chain for trustless, decentralized intelligence and automated
                decision-making within your smart contract.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-[#131A2C]/70 border-zinc-700">
            <CardHeader className="flex flex-row items-center space-x-3 pb-2">
              <div className="p-2 bg-purple-500/10 rounded-md">
                <KeyRound size={20} className="text-purple-400" />
              </div>
              <CardTitle className="text-base font-medium text-gray-200">Token-Gated AI Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400">
                Create premium features or utilities accessible only to token holders, driving value and utility for
                your project's native token through AI capabilities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New "Save Current Prompt as Template" button section */}
      <div className="mt-8 pt-6 border-t border-zinc-700/50 flex flex-col items-center">
        <Button
          variant="outline"
          className="text-purple-300 border-purple-500/70 hover:bg-purple-600/20 hover:text-purple-200 hover:border-purple-500 disabled:opacity-60 disabled:text-gray-500 disabled:border-gray-600 disabled:hover:bg-transparent"
          onClick={onOpenSubmitTemplateModal}
          disabled={!currentMainPrompt || !currentMainPrompt.trim()}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Save Current Prompt as Template
        </Button>
        <p className="text-xs text-gray-500 text-center mt-2">
          This saves the main app generation prompt (from Step 1) as a reusable template.
        </p>
      </div>
    </div>
  )
}
