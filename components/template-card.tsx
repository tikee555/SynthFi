// This file is reverted to a basic placeholder as its previous_blocks version was "left out for brevity".
// Please restore your original version of this file if it was more complex.
"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react" // Assuming you might use Lucide icons

export interface AITemplate {
  id: string
  name: string
  description: string
  prompt: string
  aiInstruction?: string
  author?: string
  category: string
  tags?: string[]
  icon?: LucideIcon | string // Can be a Lucide component or a string for an emoji/image path
  createdAt?: string
  updatedAt?: string
  useCount?: number
  version?: string
  isStaffPick?: boolean
  chainCompatibility?: string[]
  submittedBy?: string // Wallet address of submitter
  voteCount?: number
  isOfficial?: boolean
}

interface TemplateCardProps {
  template: AITemplate
  onUseTemplate: (template: AITemplate) => void
  onMoreInfo: (template: AITemplate) => void
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUseTemplate, onMoreInfo }) => {
  return (
    <div className="bg-[#131A2C] border border-zinc-700 rounded-lg p-5 shadow-lg flex flex-col h-full">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">{template.name}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-3">{template.description}</p>
        <p className="text-xs text-gray-500">Category: {template.category}</p>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Button
          onClick={() => onMoreInfo(template)}
          variant="outline"
          className="w-full sm:w-auto border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
        >
          More Info
        </Button>
        <Button
          onClick={() => onUseTemplate(template)}
          className="w-full sm:w-auto flex-1 bg-purple-600 hover:bg-purple-700"
        >
          Use Template
        </Button>
      </div>
    </div>
  )
}

// Default export if this is the primary export of the file
export default TemplateCard
