"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider" // Import Slider
import { Input } from "@/components/ui/input" // For token cost input alongside slider
import { CheckCircle2 } from "lucide-react" // For preview panel icons

interface AIProtocolIntegrationProps {
  selectedTemplate: string | null
  onSelectTemplate: (templateId: string) => void
  utilityDescription: string
  onUpdateDescription: (description: string) => void
  // No aiInstruction prop was previously defined for this component,
  // utilityDescription is used for the textarea.
}

// Define AI templates with their descriptions for autopopulation
const aiUtilityTemplates = [
  {
    id: "governance",
    title: "Governance Automation",
    description:
      "Automate governance proposals and voting based on predefined rules and thresholds. AI will analyze proposal sentiment, check for conflicts, and execute approved on-chain actions.",
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple-500"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    id: "predictive",
    title: "Predictive Usage Analytics",
    description:
      "Analyze on-chain usage patterns and predict future trends to optimize protocol parameters. AI models will forecast demand, identify potential bottlenecks, and suggest adaptive fee structures.",
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple-500"
      >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    id: "feedback",
    title: "Continuous Feedback Agent",
    description:
      "Gather and analyze user feedback from various channels (Discord, forums, on-chain messages) to improve protocol functionality. AI will perform sentiment analysis and categorize suggestions.",
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple-500"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    id: "security",
    title: "Security Monitoring",
    description:
      "Monitor transactions in real-time for suspicious activity and potential security threats. AI will use anomaly detection to flag unusual patterns and alert administrators.",
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple-500"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "treasury",
    title: "Treasury Management",
    description:
      "Optimize treasury management with AI-driven investment strategies and risk assessment. AI will analyze market conditions and propose diversification or yield farming opportunities.",
    icon: (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple-500"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
]

export function AIProtocolIntegration({
  selectedTemplate,
  onSelectTemplate,
  utilityDescription,
  onUpdateDescription,
}: AIProtocolIntegrationProps) {
  const [tokenCost, setTokenCost] = useState(100) // Default token cost

  const handleTemplateSelect = (templateId: string) => {
    onSelectTemplate(templateId)
    const template = aiUtilityTemplates.find((t) => t.id === templateId)
    if (template) {
      onUpdateDescription(template.description)
    }
  }

  return (
    <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-4 space-y-4">
      <div className="flex items-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-500 mr-2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <h3 className="font-medium text-white">AI Protocol Integration</h3>
      </div>

      <div className="bg-purple-900/20 border border-purple-900 rounded-lg p-3">
        <div className="flex items-center mb-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-purple-500 mr-2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="text-sm font-medium text-purple-300">SYNTHFI Token Required</span>
        </div>
        <p className="text-xs text-gray-400">
          A fee of $50 worth of SYNTHFI tokens will be charged upon deployment for AI integration.
        </p>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-2">Select AI Utility Template</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {aiUtilityTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? "bg-purple-900/30 border border-purple-600"
                  : "bg-[#1e293b] border border-zinc-700 hover:border-purple-600/50"
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  {template.icon}
                </div>
                <div>
                  <h4 className="text-xs font-medium text-white">{template.title}</h4>
                  {/* Removed description from here to avoid redundancy, it populates textarea */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-2">Describe AI Utility</label>
        <Textarea
          value={utilityDescription}
          onChange={(e) => onUpdateDescription(e.target.value)}
          placeholder="Describe how AI will be used with your dApp, or select a template..."
          className="bg-[#1e293b] border-zinc-700 text-white min-h-[100px] text-xs"
        />
      </div>

      {/* Token Utility Pricing Slider */}
      <div>
        <label className="block text-xs text-gray-400 mb-2">Tokens Required Per AI Feature Usage</label>
        <div className="flex items-center gap-3">
          <Slider
            value={[tokenCost]}
            onValueChange={(value) => setTokenCost(value[0])}
            min={10}
            max={1000}
            step={10}
            className="flex-1"
          />
          <div className="w-28">
            <Input
              type="number"
              value={tokenCost}
              onChange={(e) => setTokenCost(Math.max(10, Math.min(1000, Number(e.target.value))))}
              min={10}
              max={1000}
              step={10}
              className="bg-[#1e293b] border-zinc-700 text-white text-xs h-8"
            />
          </div>
        </div>
        <p className="text-xs text-purple-400 mt-1 text-right pr-1">{tokenCost} tokens per feature usage</p>
      </div>

      {/* AI Integration Preview Panel */}
      <div>
        <h4 className="text-xs font-medium text-gray-300 mb-2">AI Integration Preview:</h4>
        <div className="space-y-1.5 text-xs text-gray-400 bg-[#1e293b] border border-zinc-700 rounded-md p-3">
          <div className="flex items-center">
            <CheckCircle2 size={14} className="text-green-500 mr-2 flex-shrink-0" />
            <span>Smart Contract Integration Module</span>
          </div>
          <div className="flex items-center">
            <CheckCircle2 size={14} className="text-green-500 mr-2 flex-shrink-0" />
            <span>Token Utility Mechanism (Pay-per-use with SYNTHFI)</span>
          </div>
          <div className="flex items-center">
            <CheckCircle2 size={14} className="text-green-500 mr-2 flex-shrink-0" />
            <span>AI Model API Connectors</span>
          </div>
          {selectedTemplate === "predictive" && (
            <div className="flex items-center">
              <CheckCircle2 size={14} className="text-green-500 mr-2 flex-shrink-0" />
              <span>Oracle Integration for External Data (e.g., market prices)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
