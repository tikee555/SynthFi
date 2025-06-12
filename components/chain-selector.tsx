"use client"

import { useWallet } from "@/contexts/wallet-context"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ChainSelectorProps {
  className?: string
  onChainSelect?: (chain: string) => void
}

export function ChainSelector({ className, onChainSelect }: ChainSelectorProps) {
  const { walletType, currentChain, isSupportedChain, switchNetwork } = useWallet()
  const [isChanging, setIsChanging] = useState(false)

  const handleChainSelect = async (chain: "solana" | "base") => {
    if (!isSupportedChain(chain)) {
      console.log(`Chain ${chain} is not supported by the current wallet (${walletType})`)
      return
    }

    if (currentChain === chain) {
      console.log(`Already on ${chain} chain`)
      return
    }

    setIsChanging(true)
    try {
      const success = await switchNetwork(chain)
      if (success && onChainSelect) {
        onChainSelect(chain)
      }
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <button
        onClick={() => handleChainSelect("solana")}
        disabled={isChanging || !isSupportedChain("solana")}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
          currentChain === "solana" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700",
          !isSupportedChain("solana") && "opacity-50 cursor-not-allowed",
        )}
      >
        Solana
      </button>
      <button
        onClick={() => handleChainSelect("base")}
        disabled={isChanging || !isSupportedChain("base")}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
          currentChain === "base" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700",
          !isSupportedChain("base") && "opacity-50 cursor-not-allowed",
        )}
      >
        Base
      </button>
    </div>
  )
}
