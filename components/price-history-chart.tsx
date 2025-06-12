"use client"

import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PriceHistoryChartProps {
  tokenSymbol: string
  currentPrice: number
}

// Generate mock price data
function generatePriceData(basePrice: number, days: number) {
  const data = []
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Add some realistic price variation
    const variation = (Math.random() - 0.5) * 0.2 // ±10% variation
    const price = basePrice * (1 + variation)

    data.push({
      date: date.toISOString().split("T")[0],
      price: Number(price.toFixed(4)),
      volume: Math.floor(Math.random() * 1000000) + 100000,
    })
  }

  return data
}

export function PriceHistoryChart({ tokenSymbol, currentPrice }: PriceHistoryChartProps) {
  const [timeframe, setTimeframe] = useState("7d")

  const timeframes = {
    "24h": 1,
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "1y": 365,
  }

  const data = generatePriceData(currentPrice, timeframes[timeframe as keyof typeof timeframes])

  // Calculate price change
  const firstPrice = data[0]?.price || 0
  const lastPrice = data[data.length - 1]?.price || 0
  const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100
  const isPositive = priceChange >= 0

  return (
    <Card className="bg-[#0f172a] border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Price History</CardTitle>
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList className="bg-[#1e293b] border border-zinc-700">
              <TabsTrigger value="24h" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                24H
              </TabsTrigger>
              <TabsTrigger value="7d" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                7D
              </TabsTrigger>
              <TabsTrigger value="30d" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                30D
              </TabsTrigger>
              <TabsTrigger value="90d" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                90D
              </TabsTrigger>
              <TabsTrigger value="1y" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                1Y
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-2xl font-bold">${lastPrice.toFixed(4)}</span>
          <span className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "+" : ""}
            {priceChange.toFixed(2)}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            price: {
              label: "Price",
              color: isPositive ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  if (timeframe === "24h") {
                    return date.toLocaleTimeString("en-US", { hour: "2-digit" })
                  }
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }}
              />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value.toFixed(2)}`} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value: any) => `$${Number(value).toFixed(4)}`}
                    labelFormatter={(label) => {
                      const date = new Date(label)
                      return date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
