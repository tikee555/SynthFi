"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatNumber } from "@/lib/utils"

interface Activity {
  id: string
  type: "launch" | "swap" | "liquidity" | "burn"
  tokenName: string
  tokenSymbol: string
  tokenId: string
  amount?: number
  value?: number
  from?: string
  to?: string
  timestamp: Date
  txHash: string
}

// Generate mock activities
function generateMockActivities(): Activity[] {
  const activities: Activity[] = []
  const types: Activity["type"][] = ["launch", "swap", "liquidity", "burn"]
  const tokens = [
    { name: "DEX Token", symbol: "DEX", id: "dex-token" },
    { name: "Stake Pool", symbol: "STAKE", id: "stake-pool" },
    { name: "Vesting Token", symbol: "VEST", id: "vesting-token" },
    { name: "NFT Marketplace", symbol: "NFTM", id: "nft-marketplace" },
  ]

  for (let i = 0; i < 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const token = tokens[Math.floor(Math.random() * tokens.length)]
    const timestamp = new Date()
    timestamp.setMinutes(timestamp.getMinutes() - Math.floor(Math.random() * 1440)) // Random time within last 24 hours

    activities.push({
      id: `activity-${i}`,
      type,
      tokenName: token.name,
      tokenSymbol: token.symbol,
      tokenId: token.id,
      amount: type === "swap" || type === "liquidity" ? Math.floor(Math.random() * 100000) : undefined,
      value: type === "swap" || type === "liquidity" ? Math.floor(Math.random() * 50000) : undefined,
      from: `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
      to: `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      txHash: Math.random().toString(36).substring(2, 15),
    })
  }

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filter, setFilter] = useState<Activity["type"] | "all">("all")

  useEffect(() => {
    // Generate initial activities
    setActivities(generateMockActivities())

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity = generateMockActivities()[0]
      setActivities((prev) => [newActivity, ...prev].slice(0, 50)) // Keep last 50 activities
    }, 10000) // Add new activity every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const filteredActivities = filter === "all" ? activities : activities.filter((activity) => activity.type === filter)

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "launch":
        return (
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
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )
      case "swap":
        return (
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
            <path d="M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
          </svg>
        )
      case "liquidity":
        return (
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
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        )
      case "burn":
        return (
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
            <path d="M19 11.5a7.5 7.5 0 1 1-15 0C4 6 9 3 12 3c2 0 4 1 4 1s1 2 1 4c0 1-1 2-1 2s2 0 3 1.5z" />
          </svg>
        )
    }
  }

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "launch":
        return "bg-purple-900/30 text-purple-400"
      case "swap":
        return "bg-blue-900/30 text-blue-400"
      case "liquidity":
        return "bg-green-900/30 text-green-400"
      case "burn":
        return "bg-red-900/30 text-red-400"
    }
  }

  const getActivityDescription = (activity: Activity) => {
    switch (activity.type) {
      case "launch":
        return (
          <>
            <Link href={`/token/${activity.tokenId}`} className="font-medium hover:text-purple-400">
              {activity.tokenName}
            </Link>{" "}
            was launched
          </>
        )
      case "swap":
        return (
          <>
            <span className="text-gray-400">{activity.from}</span>
            {" swapped "}
            <span className="font-medium">{formatNumber(activity.amount || 0)}</span>{" "}
            <Link href={`/token/${activity.tokenId}`} className="font-medium hover:text-purple-400">
              {activity.tokenSymbol}
            </Link>
            {" for "}
            <span className="font-medium">{formatCurrency(activity.value || 0)}</span>
          </>
        )
      case "liquidity":
        return (
          <>
            <span className="text-gray-400">{activity.from}</span>
            {" added "}
            <span className="font-medium">{formatCurrency(activity.value || 0)}</span>
            {" liquidity to "}
            <Link href={`/token/${activity.tokenId}`} className="font-medium hover:text-purple-400">
              {activity.tokenSymbol}
            </Link>
          </>
        )
      case "burn":
        return (
          <>
            <span className="text-gray-400">{activity.from}</span>
            {" burned "}
            <span className="font-medium">{formatNumber(activity.amount || 0)}</span>{" "}
            <Link href={`/token/${activity.tokenId}`} className="font-medium hover:text-purple-400">
              {activity.tokenSymbol}
            </Link>
          </>
        )
    }
  }

  return (
    <Card className="bg-[#0f172a] border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Recent Activity</CardTitle>
          <div className="flex gap-2">
            {["all", "launch", "swap", "liquidity", "burn"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`text-xs px-3 py-1 rounded-full capitalize ${
                  filter === type ? "bg-purple-600 text-white" : "bg-[#1e293b] text-gray-300 hover:bg-[#2a324a]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-[#1e293b] hover:bg-[#2a324a] transition-colors"
            >
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">{getActivityDescription(activity)}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                  <a
                    href={`https://explorer.solana.com/tx/${activity.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-500 hover:text-purple-400"
                  >
                    View TX
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
