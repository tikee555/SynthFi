"use client"

import type { Token } from "@/lib/token-data"
import { formatMarketCap, formatPrice, getTimeAgo, shortenAddress } from "@/lib/utils-format"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, ArrowUpDown } from "lucide-react"
import NextImage from "next/image"
import { useState } from "react"

interface TokenCardProps {
  token: Token
}

export function TokenCard({ token }: TokenCardProps) {
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(token.mintAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const raydiumSwapUrl = `https://raydium.io/swap/?input=SOL&output=${token.mintAddress}`

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="relative w-10 h-10 mr-3">
              <NextImage
                src={token.logoUrl || "/placeholder.svg?height=40&width=40&query=token"}
                alt={token.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{token.name}</h3>
              <p className="text-sm text-gray-400">{token.symbol}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            {token.trending && <Badge className="bg-orange-600 hover:bg-orange-700">Trending</Badge>}
            {token.verified && <Badge className="bg-green-600 hover:bg-green-700">Verified</Badge>}
            {!token.hasLiquidity && (
              <Badge variant="outline" className="border-yellow-600 text-yellow-500">
                No Liquidity
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Market Cap</p>
            <p className="text-white font-medium">{formatMarketCap(token.marketCap)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Price</p>
            <p className="text-white font-medium">{formatPrice(token.price)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Launch Date</p>
            <p className="text-white font-medium">{getTimeAgo(token.launchDate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Contract</p>
            <div className="flex items-center">
              <span className="text-white font-medium mr-1">{shortenAddress(token.mintAddress)}</span>
              <button onClick={copyAddress} className="text-gray-400 hover:text-white">
                {copied ? <span className="text-green-500 text-xs">Copied!</span> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
            <a href={raydiumSwapUrl} target="_blank" rel="noopener noreferrer">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Swap
            </a>
          </Button>
          <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <a
              href={`https://explorer.solana.com/address/${token.mintAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
