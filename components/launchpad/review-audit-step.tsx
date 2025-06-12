"use client"
import { Button } from "@/components/ui/button"

interface ReviewAuditStepProps {
  prompt: string
  aiPrompt?: string
  enableAI?: boolean
  contractData: {
    name: string
    symbol: string
    hasIssues: boolean
    issues: string[]
    aiIntegration?: boolean
    aiTemplate?: string
  }
  onFixIssues: () => void
  onContinue: () => void
}

export function ReviewAuditStep({
  prompt,
  aiPrompt,
  enableAI,
  contractData,
  onFixIssues,
  onContinue,
}: ReviewAuditStepProps) {
  return (
    <div className="space-y-8">
      <div className="bg-[#0f172a] rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Contract Summary</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-400 text-sm mb-2">Original Prompt</h3>
            <p className="bg-[#1e293b] p-3 rounded-lg text-gray-300">{prompt || "No prompt provided"}</p>
          </div>

          {enableAI && aiPrompt && (
            <div>
              <h3 className="text-gray-400 text-sm mb-2">AI Integration</h3>
              <div className="bg-[#1e293b] p-3 rounded-lg text-gray-300">
                <div className="flex items-center mb-2">
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
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span className="font-medium">AI Capabilities</span>
                </div>
                <p>{aiPrompt}</p>
              </div>
            </div>
          )}

          {enableAI && contractData.aiTemplate && (
            <div>
              <h3 className="text-gray-400 text-sm mb-2">AI Template</h3>
              <div className="bg-[#1e293b] p-3 rounded-lg text-gray-300">
                <div className="flex items-center mb-2">
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
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <span className="font-medium">Selected Template: {contractData.aiTemplate}</span>
                </div>
                <p>This template will be applied to your contract during deployment.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#0f172a] rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Audit Report</h2>

        {contractData.hasIssues ? (
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-500"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="text-lg font-medium text-yellow-500">Issues Found</div>
            </div>

            <ul className="space-y-2 mb-6">
              {contractData.issues.map((issue, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-yellow-500 mr-2 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>

            <Button onClick={onFixIssues} className="bg-yellow-600 hover:bg-yellow-700 text-white mr-4">
              Fix Issues
            </Button>

            <Button onClick={onContinue} variant="outline" className="border-zinc-700 text-gray-300 hover:bg-zinc-800">
              Continue Anyway
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-500"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="text-lg font-medium text-green-500">No Issues Found</div>
            </div>

            <Button onClick={onContinue} className="bg-purple-600 hover:bg-purple-700 text-white">
              Continue to Token Details
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
