"use client"

import type { AITemplate } from "./template-types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getIconComponent } from "@/lib/template-icon-utils"
import { ThumbsUp, CheckCircle2, Zap, X } from "lucide-react"

interface TemplateInfoModalProps {
  template: AITemplate | null
  isOpen: boolean
  onClose: () => void
  onConfigure: (template: AITemplate) => void
  onVote: (templateId: string) => void
  isVotingEligible: boolean // Now means: is Phantom wallet connected?
  hasVoted: (templateId: string) => boolean
  disableVoting?: boolean // Kept for potential future use
}

export function TemplateInfoModal({
  template,
  isOpen,
  onClose,
  onConfigure,
  onVote,
  isVotingEligible,
  hasVoted,
  disableVoting,
}: TemplateInfoModalProps) {
  if (!template) return null

  const IconComponent = getIconComponent(template.icon)
  const userHasVotedThisTemplate = hasVoted(template.id) // Assumes walletAddress is available in parent for hasVoted

  const handleVoteClick = () => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#131A2C] border-zinc-700 text-white max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            {IconComponent && <IconComponent className="h-10 w-10 text-purple-400" />}
            <DialogTitle className="text-2xl font-bold text-purple-300">{template.name}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">{template.description}</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-200">Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>
                <span className="text-gray-500">Author:</span>{" "}
                <span className="text-purple-400">{template.author}</span>
              </p>
              <p>
                <span className="text-gray-500">Category:</span> {template.category}
              </p>
              <p>
                <span className="text-gray-500">Uses:</span> {template.useCount || 0}
              </p>
              <p>
                <span className="text-gray-500">Votes:</span> {template.voteCount || 0}
              </p>
              <p>
                <span className="text-gray-500">Chains:</span> {template.chainCompatibility?.join(", ") || "N/A"}
              </p>
              <p>
                <span className="text-gray-500">Official:</span> {template.isOfficial ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-200">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {template.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-zinc-700 text-zinc-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {template.fullPrompt && (
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-200">Full Prompt</h3>
              <pre className="bg-zinc-800 p-3 rounded-md text-sm text-gray-300 whitespace-pre-wrap font-mono">
                <code>{template.fullPrompt}</code>
              </pre>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <Button onClick={onClose} variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700">
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
          <div className="flex gap-2">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex-1 ${voteButtonActuallyDisabled ? "cursor-not-allowed" : ""}`}>
                    <Button
                      onClick={handleVoteClick}
                      variant={userHasVotedThisTemplate ? "ghost" : "outline"}
                      className={`w-full ${
                        userHasVotedThisTemplate
                          ? "text-green-400 border-green-500/30 hover:bg-green-500/10"
                          : "border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                      } ${voteButtonActuallyDisabled && !userHasVotedThisTemplate ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={voteButtonActuallyDisabled}
                    >
                      {userHasVotedThisTemplate ? (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      ) : (
                        <ThumbsUp className="h-4 w-4 mr-2" />
                      )}
                      {userHasVotedThisTemplate ? "Voted" : "Vote"}
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
            <Button onClick={() => onConfigure(template)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Zap className="mr-2 h-4 w-4" /> Use Template
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
