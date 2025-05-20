import type { Token } from "@/lib/token-data"
import { formatMarketCap, formatPrice } from "@/lib/utils-format"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
// Change the import for Image to avoid naming conflicts
import NextImage from "next/image"

interface TrendingTokensProps {
  tokens: Token[]
}

export function TrendingTokens({ tokens }: TrendingTokensProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
          <h3 className="text-lg font-semibold text-white">Trending Tokens</h3>
        </div>
        <div className="space-y-4">
          {tokens.map((token) => (
            <div key={token.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative w-8 h-8 mr-3">
                  <NextImage
                    src={token.logoUrl || "/placeholder.svg?height=32&width=32&query=token"}
                    alt={token.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <div className="text-white flex items-center">
                    {token.name}
                    {token.verified && (
                      <Badge className="ml-2 bg-green-600 hover:bg-green-700 text-xs py-0">Verified</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">{token.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{formatPrice(token.price)}</div>
                <div className="text-sm text-gray-400">{formatMarketCap(token.marketCap)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
