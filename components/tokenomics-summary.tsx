"use client"

import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface TokenomicsSummaryProps {
  code: string
  prompt: string
  onFixTokenomics?: (fixedCode: string) => void
}

export function TokenomicsSummary({ code, prompt, onFixTokenomics }: TokenomicsSummaryProps) {
  const [tokenomics, setTokenomics] = useState(() => analyzeTokenomics(code, prompt))
  const [isFixing, setIsFixing] = useState(false)
  const [fixed, setFixed] = useState(false)

  const handleFixTokenomics = () => {
    setIsFixing(true)

    // Simulate fixing the tokenomics
    setTimeout(() => {
      const fixedTokenomics = {
        ...tokenomics,
        mintAuthority: "Revoked",
        supplyCap: "1,000,000",
        warnings: tokenomics.warnings.filter((warning) => !warning.includes("unlimited minting")),
      }

      setTokenomics(fixedTokenomics)
      setIsFixing(false)
      setFixed(true)

      // Generate fixed code and pass it to the parent component
      if (onFixTokenomics) {
        const fixedCode = generateFixedCode(code)
        onFixTokenomics(fixedCode)
      }
    }, 1000)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-md p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Tokenomics Summary</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Token Name:</span>
            <span className="text-white font-medium">{tokenomics.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Supply Cap:</span>
            <span className="text-white font-medium">{tokenomics.supplyCap}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Mint Authority:</span>
            <div className="flex items-center">
              <span
                className={`font-medium ${tokenomics.mintAuthority === "Revoked" ? "text-green-400" : "text-red-400"}`}
              >
                {tokenomics.mintAuthority}
              </span>
              {tokenomics.mintAuthority === "Revoked" ? (
                <CheckCircle className="ml-1 h-4 w-4 text-green-400" />
              ) : (
                <AlertCircle className="ml-1 h-4 w-4 text-red-400" />
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Transfer Rules:</span>
            <span className="text-white font-medium">{tokenomics.transferRules}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Burn Mechanism:</span>
            <span className="text-white font-medium">{tokenomics.burnMechanism}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Ownership Lock:</span>
            <span className="text-white font-medium">{tokenomics.ownershipLock}</span>
          </div>
        </div>
      </div>

      {tokenomics.warnings.length > 0 && (
        <div className="space-y-2 mb-4">
          {tokenomics.warnings.map((warning, index) => (
            <Alert key={index} variant="destructive" className="bg-red-900/20 border-red-800">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300 text-sm">{warning}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {tokenomics.mintAuthority !== "Revoked" && !fixed && (
        <Button onClick={handleFixTokenomics} className="w-full bg-green-600 hover:bg-green-700" disabled={isFixing}>
          {isFixing ? "Fixing Tokenomics..." : "Fix Tokenomics Risk"}
        </Button>
      )}

      {fixed && (
        <Alert className="bg-green-900/20 border-green-800">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300 text-sm">
            Unlimited minting disabled. Supply cap set to 1,000,000 (default). You can edit this manually.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

function analyzeTokenomics(code: string, prompt: string) {
  // Check if minting should be enabled based on the prompt
  const mintingKeywords = ["rebase", "governance mint", "inflationary", "minting"]
  const shouldEnableMinting = mintingKeywords.some((keyword) => prompt.toLowerCase().includes(keyword))

  // This would be replaced with actual code analysis
  // For now, we'll simulate based on the prompt and new default behavior
  const isToken = prompt.toLowerCase().includes("token")
  const hasVesting = prompt.toLowerCase().includes("vesting")
  const hasSupplyCap = true // New default: always have a supply cap
  const hasMintAuthority = shouldEnableMinting // Only enable if explicitly requested
  const hasTransferRestrictions = prompt.toLowerCase().includes("whitelist") || prompt.toLowerCase().includes("gated")
  const hasBurnMechanism = prompt.toLowerCase().includes("burn")
  const hasOwnershipLock = prompt.toLowerCase().includes("lock")

  // Generate token name based on prompt
  let tokenName = "SynthToken"
  if (prompt.toLowerCase().includes("staking")) tokenName = "StakeToken"
  if (prompt.toLowerCase().includes("vesting")) tokenName = "VestToken"
  if (prompt.toLowerCase().includes("airdrop")) tokenName = "AirdropToken"

  // Generate warnings
  const warnings: string[] = []
  if (hasMintAuthority) {
    warnings.push("This token allows unlimited minting. This may be risky unless intended.")
  }
  if (!hasTransferRestrictions && isToken) {
    warnings.push("No transfer restrictions — consider adding checks for sensitive operations.")
  }
  if (!hasBurnMechanism && isToken) {
    warnings.push("No burn mechanism — consider adding one for token economics management.")
  }
  if (!hasOwnershipLock && isToken) {
    warnings.push("No ownership lock — consider implementing a timelock for ownership transfers.")
  }

  return {
    name: tokenName,
    supplyCap: hasSupplyCap ? "1,000,000" : "Unlimited",
    mintAuthority: hasMintAuthority ? "Enabled – Unlimited" : "Revoked",
    transferRules: hasTransferRestrictions ? "Restricted (whitelist/gating)" : "No restrictions",
    burnMechanism: hasBurnMechanism ? "Included" : "Not included",
    ownershipLock: hasOwnershipLock ? "Implemented" : "Not implemented",
    warnings,
  }
}

function generateFixedCode(originalCode: string): string {
  // In a real implementation, this would modify the actual code
  // For now, we'll simulate adding code to revoke mint authority and set supply cap

  // Find where to insert the fix
  const lines = originalCode.split("\n")
  let fixedCode = ""
  let initializeFunctionIndex = -1

  // Find the initialize function
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("pub fn initialize")) {
      initializeFunctionIndex = i
      break
    }
  }

  if (initializeFunctionIndex !== -1) {
    // Add code to revoke mint authority and set supply cap
    const fixedLines = [...lines]
    fixedLines.splice(
      initializeFunctionIndex + 2,
      0,
      "        // Set fixed supply cap to 1,000,000 tokens",
      "        program.total_supply = 1_000_000 * 10u64.pow(program.decimals as u32);",
      "        // Revoke mint authority after initialization",
      "        program.mint_authority = None;",
    )
    fixedCode = fixedLines.join("\n")
  } else {
    // If we can't find the initialize function, just return the original code
    fixedCode = originalCode
  }

  return fixedCode
}
