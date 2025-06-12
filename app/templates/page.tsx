"use client"
import { SynthFiFooter } from "@/components/synthfi-footer" // Restoring named import for Footer
import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo, useCallback } from "react"
import type {
  AITemplate,
  TemplateCategory,
  TemplateSortOption,
  TemplateLaunchConfig,
} from "@/components/templates/template-types"
import { TemplateCard } from "@/components/templates/template-card"
import { TemplateInfoModal } from "@/components/templates/template-info-modal"
import { TemplateConfigurationModal } from "@/components/templates/template-configuration-modal"
import { initialMockTemplates } from "@/lib/templates/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ListFilter, BrainCircuit, InfoIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { addBuildToHistory, type RemixableBuild } from "@/lib/history-manager"
import { useWallet } from "@/contexts/wallet-context"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TemplatesPage() {
  const router = useRouter()
  const wallet = useWallet()

  const [templates, setTemplates] = useState<AITemplate[]>(initialMockTemplates)
  const [selectedTemplateForInfo, setSelectedTemplateForInfo] = useState<AITemplate | null>(null)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [configuringTemplate, setConfiguringTemplate] = useState<AITemplate | null>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<TemplateSortOption>("mostVoted")
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all")
  const [filterAIEnhanced, setFilterAIEnhanced] = useState<boolean>(false)

  useEffect(() => {
    try {
      const storedTemplates = localStorage.getItem("synthfi_ai_templates")
      if (storedTemplates) {
        const parsedTemplates = JSON.parse(storedTemplates) as AITemplate[]
        const combined = [
          ...parsedTemplates.map((t) => ({ ...t, voters: t.voters || [] })),
          ...initialMockTemplates
            .filter((mt) => !parsedTemplates.find((st) => st.id === mt.id))
            .map((t) => ({ ...t, voters: t.voters || [] })),
        ]
        setTemplates(combined)
      } else {
        setTemplates(initialMockTemplates.map((t) => ({ ...t, voters: t.voters || [] })))
        localStorage.setItem(
          "synthfi_ai_templates",
          JSON.stringify(initialMockTemplates.map((t) => ({ ...t, voters: t.voters || [] }))),
        )
      }
    } catch (error) {
      console.error("[TemplatesPage] Failed to load templates:", error)
      setTemplates(initialMockTemplates.map((t) => ({ ...t, voters: t.voters || [] })))
    }
  }, [])

  const isVotingEligible = useMemo(() => {
    return wallet.isConnected && wallet.walletType === "phantom"
  }, [wallet.isConnected, wallet.walletType])

  const hasVoted = useCallback(
    (templateId: string): boolean => {
      if (!wallet.walletAddress) return false
      const template = templates.find((t) => t.id === templateId)
      return template?.voters?.includes(wallet.walletAddress) || false
    },
    [templates, wallet.walletAddress],
  )

  const handleVote = useCallback(
    (templateId: string) => {
      if (wallet.isDemoMode) {
        toast({
          title: "Demo Mode",
          description: "Voting is simulated. Your vote is not recorded on the blockchain.",
        })
        const updatedTemplates = templates.map((t) =>
          t.id === templateId
            ? { ...t, voteCount: (t.voteCount || 0) + 1, voters: [...(t.voters || []), wallet.walletAddress!] }
            : t,
        )
        setTemplates(updatedTemplates)
        if (selectedTemplateForInfo && selectedTemplateForInfo.id === templateId) {
          setSelectedTemplateForInfo((prev) =>
            prev
              ? {
                  ...prev,
                  voteCount: (prev.voteCount || 0) + 1,
                  voters: [...(prev.voters || []), wallet.walletAddress!],
                }
              : null,
          )
        }
        return
      }

      if (!isVotingEligible) {
        toast({
          title: "Cannot Vote",
          description: "Please connect your Phantom wallet to vote.",
          variant: "destructive",
        })
        return
      }

      if (hasVoted(templateId)) {
        toast({ title: "Already Voted" })
        return
      }
      const updatedTemplates = templates.map((t) =>
        t.id === templateId
          ? { ...t, voteCount: (t.voteCount || 0) + 1, voters: [...(t.voters || []), wallet.walletAddress!] }
          : t,
      )
      setTemplates(updatedTemplates)
      if (selectedTemplateForInfo && selectedTemplateForInfo.id === templateId) {
        setSelectedTemplateForInfo((prev) =>
          prev
            ? { ...prev, voteCount: (prev.voteCount || 0) + 1, voters: [...(prev.voters || []), wallet.walletAddress!] }
            : null,
        )
      }
      localStorage.setItem("synthfi_ai_templates", JSON.stringify(updatedTemplates))
      toast({
        title: "Vote Cast!",
        description: `Successfully voted for ${templates.find((t) => t.id === templateId)?.name}.`,
        className: "bg-green-600 text-white",
      })
    },
    [templates, wallet.walletAddress, wallet.isDemoMode, isVotingEligible, hasVoted, selectedTemplateForInfo],
  )

  const handleOpenMoreInfo = (template: AITemplate) => {
    setSelectedTemplateForInfo(template)
    setIsInfoModalOpen(true)
  }
  const handleOpenConfigModal = (template: AITemplate) => {
    setConfiguringTemplate(template)
    setIsConfigModalOpen(true)
  }
  const handleLaunchFromConfigModal = (config: TemplateLaunchConfig) => {
    const updatedTemplates = templates.map((t) =>
      t.id === config.templateId ? { ...t, useCount: (t.useCount || 0) + 1 } : t,
    )
    setTemplates(updatedTemplates)
    localStorage.setItem("synthfi_ai_templates", JSON.stringify(updatedTemplates))
    localStorage.setItem("synthfi_template_launch_config", JSON.stringify(config))
    const buildData: RemixableBuild = {
      id: `template-${config.templateId}-${Date.now()}`,
      timestamp: Date.now(),
      type: "template_based",
      originalPrompt: config.basePrompt,
      customizedPrompt: config.customizedPrompt,
      projectName: config.projectName,
      tokenName: config.tokenName,
      tokenSymbol: config.tokenSymbol,
      tokenDecimals: config.tokenDecimals,
      selectedChain: config.originalTemplateData.chainCompatibility?.[0] || "solana",
      enableAI: config.enableAI,
      aiInstruction: config.customAIInstruction,
    }
    addBuildToHistory(buildData)
    setIsConfigModalOpen(false)
    router.push(`/launchpad?fromTemplateConfig=true`)
  }
  const handleUseTemplateFromInfoModal = (template: AITemplate) => {
    setIsInfoModalOpen(false)
    handleOpenConfigModal(template)
  }

  const categories: TemplateCategory[] = useMemo(
    () => Array.from(new Set(templates.map((t) => t.category))).sort() as TemplateCategory[],
    [templates],
  )
  const filteredAndSortedTemplates = useMemo(
    () =>
      templates
        .filter((template) => {
          const matchesSearch =
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
          const matchesAIFilter = !filterAIEnhanced || template.supportsAI === true
          return matchesSearch && matchesCategory && matchesAIFilter
        })
        .sort((a, b) => {
          switch (sortOption) {
            case "mostVoted":
              return (b.voteCount || 0) - (a.voteCount || 0)
            case "mostUsed":
              return (b.useCount || 0) - (a.useCount || 0)
            case "newest":
              return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            case "official":
              if (a.isOfficial && !b.isOfficial) return -1
              if (!a.isOfficial && b.isOfficial) return 1
              if (a.isOfficial && b.isOfficial) return (b.voteCount || 0) - (a.voteCount || 0)
              return (b.voteCount || 0) - (a.voteCount || 0)
            default:
              return 0
          }
        }),
    [templates, searchTerm, selectedCategory, sortOption, filterAIEnhanced],
  )

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        {wallet.isDemoMode && (
          <Alert variant="default" className="mb-6 border-sky-500/50 text-sky-300 bg-sky-900/30">
            <InfoIcon className="h-5 w-5 text-sky-400" />
            <AlertTitle className="font-semibold text-sky-200">Demo Mode Notice</AlertTitle>
            <AlertDescription className="text-sky-300/90">
              Voting access is currently unrestricted as token balance checks are disabled for demo purposes. Balance
              gating will be re-enabled for live launch.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            AI Contract Templates
          </h1>
          <p className="text-lg text-gray-400 mt-3 max-w-2xl mx-auto">
            Kickstart your Solana project with community-driven and official SynthFi templates. Vote for your favorites!
          </p>
        </div>

        <div className="mb-8 p-4 bg-[#0D111C]/50 border border-zinc-700 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border-zinc-700 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as TemplateCategory | "all")}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700">
                <ListFilter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-gray-200">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as TemplateSortOption)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700 text-gray-200">
                <SelectItem value="mostVoted">Most Voted</SelectItem>
                <SelectItem value="mostUsed">Most Used</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="official">Official First</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2 pt-2 sm:pt-0">
              <Checkbox
                id="ai-enhanced-filter"
                checked={filterAIEnhanced}
                onCheckedChange={(checked) => setFilterAIEnhanced(checked as boolean)}
                className="border-zinc-600 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
              />
              <Label
                htmlFor="ai-enhanced-filter"
                className="text-sm font-medium text-gray-300 flex items-center gap-1.5"
              >
                <BrainCircuit className="h-4 w-4 text-sky-400" /> Only Enhanced by AI
              </Label>
            </div>
          </div>
        </div>

        {filteredAndSortedTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onConfigureTemplate={handleOpenConfigModal}
                onMoreInfo={handleOpenMoreInfo}
                onVote={handleVote}
                currentUserWalletAddress={wallet.walletAddress}
                isVotingEligible={isVotingEligible}
                hasVoted={hasVoted}
                disableVoting={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No templates found matching your criteria.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setFilterAIEnhanced(false)
              }}
              className="mt-4 text-purple-400"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
      <SynthFiFooter /> {/* Restoring Footer call */}
      {selectedTemplateForInfo && (
        <TemplateInfoModal
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          template={selectedTemplateForInfo}
          onVote={handleVote}
          onConfigure={handleUseTemplateFromInfoModal}
          isVotingEligible={isVotingEligible}
          hasVoted={hasVoted}
          disableVoting={false}
        />
      )}
      {configuringTemplate && (
        <TemplateConfigurationModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          template={configuringTemplate}
          onContinueToLaunchpad={handleLaunchFromConfigModal}
        />
      )}
    </div>
  )
}
