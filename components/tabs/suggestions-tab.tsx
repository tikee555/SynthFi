"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SuggestionsTabProps {
  suggestions: Array<{
    title: string
    description: string
    actionText: string
  }>
}

export function SuggestionsTab({ suggestions }: SuggestionsTabProps) {
  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>([])

  const handleApplySuggestion = (index: number) => {
    if (!appliedSuggestions.includes(index)) {
      setAppliedSuggestions([...appliedSuggestions, index])
    }
  }

  return (
    <div className="space-y-4 h-full overflow-auto">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="bg-[#0d111c] rounded-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4">
              <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">{suggestion.title}</h3>
              <p className="text-gray-300 mt-1">{suggestion.description}</p>
              <div className="mt-3">
                {appliedSuggestions.includes(index) ? (
                  <div className="flex items-center text-green-500">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Applied
                  </div>
                ) : (
                  <Button
                    onClick={() => handleApplySuggestion(index)}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                  >
                    {suggestion.actionText}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
