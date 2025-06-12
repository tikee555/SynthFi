"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatNumber, shortenAddress } from "@/lib/utils"

interface TokenCardProps {
  token: {
    id: string
    name: string
    symbol: string
    logo: string
    marketCap: number
    price: number
    launchDate: string
    contractAddress: string
    isVerified: boolean
    isTrending: boolean
    category: string
  }
}

// Function to get token image based on category
function getTokenImage(category: string, symbol: string) {
  // Use a reliable placeholder service with color based on category
  const colors: Record<string, string> = {
    DEX: "7c3aed", // purple
    STAKE: "2563eb", // blue
    LEND: "16a34a", // green
    NFT: "db2777", // pink
    GOV: "ea580c", // orange
  }

  const color = colors[category] || "6b7280" // default gray
  return `https://placehold.co/600x400/${color}/ffffff?text=${symbol}`
}

export function TokenCard({ token }: TokenCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const tokenImage = getTokenImage(token.category, token.symbol)

  return (
    <Link
      href={`/token/${token.id}`}
      className="block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-[#0f172a] rounded-lg border border-zinc-800 overflow-hidden transition-all duration-200 hover:border-purple-600/50 hover:shadow-[0_0_15px_rgba(147,51,234,0.15)]">
        <div className="relative aspect-video w-full overflow-hidden bg-[#1e293b]">
          <img
            src={tokenImage || "/placeholder.svg"}
            alt={token.name}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {token.isVerified && (
              <div className="bg-green-900/70 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Verified
              </div>
            )}
            {token.isTrending && (
              <div className="bg-orange-900/70 text-orange-400 text-xs px-2 py-1 rounded-full flex items-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                Trending
              </div>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <div className="bg-zinc-900/80 text-xs px-2 py-1 rounded-full">{token.category}</div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1e293b] mr-2 border border-zinc-700">
                <img
                  src={`https://placehold.co/100x100/${token.category === "DEX" ? "7c3aed" : token.category === "STAKE" ? "2563eb" : token.category === "LEND" ? "16a34a" : token.category === "NFT" ? "db2777" : token.category === "GOV" ? "ea580c" : "6b7280"}/ffffff?text=${token.symbol}`}
                  alt={token.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{token.name}</h3>
                <div className="text-xs text-gray-400">{token.symbol}</div>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full"
              onClick={(e) => {
                e.preventDefault()
                window.open(`https://jup.ag/swap/SOL-${token.symbol}`, "_blank")
              }}
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
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
              <span className="sr-only">Swap</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-gray-400">Price</div>
              <div className="font-medium">{formatCurrency(token.price)}</div>
            </div>
            <div>
              <div className="text-gray-400">Market Cap</div>
              <div className="font-medium">{formatNumber(token.marketCap)}</div>
            </div>
            <div>
              <div className="text-gray-400">Launch</div>
              <div className="font-medium">{new Date(token.launchDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-gray-400">Contract</div>
              <div className="font-medium">{shortenAddress(token.contractAddress)}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
