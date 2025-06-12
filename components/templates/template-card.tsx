"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { AITemplate } from "./template-types"
import { getIconComponent } from "@/lib/template-icon-utils"
import { ThumbsUp, CheckCircle2, Info, Zap, BrainCircuit } from "lucide-react"

interface TemplateCardProps {
  template: AITemplate
  onConfigureTemplate: (template: AITemplate) => void
  onMoreInfo: (template: AITemplate) => void
  onVote: (templateId: string) => void
  currentUserWalletAddress: string | null // Can still be used to check if *this* user voted
  isVotingEligible: boolean // Now means: is Phantom wallet connected?
  hasVoted: (templateId: string) => boolean
  className?: string
  disableVoting?: boolean // Kept for potential future use, but not actively used by page now
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onConfigureTemplate,
  onMoreInfo,
  onVote,
  currentUserWalletAddress,
  isVotingEligible,
  hasVoted,
  className,
  disableVoting,
}) => {
  const IconComponent = getIconComponent(template.icon)
  const userHasVotedThisTemplate = currentUserWalletAddress ? hasVoted(template.id) : false

  const handleVoteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isVotingEligible && !userHasVotedThisTemplate && !disableVoting) {
      onVote(template.id)
    }
  }

  const voteButtonActuallyDisabled = userHasVotedThisTemplate || !isVotingEligible || disableVoting
  let voteButtonTooltipContent = ""
  if (userHasVotedThisTemplate) {
    voteButtonTooltipContent = "You have already voted for this template."
  } else if (!isVotingEligible) {
    voteButtonTooltipContent = "Connect your Phantom wallet to vote."
  } else if (disableVoting) {
    voteButtonTooltipContent = "Voting is temporarily disabled."
  }

  return (
    <Card
      className={`flex flex-col h-full bg-[#131A2C] border border-zinc-700 hover:border-purple-500/70 transition-colors duration-200 shadow-lg ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            {IconComponent && <IconComponent className="h-8 w-8 text-purple-400" />}
            <CardTitle className="text-xl font-semibold text-gray-100">{template.name}</CardTitle>
          </div>
          <div className="flex flex-col items-end gap-1">
            {template.isOfficial && (
              <span className="text-xs bg-green-500/80 text-white px-2 py-0.5 rounded-full font-medium">Official</span>
            )}
            {template.supportsAI && (
              <span className="text-xs border border-sky-500 text-sky-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <BrainCircuit size={14} /> AI Enhanced
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <p className="text-sm text-gray-400 mb-3 line-clamp-3 h-16">{template.description}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {template.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
        {template.category && (
          <div className="text-xs text-gray-500 mb-1">
            Category: <span className="text-gray-400">{template.category}</span>
          </div>
        )}
        <div className="text-xs text-gray-500 mb-1">
          By: <span className="font-medium text-purple-400">{template.author || "SynthFi"}</span>
        </div>
        {template.chainCompatibility && template.chainCompatibility.length > 0 && (
          <div className="text-xs text-gray-500">Chains: {template.chainCompatibility.join(", ")}</div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-700/50 !mt-auto">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex-1 ${voteButtonActuallyDisabled ? "cursor-not-allowed" : ""}`}>
                <Button
                  onClick={handleVoteClick}
                  variant={userHasVotedThisTemplate ? "ghost" : "outline"}
                  size="sm"
                  className={`w-full ${
                    userHasVotedThisTemplate
                      ? "text-green-400 border-green-500/30 hover:bg-green-500/10"
                      : "border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                  } ${voteButtonActuallyDisabled && !userHasVotedThisTemplate ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={voteButtonActuallyDisabled}
                  aria-label={userHasVotedThisTemplate ? "Voted" : "Vote for this template"}
                >
                  {userHasVotedThisTemplate ? (
                    <CheckCircle2 className="h-4 w-4 mr-1 sm:mr-2" />
                  ) : (
                    <ThumbsUp className="h-4 w-4 mr-1 sm:mr-2" />
                  )}
                  <span className="hidden sm:inline">Votes:</span>&nbsp;{template.voteCount || 0}
                </Button>
              </div>
            </TooltipTrigger>
            {voteButtonTooltipContent && (
              <TooltipContent className="bg-zinc-800 text-white border-zinc-700">
                <p>{voteButtonTooltipContent}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <Button
          onClick={(e) => {
            e.stopPropagation()
            onMoreInfo(template)
          }}
          variant="outline"
          size="sm"
          className="w-full border-sky-500 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
        >
          <Info className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">More </span>Info
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onConfigureTemplate(template)
          }}
          size="sm"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Zap className="h-4 w-4 mr-1 sm:mr-2" />
          Use<span className="hidden sm:inline"> Template</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default TemplateCard
