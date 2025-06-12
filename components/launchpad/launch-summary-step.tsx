"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, Star } from "react-feather" // Added Star, kept Edit3 in case it's used elsewhere or for future.

interface LaunchSummaryStepProps {
  contractData: {
    name: string
    symbol: string
    contractId: string // This is the tokenId
    poolAddress: string
  }
}

export function LaunchSummaryStep({ contractData }: LaunchSummaryStepProps) {
  const handleBuildPageClick = () => {
    // Store minimal info for pre-filling the builder for a new token
    const newLaunchInfo = {
      contractId: contractData.contractId,
      name: contractData.name,
      symbol: contractData.symbol,
    }
    localStorage.setItem("newlyLaunchedTokenInfo", JSON.stringify(newLaunchInfo))
  }

  return (
    <div className="space-y-8">
      <div className="bg-[#0f172a] rounded-lg p-6 border border-zinc-800">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              width="32"
              height="32"
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
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">Launch Complete (Devnet Simulation)</h2>

        <div className="bg-[#1e293b] rounded-lg p-4 mb-6 space-y-4">
          <div>
            <h3 className="text-gray-400 text-sm mb-1">Token Name</h3>
            <p className="font-medium">
              {contractData.name} ({contractData.symbol})
            </p>
          </div>

          <div>
            <h3 className="text-gray-400 text-sm mb-1">Contract ID</h3>
            <div className="flex items-center">
              <p className="font-medium text-sm mr-2">{contractData.contractId}</p>
              <a
                href={`https://explorer.solana.com/address/${contractData.contractId}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-500 hover:text-purple-400"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-400 text-sm mb-1">Pool Address</h3>
            <div className="flex items-center">
              <p className="font-medium text-sm mr-2">{contractData.poolAddress}</p>
              <a
                href={`https://explorer.solana.com/address/${contractData.poolAddress}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-500 hover:text-purple-400"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Link href={`/token/${contractData.contractId}`}>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Eye className="mr-2 h-4 w-4" /> View Token Details
            </Button>
          </Link>
          <Link
            href={`/landing-builder/${contractData.contractId}?tokenName=${encodeURIComponent(contractData.name)}&tokenSymbol=${encodeURIComponent(contractData.symbol)}`}
            onClick={handleBuildPageClick}
          >
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              <Star className="mr-2 h-4 w-4" /> Build Token Page (AI)
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white">Start New Build</Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full border-zinc-700 text-gray-300 hover:bg-zinc-900">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
