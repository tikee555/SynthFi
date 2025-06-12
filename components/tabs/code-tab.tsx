"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Sparkles, Loader2 } from "lucide-react"
import { generateContractExplanation } from "@/lib/ai-feedback-engine"

interface CodeTabProps {
  code: string
}

export function CodeTab({ code }: CodeTabProps) {
  const [copied, setCopied] = useState(false)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [isExplaining, setIsExplaining] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExplainCode = async () => {
    setIsExplaining(true)
    setExplanation(null) // Clear previous explanation
    try {
      const aiExplanation = await generateContractExplanation(code)
      setExplanation(aiExplanation)
    } catch (error) {
      console.error("Error generating code explanation:", error)
      setExplanation("Sorry, an error occurred while generating the explanation.")
    }
    setIsExplaining(false)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-200">Rust Code (Anchor-based)</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleExplainCode}
            disabled={isExplaining}
            className="text-gray-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            {isExplaining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Explain My Code
          </Button>
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="text-gray-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied!" : "Copy Code"}
          </Button>
        </div>
      </div>

      <div className="bg-[#0d111c] rounded-lg p-4 overflow-auto flex-1">
        <pre className="text-gray-300 font-mono text-sm">
          <code>{code}</code>
        </pre>
      </div>

      {explanation && (
        <div className="mt-6 p-4 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-300">
          <h4 className="text-lg font-semibold mb-3 text-gray-100">AI Code Explanation:</h4>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{explanation}</pre>
        </div>
      )}
    </div>
  )
}
