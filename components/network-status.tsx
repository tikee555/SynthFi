"use client"

import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NetworkStatusProps {
  network?: "solana" | "ethereum" | "base" // Made network prop optional for safety
  connected?: boolean // Added from CreateAppSection usage, assuming it's for UI display
  publicKey?: { toString: () => string } | null // Added from CreateAppSection usage
  onConnect?: () => void // Added from CreateAppSection usage
  onDisconnect?: () => void // Added from CreateAppSection usage
}

type NetworkState = "online" | "congested" | "offline"

export function NetworkStatus({ network = "solana" }: NetworkStatusProps) {
  // Default prop added
  const [status, setStatus] = useState<NetworkState>("online")
  const [latency, setLatency] = useState<number>(25)

  useEffect(() => {
    setStatus("online")
    const baseLatency = network === "solana" ? 15 : network === "ethereum" ? 35 : 20
    setLatency(baseLatency + Math.floor(Math.random() * 10))

    const interval = setInterval(() => {
      const rand = Math.random()
      if (rand < 0.05) {
        setStatus("congested")
        setLatency((prev) => prev + 50 + Math.floor(Math.random() * 30))
      } else if (rand < 0.01) {
        setStatus("offline")
        setLatency(0)
      } else {
        setStatus("online")
        setLatency(baseLatency + Math.floor(Math.random() * 10))
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [network])

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "congested":
        return "bg-yellow-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = () => {
    const networkName = network.charAt(0).toUpperCase() + network.slice(1) // Safe due to default prop
    switch (status) {
      case "online":
        return `${networkName} Online`
      case "congested":
        return `${networkName} Congested`
      case "offline":
        return `${networkName} Offline`
      default:
        return `${networkName} Status Unknown`
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-1 cursor-help">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
            <span className="text-xs text-gray-400">{getStatusText()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-[#1e293b] border-zinc-700 text-white">
          <div className="text-xs">
            <p className="font-medium">{getStatusText()}</p>
            {status !== "offline" && <p className="text-gray-400 mt-1">Network Latency: {latency}ms</p>}
            {status === "congested" && <p className="text-yellow-400 mt-1">Network is experiencing high traffic</p>}
            {status === "offline" && <p className="text-red-400 mt-1">Network is currently unavailable</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
