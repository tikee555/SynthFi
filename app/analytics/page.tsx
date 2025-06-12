"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatNumber } from "@/lib/utils"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for analytics
const volumeData = [
  { date: "Mon", volume: 2400000 },
  { date: "Tue", volume: 1398000 },
  { date: "Wed", volume: 9800000 },
  { date: "Thu", volume: 3908000 },
  { date: "Fri", volume: 4800000 },
  { date: "Sat", volume: 3800000 },
  { date: "Sun", volume: 4300000 },
]

const categoryData = [
  { name: "DEX", value: 35, color: "#7c3aed" },
  { name: "STAKE", value: 25, color: "#2563eb" },
  { name: "LEND", value: 20, color: "#16a34a" },
  { name: "NFT", value: 15, color: "#db2777" },
  { name: "GOV", value: 5, color: "#ea580c" },
]

const topTokens = [
  { name: "DEX Token", symbol: "DEX", volume: 8900000, change: 12.5 },
  { name: "Lending Protocol", symbol: "LEND", volume: 4700000, change: -3.2 },
  { name: "NFT Marketplace", symbol: "NFTM", volume: 3400000, change: 8.7 },
  { name: "Governance DAO", symbol: "GOV", volume: 2900000, change: 5.1 },
  { name: "Stake Pool", symbol: "STAKE", volume: 2300000, change: -1.8 },
]

const launchTrends = [
  { month: "Jan", launches: 45 },
  { month: "Feb", launches: 52 },
  { month: "Mar", launches: 48 },
  { month: "Apr", launches: 70 },
  { month: "May", launches: 65 },
  { month: "Jun", launches: 82 },
]

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("7d")

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-gray-400">Platform-wide metrics and insights</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#0f172a] border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Total Volume (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(30400000)}</div>
                <div className="text-sm text-green-500">+12.5%</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f172a] border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Active Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <div className="text-sm text-green-500">+8 today</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f172a] border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Total Liquidity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(125600000)}</div>
                <div className="text-sm text-green-500">+5.2%</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f172a] border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-400">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(15420)}</div>
                <div className="text-sm text-green-500">+324 today</div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="volume" className="space-y-6">
            <TabsList className="bg-[#1e293b] border border-zinc-700">
              <TabsTrigger value="volume" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Volume
              </TabsTrigger>
              <TabsTrigger value="tokens" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Tokens
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger value="trends" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="volume">
              <Card className="bg-[#0f172a] border-zinc-800">
                <CardHeader>
                  <CardTitle>Trading Volume (7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      volume: {
                        label: "Volume",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={volumeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                        <ChartTooltip
                          content={<ChartTooltipContent formatter={(value: any) => formatCurrency(Number(value))} />}
                        />
                        <Bar dataKey="volume" fill="#7c3aed" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tokens">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#0f172a] border-zinc-800">
                  <CardHeader>
                    <CardTitle>Top Tokens by Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topTokens.map((token, index) => (
                        <div key={token.symbol} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold text-gray-500">#{index + 1}</div>
                            <div>
                              <div className="font-medium">{token.name}</div>
                              <div className="text-sm text-gray-400">{token.symbol}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(token.volume)}</div>
                            <div className={`text-sm ${token.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                              {token.change >= 0 ? "+" : ""}
                              {token.change}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#0f172a] border-zinc-800">
                  <CardHeader>
                    <CardTitle>Token Launch Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        launches: {
                          label: "Launches",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={launchTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <ChartTooltip
                            content={<ChartTooltipContent formatter={(value: any) => `${value} launches`} />}
                          />
                          <Line
                            type="monotone"
                            dataKey="launches"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: "#10b981" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#0f172a] border-zinc-800">
                  <CardHeader>
                    <CardTitle>Token Distribution by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        value: {
                          label: "Percentage",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="bg-[#0f172a] border-zinc-800">
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryData.map((category) => (
                        <div key={category.name}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-sm text-gray-400">{category.value}%</span>
                          </div>
                          <div className="w-full bg-[#1e293b] rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${category.value}%`,
                                backgroundColor: category.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-[#0f172a] border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Trending Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Integration</span>
                        <span className="text-sm text-purple-400">+45%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Vesting Contracts</span>
                        <span className="text-sm text-purple-400">+32%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">DAO Governance</span>
                        <span className="text-sm text-purple-400">+28%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Burn Mechanisms</span>
                        <span className="text-sm text-purple-400">+15%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#0f172a] border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Prompts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm p-2 bg-[#1e293b] rounded">"Create a token with 1-year vesting"</div>
                      <div className="text-sm p-2 bg-[#1e293b] rounded">"Build a staking pool with 8% APR"</div>
                      <div className="text-sm p-2 bg-[#1e293b] rounded">"Token with burn on transfer"</div>
                      <div className="text-sm p-2 bg-[#1e293b] rounded">"DAO token with voting rights"</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#0f172a] border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Success Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">Deployment Success</span>
                          <span className="text-sm">98.5%</span>
                        </div>
                        <div className="w-full bg-[#1e293b] rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "98.5%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">Audit Pass Rate</span>
                          <span className="text-sm">92.3%</span>
                        </div>
                        <div className="w-full bg-[#1e293b] rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "92.3%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">User Satisfaction</span>
                          <span className="text-sm">95.7%</span>
                        </div>
                        <div className="w-full bg-[#1e293b] rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "95.7%" }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
