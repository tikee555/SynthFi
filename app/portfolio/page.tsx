"use client"

import { useState, useEffect } from "react"
import { SynthFiFooter } from "@/components/synthfi-footer" // Restoring named import for Footer
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatCurrency, formatNumber } from "@/lib/utils"
import Link from "next/link"
import { PriceHistoryChart } from "@/components/price-history-chart"
import { Info, Trash2, PlusCircle, TrendingUp, TrendingDown, PieChart, DollarSign, ListChecks } from "lucide-react"

interface PortfolioToken {
  tokenId: string
  tokenName: string
  tokenSymbol: string
  amount: number
  avgBuyPrice: number
  currentPrice: number
  category: string
}
function getTokenImage(category: string, symbol: string, size = 40) {
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

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioToken[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTokenId, setSelectedTokenId] = useState("")
  const [amount, setAmount] = useState("")
  const [buyPrice, setBuyPrice] = useState("")
  const availableTokens = [
    { id: "dex-token", name: "DEX Token", symbol: "DEX", price: 1.24, category: "DEX" },
    { id: "stake-pool", name: "Stake Pool", symbol: "STAKE", price: 0.18, category: "STAKE" },
    { id: "vesting-token", name: "Vesting Token", symbol: "VEST", price: 0.09, category: "LEND" },
    { id: "nft-marketplace", name: "NFT Marketplace", symbol: "NFTM", price: 0.31, category: "NFT" },
    { id: "lending-protocol", name: "Lending Protocol", symbol: "LENDP", price: 0.56, category: "LEND" },
    { id: "governance-dao", name: "Governance DAO", symbol: "GOV", price: 0.22, category: "GOV" },
  ]
  useEffect(() => {
    const savedPortfolio = localStorage.getItem("synthfi-portfolio")
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio))
  }, [])
  useEffect(() => {
    if (selectedTokenId && showAddModal) {
      const tokenInfo = availableTokens.find((t) => t.id === selectedTokenId)
      if (tokenInfo) {
        const simulatedAmount = Math.floor(Math.random() * (1000 - 10 + 1)) + 10
        setAmount(simulatedAmount.toString())
        const priceVariation = (Math.random() - 0.5) * 0.4
        let simulatedBuyPrice = tokenInfo.price * (1 + priceVariation)
        simulatedBuyPrice = Math.max(0.01, simulatedBuyPrice)
        setBuyPrice(simulatedBuyPrice.toFixed(2))
      }
    } else if (!showAddModal) {
      setSelectedTokenId("")
      setAmount("")
      setBuyPrice("")
    }
  }, [selectedTokenId, showAddModal])
  const savePortfolio = (newPortfolio: PortfolioToken[]) => {
    setPortfolio(newPortfolio)
    localStorage.setItem("synthfi-portfolio", JSON.stringify(newPortfolio))
  }
  const handleOpenAddModal = () => {
    setSelectedTokenId("")
    setAmount("")
    setBuyPrice("")
    setShowAddModal(true)
  }
  const addToPortfolio = () => {
    const token = availableTokens.find((t) => t.id === selectedTokenId)
    if (!token || !amount || !buyPrice) return
    const newAmount = Number.parseFloat(amount)
    const newAvgBuyPrice = Number.parseFloat(buyPrice)
    if (isNaN(newAmount) || newAmount <= 0 || isNaN(newAvgBuyPrice) || newAvgBuyPrice <= 0) {
      console.error("Invalid amount or buy price")
      return
    }
    const newToken: PortfolioToken = {
      tokenId: token.id,
      tokenName: token.name,
      tokenSymbol: token.symbol,
      amount: newAmount,
      avgBuyPrice: newAvgBuyPrice,
      currentPrice: token.price,
      category: token.category,
    }
    const existingIndex = portfolio.findIndex((t) => t.tokenId === token.id)
    if (existingIndex >= 0) {
      const updatedPortfolio = [...portfolio]
      const existingToken = updatedPortfolio[existingIndex]
      const totalAmount = existingToken.amount + newToken.amount
      const totalExistingValue = existingToken.amount * existingToken.avgBuyPrice
      const totalNewValue = newToken.amount * newToken.avgBuyPrice
      updatedPortfolio[existingIndex] = {
        ...existingToken,
        amount: totalAmount,
        avgBuyPrice: (totalExistingValue + totalNewValue) / totalAmount,
        currentPrice: token.price,
      }
      savePortfolio(updatedPortfolio)
    } else {
      savePortfolio([...portfolio, newToken])
    }
    setShowAddModal(false)
  }
  const removeFromPortfolio = (tokenId: string) => savePortfolio(portfolio.filter((t) => t.tokenId !== tokenId))
  const totalValue = portfolio.reduce((sum, token) => sum + token.amount * token.currentPrice, 0)
  const totalCost = portfolio.reduce((sum, token) => sum + token.amount * token.avgBuyPrice, 0)
  const totalPnL = totalValue - totalCost
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0
  const topPerformer = portfolio.reduce(
    (best, token) => {
      if (token.avgBuyPrice === 0) return best
      const tokenPnLPercent = ((token.currentPrice - token.avgBuyPrice) / token.avgBuyPrice) * 100
      if (!best) return token
      const bestPnLPercent =
        best.avgBuyPrice === 0
          ? Number.NEGATIVE_INFINITY
          : ((best.currentPrice - best.avgBuyPrice) / best.avgBuyPrice) * 100
      return tokenPnLPercent > bestPnLPercent ? token : best
    },
    null as PortfolioToken | null,
  )

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Portfolio</h1>
              <p className="text-gray-400">Track your token holdings and performance.</p>
            </div>
            <Button onClick={handleOpenAddModal} className="bg-purple-600 hover:bg-purple-700 text-white">
              <PlusCircle size={18} className="mr-2" />
              Add Position
            </Button>
          </div>
          <Alert className="mb-8 bg-[#0f172a] border-purple-600 text-purple-300">
            <Info size={20} className="text-purple-400" />
            <AlertTitle className="text-purple-400 font-semibold">Demonstration Only</AlertTitle>
            <AlertDescription>
              This is a simulated portfolio. Data is auto-populated for demonstration purposes and not real-time or
              reflective of actual holdings.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#0f172a] border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Value</CardTitle>
                <DollarSign size={18} className="text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              </CardContent>
            </Card>
            <Card className="bg-[#0f172a] border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total P&L</CardTitle>
                {totalPnL >= 0 ? (
                  <TrendingUp size={18} className="text-green-500" />
                ) : (
                  <TrendingDown size={18} className="text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {totalPnL >= 0 ? "+" : ""}
                  {formatCurrency(totalPnL)}
                </div>
                <div className={`text-xs ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {totalPnLPercent >= 0 ? "+" : ""}
                  {totalPnLPercent.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#0f172a] border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Positions</CardTitle>
                <ListChecks size={18} className="text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{portfolio.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-[#0f172a] border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Top Performer</CardTitle>
                <PieChart size={18} className="text-gray-500" />
              </CardHeader>
              <CardContent>
                {topPerformer ? (
                  <>
                    <div className="text-lg font-bold">{topPerformer.tokenSymbol}</div>
                    <div className="text-sm text-green-500">
                      +
                      {(
                        ((topPerformer.currentPrice - topPerformer.avgBuyPrice) / (topPerformer.avgBuyPrice || 1)) *
                        100
                      ).toFixed(2)}
                      %
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 text-sm">No positions yet</div>
                )}
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="positions" className="space-y-6">
            <TabsList className="bg-[#1e293b] border border-zinc-700">
              <TabsTrigger
                value="positions"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Positions
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Performance Charts
              </TabsTrigger>
              <TabsTrigger
                value="allocation"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Allocation
              </TabsTrigger>
            </TabsList>
            <TabsContent value="positions">
              {portfolio.length === 0 ? (
                <Card className="bg-[#0f172a] border-zinc-800">
                  <CardContent className="py-12 text-center">
                    <div className="w-16 h-16 bg-[#1e293b] rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign size={28} className="text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Your portfolio is empty</h3>
                    <p className="text-gray-400 mb-4">Add your first position to start tracking your assets.</p>
                    <Button onClick={handleOpenAddModal} className="bg-purple-600 hover:bg-purple-700 text-white">
                      <PlusCircle size={18} className="mr-2" />
                      Add Position
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-[#0f172a] rounded-lg border border-zinc-800 overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left p-4 text-sm text-gray-400 font-normal">Token</th>
                        <th className="text-right p-4 text-sm text-gray-400 font-normal">Amount</th>
                        <th className="text-right p-4 text-sm text-gray-400 font-normal">Avg Buy Price</th>
                        <th className="text-right p-4 text-sm text-gray-400 font-normal">Current Price</th>
                        <th className="text-right p-4 text-sm text-gray-400 font-normal">Value</th>
                        <th className="text-right p-4 text-sm text-gray-400 font-normal">P&L (%)</th>
                        <th className="text-center p-4 text-sm text-gray-400 font-normal">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map((token) => {
                        const value = token.amount * token.currentPrice
                        const pnl = (token.currentPrice - token.avgBuyPrice) * token.amount
                        const pnlPercent =
                          token.avgBuyPrice > 0
                            ? ((token.currentPrice - token.avgBuyPrice) / token.avgBuyPrice) * 100
                            : 0
                        return (
                          <tr
                            key={token.tokenId}
                            className="border-b border-zinc-800 last:border-b-0 hover:bg-[#1e293b]/50"
                          >
                            <td className="p-4">
                              <Link href={`/token/${token.tokenId}`} className="flex items-center gap-3 group">
                                <img
                                  src={getTokenImage(token.category, token.tokenSymbol) || "/placeholder.svg"}
                                  alt={token.tokenName}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <div className="font-medium group-hover:text-purple-400">{token.tokenName}</div>
                                  <div className="text-xs text-gray-400">{token.tokenSymbol}</div>
                                </div>
                              </Link>
                            </td>
                            <td className="text-right p-4">{formatNumber(token.amount)}</td>
                            <td className="text-right p-4">{formatCurrency(token.avgBuyPrice)}</td>
                            <td className="text-right p-4">{formatCurrency(token.currentPrice)}</td>
                            <td className="text-right p-4 font-medium">{formatCurrency(value)}</td>
                            <td className="text-right p-4">
                              <div className={pnl >= 0 ? "text-green-500" : "text-red-500"}>
                                {pnl >= 0 ? "+" : ""}
                                {formatCurrency(pnl)}
                              </div>
                              <div className={`text-xs ${pnlPercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                                ({pnlPercent >= 0 ? "+" : ""}
                                {pnlPercent.toFixed(2)}%)
                              </div>
                            </td>
                            <td className="text-center p-4">
                              <Button
                                onClick={() => removeFromPortfolio(token.tokenId)}
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                              >
                                <Trash2 size={16} />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
            <TabsContent value="performance">
              {portfolio.length === 0 ? (
                <Card className="bg-[#0f172a] border-zinc-800">
                  <CardContent className="py-12 text-center text-gray-400">
                    No positions to display performance charts for.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {portfolio.map((token) => (
                    <PriceHistoryChart
                      key={token.tokenId}
                      tokenSymbol={token.tokenSymbol}
                      currentPrice={token.currentPrice}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="allocation">
              <Card className="bg-[#0f172a] border-zinc-800">
                <CardHeader>
                  <CardTitle>Portfolio Allocation by Value</CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolio.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No positions to display allocation for.</div>
                  ) : (
                    <div className="space-y-4">
                      {portfolio.map((token) => {
                        const value = token.amount * token.currentPrice
                        const allocation = totalValue > 0 ? (value / totalValue) * 100 : 0
                        return (
                          <div key={token.tokenId}>
                            <div className="flex justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <img
                                  src={getTokenImage(token.category, token.tokenSymbol, 24) || "/placeholder.svg"}
                                  alt={token.tokenSymbol}
                                  className="w-6 h-6 rounded-full"
                                />
                                <span className="font-medium">{token.tokenSymbol}</span>
                              </div>
                              <span className="text-sm text-gray-300">{allocation.toFixed(2)}%</span>
                            </div>
                            <div className="w-full bg-[#1e293b] rounded-full h-2.5">
                              <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${allocation}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="bg-[#0f172a] border-zinc-800 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl">Add New Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="select-token" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Select Token
                </label>
                <select
                  id="select-token"
                  value={selectedTokenId}
                  onChange={(e) => setSelectedTokenId(e.target.value)}
                  className="w-full bg-[#1e293b] border-zinc-700 rounded-md px-3 py-2 text-white focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">-- Choose a token --</option>
                  {availableTokens.map((token) => (
                    <option key={token.id} value={token.id}>
                      {token.name} ({token.tokenSymbol})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Amount
                </label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 100"
                  className="bg-[#1e293b] border-zinc-700 text-white"
                  disabled={!selectedTokenId}
                />
              </div>
              <div>
                <label htmlFor="buy-price" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Average Buy Price (per token)
                </label>
                <Input
                  id="buy-price"
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="e.g., 1.15"
                  className="bg-[#1e293b] border-zinc-700 text-white"
                  disabled={!selectedTokenId}
                />
                {selectedTokenId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current market price:{" "}
                    {formatCurrency(availableTokens.find((t) => t.id === selectedTokenId)?.price || 0)}
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="flex-1 border-zinc-700 text-gray-300 hover:bg-[#1e293b]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addToPortfolio}
                  disabled={
                    !selectedTokenId ||
                    !amount ||
                    !buyPrice ||
                    Number.parseFloat(amount) <= 0 ||
                    Number.parseFloat(buyPrice) <= 0
                  }
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  Add Position
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <SynthFiFooter /> {/* Restoring Footer call */}
    </div>
  )
}
