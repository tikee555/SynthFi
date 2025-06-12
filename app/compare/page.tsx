"use client"

import { useState } from "react"
import { SynthFiFooter } from "@/components/synthfi-footer" // Restoring named import for Footer
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency, formatNumber, shortenAddress } from "@/lib/utils"
import Link from "next/link"
import { X, Plus } from "lucide-react"

function getTokenImage(category: string, symbol: string, size = 100) {
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

const mockTokens = [
  {
    id: "dex-token",
    name: "DEX Token",
    symbol: "DEX",
    marketCap: 8900000,
    price: 1.24,
    launchDate: "2023-11-20",
    contractAddress: "3RmNUxZVJKtLpWqS8xGhTvY",
    isVerified: true,
    isTrending: true,
    category: "DEX",
    maxSupply: "500,000,000",
    mintAuthorityRevoked: false,
    transferRules: "0.1% burn on transfer",
    vestingInfo: "Team tokens vested over 2 years",
    auditResult: "No issues found",
    volume24h: 1234567,
    priceChange24h: 5.67,
    holders: 12345,
    liquidity: 2345678,
  },
  {
    id: "stake-pool",
    name: "Stake Pool",
    symbol: "STAKE",
    marketCap: 2300000,
    price: 0.18,
    launchDate: "2024-01-05",
    contractAddress: "7YGbUpXYmVSDXUNHfxCkLH2xKjd",
    isVerified: true,
    isTrending: false,
    category: "STAKE",
    maxSupply: "50,000,000",
    mintAuthorityRevoked: false,
    transferRules: "No burn, no pause",
    vestingInfo: "None",
    auditResult: "No issues found",
    volume24h: 234567,
    priceChange24h: -2.34,
    holders: 3456,
    liquidity: 567890,
  },
  {
    id: "vesting-token",
    name: "Vesting Token",
    symbol: "VEST",
    marketCap: 1800000,
    price: 0.09,
    launchDate: "2024-02-10",
    contractAddress: "9ZQmVpTrUxHJK2LMnPwS4VbF",
    isVerified: true,
    isTrending: false,
    category: "LEND",
    maxSupply: "200,000,000",
    mintAuthorityRevoked: true,
    transferRules: "No burn, no pause",
    vestingInfo: "3-month cliff, 1-year linear vesting",
    auditResult: "No issues found",
    volume24h: 123456,
    priceChange24h: 1.23,
    holders: 2345,
    liquidity: 345678,
  },
  {
    id: "nft-marketplace",
    name: "NFT Marketplace",
    symbol: "NFTM",
    marketCap: 3400000,
    price: 0.31,
    launchDate: "2024-01-25",
    contractAddress: "5TqPwXyZVJKtLpWqS8xGhTvY",
    isVerified: false,
    isTrending: true,
    category: "NFT",
    maxSupply: "1,000,000,000",
    mintAuthorityRevoked: false,
    transferRules: "No burn, no pause",
    vestingInfo: "None",
    auditResult: "Minor issues found",
    volume24h: 456789,
    priceChange24h: 12.34,
    holders: 5678,
    liquidity: 890123,
  },
  {
    id: "lending-protocol",
    name: "Lending Protocol",
    symbol: "LEND",
    marketCap: 4700000,
    price: 0.56,
    launchDate: "2023-12-05",
    contractAddress: "8HqNUxZVJKtLpWqS8xGhTvY",
    isVerified: true,
    isTrending: false,
    category: "LEND",
    maxSupply: "250,000,000",
    mintAuthorityRevoked: true,
    transferRules: "No burn, no pause",
    vestingInfo: "Team tokens vested over 18 months",
    auditResult: "No issues found",
    volume24h: 567890,
    priceChange24h: -0.56,
    holders: 6789,
    liquidity: 1234567,
  },
  {
    id: "governance-dao",
    name: "Governance DAO",
    symbol: "GOV",
    marketCap: 2900000,
    price: 0.22,
    launchDate: "2024-02-01",
    contractAddress: "1KmNUxZVJKtLpWqS8xGhTvY",
    isVerified: true,
    isTrending: false,
    category: "GOV",
    maxSupply: "100,000,000",
    mintAuthorityRevoked: true,
    transferRules: "No burn, no pause",
    vestingInfo: "None",
    auditResult: "No issues found",
    volume24h: 345678,
    priceChange24h: 3.45,
    holders: 4567,
    liquidity: 678901,
  },
]

export default function ComparePage() {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  const addToken = (tokenId: string) => {
    if (!selectedTokens.includes(tokenId) && selectedTokens.length < 4) {
      setSelectedTokens([...selectedTokens, tokenId])
      setSearchQuery("")
      setShowSearch(false)
    }
  }
  const removeToken = (tokenId: string) => setSelectedTokens(selectedTokens.filter((id) => id !== tokenId))
  const filteredTokens = mockTokens.filter(
    (token) =>
      !selectedTokens.includes(token.id) &&
      (token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())),
  )
  const comparisonTokens = selectedTokens.map((id) => mockTokens.find((t) => t.id === id)).filter(Boolean)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Compare Tokens</h1>
              <p className="text-gray-400">Compare up to 4 tokens side by side</p>
            </div>
            <Link href="/explore">
              <Button className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white">
                Back to Explore{" "}
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
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
          </div>
          <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              {comparisonTokens.map((token: any) => (
                <div
                  key={token.id}
                  className="bg-[#1e293b] rounded-lg p-4 flex items-center gap-3 border border-zinc-700"
                >
                  <img
                    src={getTokenImage(token.category, token.symbol, 40) || "/placeholder.svg"}
                    alt={token.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{token.name}</div>
                    <div className="text-sm text-gray-400">{token.symbol}</div>
                  </div>
                  <button onClick={() => removeToken(token.id)} className="ml-4 text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {selectedTokens.length < 4 && (
                <div className="relative">
                  {showSearch ? (
                    <div className="relative">
                      <Input
                        placeholder="Search tokens..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                        className="bg-[#1e293b] border-zinc-700 text-white w-64"
                        autoFocus
                      />
                      {searchQuery && filteredTokens.length > 0 && (
                        <div className="absolute top-full mt-2 w-full bg-[#1e293b] border border-zinc-700 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                          {filteredTokens.slice(0, 5).map((token) => (
                            <button
                              key={token.id}
                              onClick={() => addToken(token.id)}
                              className="w-full p-3 hover:bg-[#2a324a] flex items-center gap-3 text-left"
                            >
                              <img
                                src={getTokenImage(token.category, token.symbol, 30) || "/placeholder.svg"}
                                alt={token.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="font-medium">{token.name}</div>
                                <div className="text-sm text-gray-400">{token.symbol}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowSearch(true)}
                      variant="outline"
                      className="bg-[#1e293b] border-zinc-700 text-gray-300 hover:bg-[#2a324a] hover:text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Token
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          {comparisonTokens.length > 0 ? (
            <div className="bg-[#0f172a] rounded-lg border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left p-4 text-gray-400 font-medium">Metric</th>
                      {comparisonTokens.map((token: any) => (
                        <th key={token.id} className="text-center p-4 min-w-[200px]">
                          <Link href={`/token/${token.id}`} className="hover:text-purple-400">
                            <img
                              src={getTokenImage(token.category, token.symbol, 60) || "/placeholder.svg"}
                              alt={token.name}
                              className="w-12 h-12 rounded-full mx-auto mb-2"
                            />
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-gray-400">{token.symbol}</div>
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-800">
                      <td className="p-4 text-gray-400">Price</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center font-medium">
                          {formatCurrency(token.price)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-800 bg-[#1e293b]/50">
                      <td className="p-4 text-gray-400">24h Change</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center">
                          <span
                            className={`font-medium ${token.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {token.priceChange24h >= 0 ? "+" : ""}
                            {token.priceChange24h.toFixed(2)}%
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="p-4 text-gray-400">Market Cap</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center">
                          {formatNumber(token.marketCap)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-800 bg-[#1e293b]/50">
                      <td className="p-4 text-gray-400">24h Volume</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center">
                          {formatNumber(token.volume24h)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="p-4 text-gray-400">Liquidity</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center">
                          {formatNumber(token.liquidity)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-800 bg-[#1e293b]/50">
                      <td className="p-4 text-gray-400">Holders</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center">
                          {token.holders.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="p-4 text-gray-400">Max Supply</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center">
                          {token.maxSupply}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-800 bg-[#1e293b]/50">
                      <td className="p-4 text-gray-400">Mint Authority</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center">
                          {token.mintAuthorityRevoked ? (
                            <span className="text-green-500">Revoked</span>
                          ) : (
                            <span className="text-yellow-500">Active</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="p-4 text-gray-400">Transfer Rules</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center text-sm">
                          {token.transferRules}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-800 bg-[#1e293b]/50">
                      <td className="p-4 text-gray-400">Vesting</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center text-sm">
                          {token.vestingInfo}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="p-4 text-gray-400">Audit Result</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center">
                          {token.auditResult === "No issues found" ? (
                            <span className="text-green-500 text-sm">{token.auditResult}</span>
                          ) : (
                            <span className="text-yellow-500 text-sm">{token.auditResult}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-800 bg-[#1e293b]/50">
                      <td className="p-4 text-gray-400">Launch Date</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center">
                          {new Date(token.launchDate).toLocaleDateString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-800">
                      <td className="p-4 text-gray-400">Contract</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm">{shortenAddress(token.contractAddress)}</span>
                            <a
                              href={`https://explorer.solana.com/address/${token.contractAddress}?cluster=mainnet`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-500 hover:text-purple-400"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                            </a>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 text-gray-400">Status</td>
                      {comparisonTokens.map((token: any) => (
                        <td key={token.id} className="p-4 text-center">
                          <div className="flex flex-wrap gap-2 justify-center">
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
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
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
                  <path d="M3 3h18v18H3zM12 8v8m-4-4h8" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No tokens selected</h3>
              <p className="text-gray-400">Click "Add Token" to start comparing tokens</p>
            </div>
          )}
        </div>
      </main>
      <SynthFiFooter /> {/* Restoring Footer call */}
    </div>
  )
}
