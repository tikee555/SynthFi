"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import SynthFiHeader from "@/components/synthfi-header"
import { SynthFiFooter } from "@/components/synthfi-footer"
import type { AITemplate } from "@/components/templates/template-types"
import { initialMockTemplates } from "@/lib/templates/mock-data" // Using mock data for now
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodeTab } from "@/components/tabs/code-tab" // For code preview
import { AlertTriangle, ArrowLeft, Info, Loader2, Rocket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getIconComponent } from "@/lib/template-icon-utils"

// This interface will be stored in localStorage
export interface TemplateLaunchConfig {
  templateId: string
  basePrompt: string
  projectName: string
  tokenName?: string
  tokenSymbol?: string
  tokenDecimals?: number
  enableAI: boolean
  customAIInstruction?: string
  originalTemplateData: AITemplate // To carry over other details
}

export default function ConfigureTemplatePage() {
  const router = useRouter()
  const params = useParams()
  const templateId = params.id as string

  const [template, setTemplate] = useState<AITemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [projectName, setProjectName] = useState("")
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenDecimals, setTokenDecimals] = useState<number>(9) // Default for SPL tokens
  const [enableAI, setEnableAI] = useState(false)
  const [customAIInstruction, setCustomAIInstruction] = useState("")

  useEffect(() => {
    if (templateId) {
      // In a real app, you'd fetch this. For now, find in mock data.
      const foundTemplate = initialMockTemplates.find((t) => t.id === templateId)
      if (foundTemplate) {
        setTemplate(foundTemplate)
        setProjectName(foundTemplate.defaultProjectName || `${foundTemplate.name} Project`)
        setTokenName(foundTemplate.defaultTokenName || "MyToken")
        setTokenSymbol(foundTemplate.defaultTokenSymbol || "MYT")
        setTokenDecimals(foundTemplate.defaultDecimals !== undefined ? foundTemplate.defaultDecimals : 9)
        setEnableAI(foundTemplate.supportsAI || false)
        setCustomAIInstruction(foundTemplate.aiInstruction || "")
      } else {
        setError("Template not found.")
      }
      setIsLoading(false)
    }
  }, [templateId])

  const handleContinueToLaunchpad = () => {
    if (!template) return

    const launchConfig: TemplateLaunchConfig = {
      templateId: template.id,
      basePrompt: template.prompt, // The original prompt from the template
      projectName,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      enableAI,
      customAIInstruction: enableAI ? customAIInstruction : "",
      originalTemplateData: template,
    }

    try {
      localStorage.setItem("synthfi_template_launch_config", JSON.stringify(launchConfig))
      router.push("/launchpad?fromTemplateConfig=true")
    } catch (e) {
      console.error("Failed to save to localStorage:", e)
      setError("Could not prepare for launchpad. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <p className="mt-4 text-lg">Loading Template...</p>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <SynthFiHeader />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <p className="mt-4 text-xl text-red-400">{error || "Template could not be loaded."}</p>
          <Button onClick={() => router.push("/templates")} className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Templates
          </Button>
        </main>
        <SynthFiFooter />
      </div>
    )
  }

  const IconComponent = getIconComponent(template.icon)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SynthFiHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => router.push("/templates")}
          className="mb-6 border-zinc-600 hover:bg-zinc-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Templates
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Template Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#0F172A]/70 border-purple-500/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {IconComponent && <IconComponent className="h-10 w-10 text-purple-400 flex-shrink-0" />}
                  <CardTitle className="text-2xl font-semibold text-gray-100">{template.name}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                    {template.category}
                  </Badge>
                  {template.isOfficial && <Badge className="bg-green-500 text-white">Official</Badge>}
                </div>
                <CardDescription className="text-gray-400 pt-2">{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold text-gray-300">Author:</span>{" "}
                    <span className="text-purple-400">{template.author || "Anonymous"}</span>
                  </p>
                  {template.estimatedCost && (
                    <p>
                      <span className="font-semibold text-gray-300">Est. Cost:</span> {template.estimatedCost}
                    </p>
                  )}
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="font-semibold text-gray-300">Tags:</span>
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0F172A]/70 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-gray-200">Base Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 bg-black/30 p-3 rounded-md whitespace-pre-wrap break-words font-mono">
                  {template.prompt}
                </p>
              </CardContent>
            </Card>

            {template.generatedCode && (
              <Card className="bg-[#0F172A]/70 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-200">Sample Code Preview</CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                  <CodeTab code={template.generatedCode} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Configuration Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#0F172A]/90 border-purple-600/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Configure Your Project
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Customize the details for your new project based on the "{template.name}" template.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="project-name" className="text-gray-300 font-semibold">
                    Project Name
                  </Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., My Awesome DeFi App"
                    className="bg-zinc-800 border-zinc-700 focus:ring-purple-500 mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="token-name" className="text-gray-300 font-semibold">
                      Token Name
                    </Label>
                    <Input
                      id="token-name"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      placeholder="e.g., My Token"
                      className="bg-zinc-800 border-zinc-700 focus:ring-purple-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="token-symbol" className="text-gray-300 font-semibold">
                      Token Symbol
                    </Label>
                    <Input
                      id="token-symbol"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                      placeholder="e.g., MYT"
                      maxLength={10}
                      className="bg-zinc-800 border-zinc-700 focus:ring-purple-500 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="token-decimals" className="text-gray-300 font-semibold">
                      Token Decimals
                    </Label>
                    <Input
                      id="token-decimals"
                      type="number"
                      value={tokenDecimals}
                      onChange={(e) => setTokenDecimals(Number.parseInt(e.target.value, 10))}
                      min="0"
                      max="18"
                      className="bg-zinc-800 border-zinc-700 focus:ring-purple-500 mt-1"
                    />
                  </div>
                </div>

                {template.supportsAI && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enable-ai"
                        checked={enableAI}
                        onCheckedChange={setEnableAI}
                        className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-zinc-700"
                      />
                      <Label htmlFor="enable-ai" className="text-gray-300 font-semibold">
                        Enable AI Integration
                      </Label>
                    </div>
                    {enableAI && (
                      <div>
                        <Label htmlFor="custom-ai-instruction" className="text-gray-300 font-semibold">
                          Custom AI Instructions (Optional)
                        </Label>
                        <Textarea
                          id="custom-ai-instruction"
                          value={customAIInstruction}
                          onChange={(e) => setCustomAIInstruction(e.target.value)}
                          placeholder="e.g., Add a feature to automatically rebalance portfolio based on market sentiment."
                          className="bg-zinc-800 border-zinc-700 focus:ring-purple-500 min-h-[100px] mt-1"
                        />
                        {template.originalTemplateData?.sampleAIIntegrationDetails && (
                          <p className="text-xs text-gray-500 mt-2 flex items-start">
                            <Info size={14} className="mr-1 mt-0.5 flex-shrink-0 text-sky-400" />
                            <span className="text-sky-400">Example AI Use:</span>{" "}
                            {template.originalTemplateData.sampleAIIntegrationDetails}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {error && <p className="text-sm text-red-400">{error}</p>}

                <Button
                  onClick={handleContinueToLaunchpad}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3 text-lg font-semibold mt-4"
                >
                  <Rocket className="mr-2 h-5 w-5" /> Continue to Launchpad
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SynthFiFooter />
    </div>
  )
}
