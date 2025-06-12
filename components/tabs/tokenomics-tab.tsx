"use client"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, AlertTriangle, InfoIcon } from "lucide-react"

interface TokenomicsRule {
  id: string
  text: string
  type: "rule" | "warning" // Or more specific types like 'feature', 'risk'
}

interface TokenomicsWarning {
  id: string
  text: string
  severity: "critical" | "warning" | "info"
}

interface TokenomicsData {
  name: string
  symbol: string
  totalSupply: string
  decimals?: string // Optional, but good to include
  mintAuthorityRevoked: boolean
  rules: TokenomicsRule[]
  warnings: TokenomicsWarning[]
  governance: string
  // Add any other fields you expect to display
}

interface TokenomicsTabProps {
  tokenomics: TokenomicsData | null // Allow null for initial state or errors
}

export function TokenomicsTab({ tokenomics }: TokenomicsTabProps) {
  if (!tokenomics) {
    return (
      <div className="p-6 text-center text-gray-400">
        <InfoIcon className="mx-auto h-12 w-12 mb-4 text-blue-500" />
        Tokenomics information is not yet available. Generate code to see details.
      </div>
    )
  }

  const getSeverityIcon = (severity: TokenomicsWarning["severity"]) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 mr-2 text-red-400 flex-shrink-0" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 mr-2 text-amber-400 flex-shrink-0" />
      case "info":
        return <InfoIcon className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
      default:
        return <InfoIcon className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
    }
  }

  const getSeverityColor = (severity: TokenomicsWarning["severity"]) => {
    switch (severity) {
      case "critical":
        return "text-red-300 bg-red-900/30 border-red-700/50"
      case "warning":
        return "text-amber-300 bg-amber-900/30 border-amber-700/50"
      case "info":
        return "text-blue-300 bg-blue-900/30 border-blue-700/50"
      default:
        return "text-gray-300 bg-zinc-800/30 border-zinc-700/50"
    }
  }

  return (
    <div className="space-y-6 p-1 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1A1F30] p-4 rounded-lg border border-zinc-700">
          <h3 className="font-semibold text-base text-purple-300 mb-2">Key Details</h3>
          <p>
            <strong>Name:</strong> {tokenomics.name || "N/A"}
          </p>
          <p>
            <strong>Symbol:</strong> {tokenomics.symbol || "N/A"}
          </p>
          <p>
            <strong>Total Supply:</strong> {tokenomics.totalSupply || "N/A"}
          </p>
          {tokenomics.decimals && (
            <p>
              <strong>Decimals:</strong> {tokenomics.decimals}
            </p>
          )}
          <p>
            <strong>Mint Authority:</strong>{" "}
            <Badge variant={tokenomics.mintAuthorityRevoked ? "destructive" : "default"} className="bg-opacity-50">
              {tokenomics.mintAuthorityRevoked ? "Revoked (Fixed Supply)" : "Active (Can Mint More)"}
            </Badge>
          </p>
          <p>
            <strong>Governance Model:</strong> {tokenomics.governance || "Not Specified"}
          </p>
        </div>

        {tokenomics.warnings && tokenomics.warnings.length > 0 && (
          <div className="bg-[#1A1F30] p-4 rounded-lg border border-zinc-700">
            <h3 className="font-semibold text-base text-red-400 mb-2">Alerts & Warnings</h3>
            <ul className="space-y-2">
              {tokenomics.warnings.map((warning) => (
                <li
                  key={warning.id}
                  className={`flex items-start p-2 rounded-md text-xs ${getSeverityColor(warning.severity)}`}
                >
                  {getSeverityIcon(warning.severity)}
                  <span>{warning.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {tokenomics.rules && tokenomics.rules.length > 0 && (
        <div className="bg-[#1A1F30] p-4 rounded-lg border border-zinc-700">
          <h3 className="font-semibold text-base text-purple-300 mb-3">Tokenomic Rules & Features</h3>
          <ul className="space-y-2">
            {tokenomics.rules.map((rule) => (
              <li
                key={rule.id}
                className="flex items-center p-2 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-gray-300 text-xs"
              >
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                <span>{rule.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!tokenomics.rules?.length && !tokenomics.warnings?.length && (
        <div className="bg-[#1A1F30] p-4 rounded-lg border border-zinc-700 text-center text-gray-500">
          No specific tokenomic rules or warnings generated from the prompt.
        </div>
      )}
    </div>
  )
}
