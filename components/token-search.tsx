"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Function to get token image based on category
function getTokenImage(category: string, symbol: string, size = 30) {
  const colors: Record<string, string> = {
    DEX: "7c3aed",
    STAKE: "2563eb",
    LEND: "16a34a",
    NFT: "db2777",
    GOV: "ea580c",
  }

  const color = colors[category] || "6b7280"
  return `https://placehold.co/${size}x${size}/${color}/ffffff?text=${symbol}`
}

// Mock tokens data
const mockTokens = [
  {
    id: "dex-token",
    name: "DEX Token",
    symbol: "DEX",
    category: "DEX",
    isVerified: true,
  },
  {
    id: "stake-pool",
    name: "Stake Pool",
    symbol: "STAKE",
    category: "STAKE",
    isVerified: true,
  },
  {
    id: "vesting-token",
    name: "Vesting Token",
    symbol: "VEST",
    category: "LEND",
    isVerified: true,
  },
  {
    id: "nft-marketplace",
    name: "NFT Marketplace",
    symbol: "NFTM",
    category: "NFT",
    isVerified: false,
  },
  {
    id: "lending-protocol",
    name: "Lending Protocol",
    symbol: "LEND",
    category: "LEND",
    isVerified: true,
  },
  {
    id: "governance-dao",
    name: "Governance DAO",
    symbol: "GOV",
    category: "GOV",
    isVerified: true,
  },
  {
    id: "yield-farm",
    name: "Yield Farm",
    symbol: "FARM",
    category: "STAKE",
    isVerified: false,
  },
]

export function TokenSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const filteredTokens = searchQuery
    ? mockTokens.filter(
        (token) =>
          token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < filteredTokens.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < filteredTokens.length) {
        router.push(`/token/${filteredTokens[selectedIndex].id}`)
        setSearchQuery("")
        setShowResults(false)
      }
    } else if (e.key === "Escape") {
      setShowResults(false)
      setSelectedIndex(-1)
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search tokens..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowResults(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 bg-[#1e293b] border-zinc-700 text-white placeholder:text-gray-500"
        />
      </div>

      {showResults && filteredTokens.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#1e293b] border border-zinc-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          <div className="p-2">
            <div className="text-xs text-gray-400 px-3 py-2">Tokens</div>
            {filteredTokens.map((token, index) => (
              <Link
                key={token.id}
                href={`/token/${token.id}`}
                onClick={() => {
                  setSearchQuery("")
                  setShowResults(false)
                }}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a324a] transition-colors ${
                  index === selectedIndex ? "bg-[#2a324a]" : ""
                }`}
              >
                <img
                  src={getTokenImage(token.category, token.symbol) || "/placeholder.svg"}
                  alt={token.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {token.name}
                    {token.isVerified && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">{token.symbol}</div>
                </div>
                <div className="text-xs text-gray-500">{token.category}</div>
              </Link>
            ))}
          </div>

          <div className="border-t border-zinc-700 p-2">
            <Link
              href="/explore"
              onClick={() => {
                setSearchQuery("")
                setShowResults(false)
              }}
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-[#2a324a] text-sm text-gray-400"
            >
              <Search className="w-4 h-4" />
              View all tokens
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
