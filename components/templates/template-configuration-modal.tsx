// No changes needed from the version in previous_blocks or the last response.
// It correctly uses `onContinueToLaunchpad`.
"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { AITemplate, TemplateLaunchConfig } from "./template-types"
import { Zap, Info, Settings2, Edit3, AlertTriangle, CheckCircle, BrainCircuit } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TemplateConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  template: AITemplate | null
  onContinueToLaunchpad: (config: TemplateLaunchConfig) => void
}

interface ModalPromptAnalysis {
  suggestions: string[]
  warnings: string[]
  charCount: number
  wordCount: number
}

const analyzeModalPromptText = (text: string): ModalPromptAnalysis => {
  const charCount = text.length
  const wordCount = text.split(/\s+/).filter(Boolean).length
  const suggestions: string[] = []
  const warnings: string[] = []

  if (wordCount < 10 && charCount > 0) {
    suggestions.push("Consider adding more details to your prompt for better results.")
  }
  if (charCount > 1000) {
    warnings.push("Prompt is getting very long. Ensure clarity and conciseness.")
  }
  if (text.toLowerCase().includes("staking") && !text.toLowerCase().includes("reward")) {
    warnings.push("Staking pool mentioned, but no reward mechanism specified.")
  }
  if (text.toLowerCase().includes("vesting") && !text.toLowerCase().includes("cliff")) {
    suggestions.push("Vesting schedule mentioned. Consider adding a cliff period.")
  }

  return { suggestions, warnings, charCount, wordCount }
}

const DEBOUNCE_DELAY = 500

export function TemplateConfigurationModal({
  isOpen,
  onClose,
  template,
  onContinueToLaunchpad,
}: TemplateConfigurationModalProps) {
  const [projectName, setProjectName] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenDecimals, setTokenDecimals] = useState<number>(6)
  const [enableAI, setEnableAI] = useState(false)
  const [customAIInstruction, setCustomAIInstruction] = useState("")
  const [editablePromptContent, setEditablePromptContent] = useState("")
  const [promptAnalysis, setPromptAnalysis] = useState<ModalPromptAnalysis | null>(null)

  const debouncedAnalyzePrompt = useCallback((customText: string, basePrompt: string) => {
    const fullPrompt = basePrompt + (customText ? "\n\n# User Customizations:\n" + customText : "")
    setPromptAnalysis(analyzeModalPromptText(fullPrompt))
  }, [])

  useEffect(() => {
    if (template) {
      setProjectName("")
      setTokenName("")
      setTokenSymbol("")
      setTokenDecimals(template.defaultDecimals !== undefined ? template.defaultDecimals : 6)
      if (template.supportsAI) {
        setEnableAI(true)
        setCustomAIInstruction(template.aiInstruction || "")
      } else {
        setEnableAI(false)
        setCustomAIInstruction("")
      }
      setEditablePromptContent("")
      debouncedAnalyzePrompt("", template.prompt)
    }
  }, [template, debouncedAnalyzePrompt])

  useEffect(() => {
    if (!isOpen) {
      setPromptAnalysis(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (!template) return
    const handler = setTimeout(() => {
      debouncedAnalyzePrompt(editablePromptContent, template.prompt)
    }, DEBOUNCE_DELAY)
    return () => clearTimeout(handler)
  }, [editablePromptContent, template, debouncedAnalyzePrompt])

  if (!template) return null

  const finalCustomizedPrompt =
    template.prompt + (editablePromptContent ? "\n\n# User Customizations:\n" + editablePromptContent : "")

  const handleSubmit = () => {
    if (!template) return
    const config: TemplateLaunchConfig = {
      templateId: template.id,
      originalTemplateData: template,
      projectName,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      enableAI,
      customAIInstruction: enableAI ? customAIInstruction : undefined,
      basePrompt: template.prompt,
      customizedPrompt: finalCustomizedPrompt,
    }
    onContinueToLaunchpad(config)
  }

  const estimatedAiFee = enableAI
    ? template.supportsAI
      ? "50 SYNTHFI (Est.)"
      : "AI Not Natively Supported by Template"
    : "N/A"
  const currentPromptCharCount = template.prompt.length + editablePromptContent.length
  const currentPromptWordCount =
    template.prompt.split(/\s+/).filter(Boolean).length + editablePromptContent.split(/\s+/).filter(Boolean).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0A0F1E] border-purple-600/70 text-gray-200 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 flex items-center">
            <Settings2 className="w-7 h-7 mr-3 text-purple-400" />
            Configure & Customize: {template.name}
          </DialogTitle>
          <DialogDescription className="text-gray-400 mt-1">
            Review the base template and customize details before launching.
            {template.supportsAI && (
              <span className="ml-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400">
                <BrainCircuit className="h-3.5 w-3.5" /> Enhanced by AI
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-3">
          <div className="py-4 space-y-6">
            <div className="p-4 bg-black/30 rounded-md border border-purple-500/30">
              <h3 className="font-semibold text-lg mb-2 text-purple-300 flex items-center">
                <Info className="w-5 h-5 mr-2" /> Template Overview
              </h3>
              <p className="text-sm text-gray-300">
                <span className="font-medium">Category:</span> {template.category}
              </p>
              <p className="text-sm text-gray-300 mt-1">
                <span className="font-medium">Description:</span> {template.description}
              </p>
            </div>
            <div className="p-4 bg-black/30 rounded-md border border-purple-500/30 space-y-3">
              <h3 className="font-semibold text-lg text-purple-300 flex items-center">
                <Edit3 className="w-5 h-5 mr-2" /> Customize Prompt Logic
              </h3>
              <div>
                <Label className="text-gray-400 text-sm">Base Prompt (View-only):</Label>
                <div className="mt-1 text-gray-300 text-sm font-mono bg-black/50 p-3 rounded-sm whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                  {template.prompt}
                </div>
              </div>
              <div>
                <Label htmlFor="editablePromptContent" className="text-gray-300">
                  Additional Instructions / Modifications:
                </Label>
                <Textarea
                  id="editablePromptContent"
                  value={editablePromptContent}
                  onChange={(e) => setEditablePromptContent(e.target.value)}
                  placeholder="e.g., Add a 1% burn fee on all transfers. Implement a 6-month vesting schedule for team tokens..."
                  className="mt-1 min-h-[100px] bg-zinc-800 border-zinc-700 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Total Prompt: {currentPromptCharCount} Chars, {currentPromptWordCount} Words
                </div>
              </div>
              {promptAnalysis && (promptAnalysis.suggestions.length > 0 || promptAnalysis.warnings.length > 0) && (
                <div className="mt-2 space-y-1 text-xs">
                  {promptAnalysis.suggestions.map((s, i) => (
                    <p key={`sugg-${i}`} className="text-sky-400 flex items-start">
                      <CheckCircle className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" /> {s}
                    </p>
                  ))}
                  {promptAnalysis.warnings.map((w, i) => (
                    <p key={`warn-${i}`} className="text-amber-400 flex items-start">
                      <AlertTriangle className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0" /> {w}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4 p-4 bg-black/30 rounded-md border border-purple-500/30">
              <h3 className="font-semibold text-lg mb-3 text-purple-300">Project & Token Details</h3>
              <div>
                <Label htmlFor="projectName" className="text-gray-300">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-1 bg-zinc-800 border-zinc-700"
                  placeholder="e.g., My Awesome DeFi Project"
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
                    placeholder="e.g., SynthToken"
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
                    placeholder="e.g., SYNTH"
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
            </div>
            <div className="p-4 bg-black/30 rounded-md border border-purple-500/30 space-y-3">
              <h3 className="font-semibold text-lg text-purple-300 flex items-center">
                <BrainCircuit className="w-5 h-5 mr-2 text-sky-400" /> AI Configuration
              </h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableAI"
                  checked={enableAI}
                  onCheckedChange={setEnableAI}
                  className="data-[state=checked]:bg-purple-500"
                />
                <Label htmlFor="enableAI" className="text-gray-300">
                  Enable AI Integration {template.supportsAI ? "(Recommended)" : "(Template may not fully support AI)"}
                </Label>
              </div>
              {enableAI && (
                <div>
                  <Label htmlFor="customAIInstruction" className="text-gray-300">
                    AI Instruction:
                  </Label>
                  <Textarea
                    id="customAIInstruction"
                    value={customAIInstruction}
                    onChange={(e) => setCustomAIInstruction(e.target.value)}
                    placeholder={
                      template.supportsAI && template.aiInstruction
                        ? "Using template's default AI instruction. Edit or add more details."
                        : "e.g., Analyze tokenomics for sustainability..."
                    }
                    className="mt-1 min-h-[100px] bg-zinc-800 border-zinc-700 focus:ring-purple-500 focus:border-purple-500"
                  />
                  {template.supportsAI && template.aiInstruction && customAIInstruction === template.aiInstruction && (
                    <p className="text-xs text-gray-500 mt-1">
                      Default AI instruction from template applied. You can customize it above.
                    </p>
                  )}
                </div>
              )}
              <div className="text-sm text-gray-400">Estimated AI Fee: {estimatedAiFee}</div>
              {enableAI && template.aiIntegrationOptions && (
                <div className="text-xs text-gray-400 border-t border-purple-500/20 pt-2 mt-2">
                  <p className="font-medium text-gray-300">AI Capabilities for this template:</p>
                  <p>{template.aiIntegrationOptions}</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="bg-[#0A0F1E] pt-6 border-t border-purple-500/30 flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 order-last sm:order-first"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white flex-1"
          >
            <Zap className="mr-2 h-4 w-4" /> Continue to Launchpad
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
