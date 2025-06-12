"use client"

import { useState, type FormEvent, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Import types from the central location
import type { TemplateCategory, IconName } from "@/components/templates/template-types"
import * as Icons from "lucide-react" // To get all icon names

export interface NewTemplateData {
  name: string
  description: string
  prompt: string
  category: TemplateCategory // Use TemplateCategory
  tags: string[]
  icon: IconName
}

interface SubmitTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: NewTemplateData) => void
  categories: TemplateCategory[] // Use TemplateCategory
  initialPrompt?: string
}

// Dynamically get available icon names from lucide-react
const availableIcons = Object.keys(Icons).filter(
  (key) => key !== "createLucideIcon" && key !== "LucideIcon" && typeof Icons[key as keyof typeof Icons] === "object",
) as IconName[]

export function SubmitTemplateModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialPrompt,
}: SubmitTemplateModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [prompt, setPrompt] = useState("")
  const [category, setCategory] = useState<TemplateCategory>(categories[0] || "Other")
  const [tags, setTags] = useState("")
  const [icon, setIcon] = useState<IconName>("Package")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && initialPrompt) {
      setPrompt(initialPrompt)
    }
    if (!isOpen) {
      // Optionally reset fields, or handle in handleSubmit
    }
  }, [isOpen, initialPrompt])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !description.trim() || !prompt.trim() || !category) {
      setError("Please fill in all required fields: Name, Description, Prompt, and Category.")
      return
    }
    setError(null)
    onSubmit({
      name,
      description,
      prompt,
      category,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      icon,
    })
    // Reset form for next submission
    setName("")
    setDescription("")
    setPrompt("")
    setCategory(categories[0] || "Other")
    setTags("")
    setIcon("Package")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-[#131A2C] border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Submit New AI Template</DialogTitle>
          <DialogDescription className="text-gray-400">
            Share your AI prompt template with the community. Please ensure it's clear and useful.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <Label htmlFor="template-name" className="text-gray-300">
              Template Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Advanced Staking Pool"
              className="bg-zinc-800 border-zinc-700 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="template-description" className="text-gray-300">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly explain what this template does and its key features."
              className="bg-zinc-800 border-zinc-700 focus:ring-purple-500 min-h-[80px]"
              required
            />
          </div>
          <div>
            <Label htmlFor="template-prompt" className="text-gray-300">
              AI Prompt <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="template-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the full AI prompt here. Use placeholders like [TOKEN_NAME] if needed."
              className="bg-zinc-800 border-zinc-700 focus:ring-purple-500 min-h-[120px]"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="template-category" className="text-gray-300">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={category} onValueChange={(value) => setCategory(value as TemplateCategory)} required>
                <SelectTrigger id="template-category" className="bg-zinc-800 border-zinc-700 focus:ring-purple-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-gray-200">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize hover:bg-zinc-700">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="template-icon" className="text-gray-300">
                Icon
              </Label>
              <Select value={icon} onValueChange={(value) => setIcon(value as IconName)}>
                <SelectTrigger id="template-icon" className="bg-zinc-800 border-zinc-700 focus:ring-purple-500">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-gray-200 max-h-60">
                  {availableIcons.map((iconName) => (
                    <SelectItem key={iconName} value={iconName} className="capitalize hover:bg-zinc-700">
                      {iconName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="template-tags" className="text-gray-300">
              Tags (comma-separated)
            </Label>
            <Input
              id="template-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., staking, high-yield, nft"
              className="bg-zinc-800 border-zinc-700 focus:ring-purple-500"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-zinc-600 hover:bg-zinc-700">
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Submit Template
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
