"use client"

import { CardContent } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { tokens, type Token } from "@/lib/token-data"
import { TokenCard } from "@/components/token-card"
import { TokenTable } from "@/components/token-table"
import { TrendingTokens } from "@/components/trending-tokens"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Grid, List } from "lucide-react"
import NextImage from "next/image"

export default function ExplorePage() {
  const [filteredTokens, setFilteredTokens] = useState<Token[]>(tokens)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")
  const [sortColumn, setSortColumn] = useState<string>("marketCap")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filters, setFilters] = useState({
    verified: false,
    hasLiquidity: false,
    trending: false,
  })

  // Get trending tokens
  const trendingTokens = tokens.filter((token) => token.trending).slice(0, 5)

  // Get recently launched tokens (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentTokens = tokens.filter((token) => new Date(token.launchDate) >= thirtyDaysAgo)

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const handleFilterChange = (key: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tokens]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (token) =>
          token.name.toLowerCase().includes(query) ||
          token.symbol.toLowerCase().includes(query) ||
          token.mintAddress.toLowerCase().includes(query),
      )
    }

    // Apply filters
    if (filters.verified) {
      result = result.filter((token) => token.verified)
    }

    if (filters.hasLiquidity) {
      result = result.filter((token) => token.hasLiquidity)
    }

    if (filters.trending) {
      result = result.filter((token) => token.trending)
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA: any = a[sortColumn as keyof Token]
      let valueB: any = b[sortColumn as keyof Token]

      // Handle null values
      if (valueA === null && valueB === null) return 0
      if (valueA === null) return 1
      if (valueB === null) return -1

      // Compare based on type
      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase()
        valueB = valueB.toLowerCase()
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    setFilteredTokens(result)
  }, [searchQuery, filters, sortColumn, sortDirection])

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto py-24 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Token Explorer</h1>
            <p className="text-gray-400">Discover and track tokens launched through SynthFi</p>
          </div>

          <div className="flex mt-4 md:mt-0">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-purple-600 hover:bg-purple-700" : "border-gray-700"}
            >
              <Grid className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={`ml-2 ${viewMode === "table" ? "bg-purple-600 hover:bg-purple-700" : "border-gray-700"}`}
            >
              <List className="h-4 w-4 mr-1" />
              Table
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search by name, symbol, or address"
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={filters.verified ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("verified")}
                  className={filters.verified ? "bg-green-600 hover:bg-green-700" : "border-gray-700"}
                >
                  Verified
                </Button>
                <Button
                  variant={filters.hasLiquidity ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("hasLiquidity")}
                  className={filters.hasLiquidity ? "bg-blue-600 hover:bg-blue-700" : "border-gray-700"}
                >
                  Has Liquidity
                </Button>
                <Button
                  variant={filters.trending ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("trending")}
                  className={filters.trending ? "bg-orange-600 hover:bg-orange-700" : "border-gray-700"}
                >
                  Trending
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">{filteredTokens.length} tokens found</div>

                <div className="flex items-center">
                  <span className="text-sm text-gray-400 mr-2">Sort by:</span>
                  <Select
                    value={sortColumn}
                    onValueChange={(value) => {
                      setSortColumn(value)
                      setSortDirection("desc")
                    }}
                  >
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="marketCap">Market Cap</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="launchDate">Launch Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                    className="ml-2"
                  >
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>
            </div>

            {viewMode === "table" ? (
              <TokenTable
                tokens={filteredTokens}
                onSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTokens.map((token) => (
                  <TokenCard key={token.id} token={token} />
                ))}
              </div>
            )}

            {filteredTokens.length === 0 && (
              <div className="text-center py-12 bg-gray-800 rounded-md border border-gray-700">
                <p className="text-gray-400">No tokens found matching your criteria</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <TrendingTokens tokens={trendingTokens} />

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recently Launched</h3>
                <div className="space-y-3">
                  {recentTokens.slice(0, 5).map((token) => (
                    <div key={token.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="relative w-6 h-6 mr-2">
                          <NextImage
                            src={token.logoUrl || "/placeholder.svg?height=24&width=24&query=token"}
                            alt={token.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        </div>
                        <span className="text-white">{token.symbol}</span>
                      </div>
                      <Badge className="bg-blue-600 hover:bg-blue-700">New</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">SynthFi Verified</h3>
                <div className="space-y-3">
                  {tokens
                    .filter((token) => token.verified)
                    .slice(0, 5)
                    .map((token) => (
                      <div key={token.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="relative w-6 h-6 mr-2">
                            <NextImage
                              src={token.logoUrl || "/placeholder.svg?height=24&width=24&query=token"}
                              alt={token.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          </div>
                          <span className="text-white">{token.symbol}</span>
                        </div>
                        <Badge className="bg-green-600 hover:bg-green-700">Verified</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
