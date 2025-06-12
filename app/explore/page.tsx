"use client"

import { useState, useEffect } from "react"
import { SynthFiFooter } from "@/components/synthfi-footer" // Restoring named import for Footer
import { TokenCard } from "@/components/token-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { formatNumber } from "@/lib/utils"
import Link from "next/link"

// Mock data for tokens
const mockTokens = [
  {
    id: "dex-token",
    name: "DEX Token",
    symbol: "DEX",
    logo: "", // Will be generated dynamically
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
    logo: "", // Will be generated dynamically
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
    logo: "", // Will be generated dynamically
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
    logo: "", // Will be generated dynamically
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
    logo: "", // Will be generated dynamically
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
    logo: "", // Will be generated dynamically
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
    logo: "", // Will be generated dynamically
    marketCap: 1200000,
    price: 0.08,
    launchDate: "2024-02-20",
    contractAddress: "6PqNUxZVJKtLpWqS8xGhTvY",
    isVerified: false,
    isTrending: true,
    category: "STAKE",
  },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("marketCap")
  const [filterVerified, setFilterVerified] = useState(false)
  const [filterTrending, setFilterTrending] = useState(false)
  const [filterNewThisWeek, setFilterNewThisWeek] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredTokens, setFilteredTokens] = useState(mockTokens)

  const totalMarketCap = mockTokens.reduce((sum, token) => sum + token.marketCap, 0)

  useEffect(() => {
    let result = [...mockTokens]
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (token) =>
          token.name.toLowerCase().includes(query) ||
          token.symbol.toLowerCase().includes(query) ||
          token.contractAddress.toLowerCase().includes(query),
      )
    }
    if (filterVerified) result = result.filter((token) => token.isVerified)
    if (filterTrending) result = result.filter((token) => token.isTrending)
    if (filterNewThisWeek) {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      result = result.filter((token) => new Date(token.launchDate) >= oneWeekAgo)
    }
    if (selectedCategory) result = result.filter((token) => token.category === selectedCategory)
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price":
          return b.price - a.price
        case "marketCap":
          return b.marketCap - a.marketCap
        case "launchDate":
          return new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime()
        default:
          return 0
      }
    })
    setFilteredTokens(result)
  }, [searchQuery, sortBy, filterVerified, filterTrending, filterNewThisWeek, selectedCategory])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Explore Tokens</h1>
              <p className="text-gray-400">Discover tokens launched with SynthFi</p>
            </div>
            <div className="flex gap-3">
              <Link href="/">
                <Button className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white">
                  Launch Your Own
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
              <Link href="/compare">
                <Button
                  variant="outline"
                  className="mt-4 md:mt-0 border-zinc-700 text-gray-300 hover:bg-[#1e293b] hover:text-white"
                >
                  Compare Tokens
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
                    <path d="M3 3h18v18H3zM12 8v8m-4-4h8" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="hidden lg:block">
              <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 sticky top-8">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="verified"
                          checked={filterVerified}
                          onCheckedChange={(checked) => setFilterVerified(checked as boolean)}
                          className="mr-2 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <label htmlFor="verified" className="text-sm cursor-pointer">
                          SynthFi Verified
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="trending"
                          checked={filterTrending}
                          onCheckedChange={(checked) => setFilterTrending(checked as boolean)}
                          className="mr-2 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <label htmlFor="trending" className="text-sm cursor-pointer">
                          Trending
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="newThisWeek"
                          checked={filterNewThisWeek}
                          onCheckedChange={(checked) => setFilterNewThisWeek(checked as boolean)}
                          className="mr-2 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <label htmlFor="newThisWeek" className="text-sm cursor-pointer">
                          New This Week
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Category</h3>
                    <div className="space-y-2">
                      {["STAKE", "DEX", "GOV", "LEND", "NFT"].map((category) => (
                        <div key={category} className="flex items-center">
                          <button
                            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                            className={`text-sm py-1 px-3 rounded-full ${selectedCategory === category ? "bg-purple-600 text-white" : "bg-[#1e293b] text-gray-300 hover:bg-[#2a324a]"}`}
                          >
                            {category}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <div className="text-sm text-gray-400 mb-1">Total Tokens</div>
                    <div className="font-medium">{mockTokens.length}</div>
                    <div className="text-sm text-gray-400 mt-3 mb-1">Total Market Cap</div>
                    <div className="font-medium">{formatNumber(totalMarketCap)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name, ticker, or contract..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#1e293b] border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <Tabs defaultValue="marketCap" onValueChange={(value) => setSortBy(value)}>
                      <TabsList className="bg-[#1e293b] border border-zinc-700">
                        <TabsTrigger
                          value="marketCap"
                          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                        >
                          Market Cap
                        </TabsTrigger>
                        <TabsTrigger
                          value="launchDate"
                          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                        >
                          Launch Date
                        </TabsTrigger>
                        <TabsTrigger
                          value="price"
                          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                        >
                          Price
                        </TabsTrigger>
                        <TabsTrigger
                          value="name"
                          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                        >
                          Name
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </div>
              <div className="lg:hidden mb-6 overflow-x-auto pb-2">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full border-zinc-700 ${filterVerified ? "bg-purple-600 text-white border-purple-600" : "text-gray-300"}`}
                    onClick={() => setFilterVerified(!filterVerified)}
                  >
                    {filterVerified && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}{" "}
                    Verified
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full border-zinc-700 ${filterTrending ? "bg-purple-600 text-white border-purple-600" : "text-gray-300"}`}
                    onClick={() => setFilterTrending(!filterTrending)}
                  >
                    {filterTrending && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}{" "}
                    Trending
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full border-zinc-700 ${filterNewThisWeek ? "bg-purple-600 text-white border-purple-600" : "text-gray-300"}`}
                    onClick={() => setFilterNewThisWeek(!filterNewThisWeek)}
                  >
                    {filterNewThisWeek && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}{" "}
                    New This Week
                  </Button>
                  {["STAKE", "DEX", "GOV", "LEND", "NFT"].map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      size="sm"
                      className={`rounded-full border-zinc-700 ${selectedCategory === category ? "bg-purple-600 text-white border-purple-600" : "text-gray-300"}`}
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    >
                      {selectedCategory === category && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}{" "}
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              {filteredTokens.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTokens.map((token) => (
                    <TokenCard key={token.id} token={token} />
                  ))}
                </div>
              ) : (
                <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-8 text-center">
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
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No tokens found</h3>
                  <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SynthFiFooter /> {/* Restoring Footer call */}
    </div>
  )
}
