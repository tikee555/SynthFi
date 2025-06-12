"use client"

import { useState, useEffect } from "react"
import { SynthFiFooter } from "@/components/synthfi-footer" // Restoring named import for Footer
import { TokenCard } from "@/components/token-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const mockTokens = [
  {
    id: "dex-token",
    name: "DEX Token",
    symbol: "DEX",
    logo: "",
    marketCap: 8900000,
    price: 1.24,
    launchDate: "2023-11-20",
    contractAddress: "3RmNUxZVJKtLpWqS8xGhTvY",
    isVerified: true,
    isTrending: true,
    category: "DEX",
  },
  {
    id: "stake-pool",
    name: "Stake Pool",
    symbol: "STAKE",
    logo: "",
    marketCap: 2300000,
    price: 0.18,
    launchDate: "2024-01-05",
    contractAddress: "7YGbUpXYmVSDXUNHfxCkLH2xKjd",
    isVerified: true,
    isTrending: false,
    category: "STAKE",
  },
  {
    id: "vesting-token",
    name: "Vesting Token",
    symbol: "VEST",
    logo: "",
    marketCap: 1800000,
    price: 0.09,
    launchDate: "2024-02-10",
    contractAddress: "9ZQmVpTrUxHJK2LMnPwS4VbF",
    isVerified: true,
    isTrending: false,
    category: "LEND",
  },
  {
    id: "nft-marketplace",
    name: "NFT Marketplace",
    symbol: "NFTM",
    logo: "",
    marketCap: 3400000,
    price: 0.31,
    launchDate: "2024-01-25",
    contractAddress: "5TqPwXyZVJKtLpWqS8xGhTvY",
    isVerified: false,
    isTrending: true,
    category: "NFT",
  },
  {
    id: "lending-protocol",
    name: "Lending Protocol",
    symbol: "LEND",
    logo: "",
    marketCap: 4700000,
    price: 0.56,
    launchDate: "2023-12-05",
    contractAddress: "8HqNUxZVJKtLpWqS8xGhTvY",
    isVerified: true,
    isTrending: false,
    category: "LEND",
  },
  {
    id: "governance-dao",
    name: "Governance DAO",
    symbol: "GOV",
    logo: "",
    marketCap: 2900000,
    price: 0.22,
    launchDate: "2024-02-01",
    contractAddress: "1KmNUxZVJKtLpWqS8xGhTvY",
    isVerified: true,
    isTrending: false,
    category: "GOV",
  },
  {
    id: "yield-farm",
    name: "Yield Farm",
    symbol: "FARM",
    logo: "",
    marketCap: 1200000,
    price: 0.08,
    launchDate: "2024-02-20",
    contractAddress: "6PqNUxZVJKtLpWqS8xGhTvY",
    isVerified: false,
    isTrending: true,
    category: "STAKE",
  },
]

export default function WatchlistPage() {
  const [watchedTokens, setWatchedTokens] = useState<any[]>([])
  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem("tokenWatchlist") || "[]")
    const tokens = mockTokens.filter((token) => watchlist.includes(token.id))
    setWatchedTokens(tokens)
  }, [])
  const clearWatchlist = () => {
    localStorage.setItem("tokenWatchlist", "[]")
    setWatchedTokens([])
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
              <p className="text-gray-400">Track your favorite tokens</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Link href="/explore">
                <Button variant="outline" className="border-zinc-700 text-gray-300 hover:bg-[#1e293b] hover:text-white">
                  Explore Tokens{" "}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </Button>
              </Link>
              {watchedTokens.length > 0 && (
                <Button
                  onClick={clearWatchlist}
                  variant="outline"
                  className="border-red-900 text-red-500 hover:bg-red-900/20 hover:text-red-400"
                >
                  Clear Watchlist
                </Button>
              )}
            </div>
          </div>
          {watchedTokens.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchedTokens.map((token) => (
                <TokenCard key={token.id} token={token} />
              ))}
            </div>
          ) : (
            <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-12 text-center">
              <div className="w-16 h-16 bg-[#1e293b] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Your watchlist is empty</h3>
              <p className="text-gray-400 mb-6">Start watching tokens to track their performance</p>
              <Link href="/explore">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Explore Tokens</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <SynthFiFooter /> {/* Restoring Footer call */}
    </div>
  )
}
