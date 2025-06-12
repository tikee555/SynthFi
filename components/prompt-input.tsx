"use client"

import type React from "react"
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import { Textarea } from "@/components/ui/textarea"

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
}

export interface PromptInputRef {
  focus: () => void
}

const PromptInput = forwardRef<PromptInputRef, PromptInputProps>(
  ({ value, onChange, placeholder, className = "" }, ref) => {
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Expose the focus method
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      },
    }))

    // Focus the textarea when the component mounts
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value)
    }

    return (
      <div className="relative" onClick={() => inputRef.current?.focus()}>
        <Textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`min-h-[200px] bg-[#0f172a] border-zinc-800 text-white resize-none rounded-lg ${className}`}
        />
      </div>
    )
  },
)

PromptInput.displayName = "PromptInput"

export default PromptInput
