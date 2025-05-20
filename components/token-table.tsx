"use client"

import type { Token } from "@/lib/token-data"
import { formatMarketCap, formatPrice, formatDate, shortenAddress } from "@/lib/utils-format"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, ArrowUpDown, ListOrderedIcon as SortIcon } from "lucide-react"
// Change the import for Image to avoid naming conflicts
import NextImage from "next/image"
import { useState } from "react"

interface TokenTableProps {
  tokens: Token[]
  onSort: (column: string) => void
  sortColumn: string
  sortDirection: "asc" | "desc"
}

export function TokenTable({ tokens, onSort, sortColumn, sortDirection }: TokenTableProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const getSortIcon = (column: string) => {
    if (sortColumn === column) {
      return <SortIcon className={`ml-1 h-4 w-4 inline ${sortDirection === "asc" ? "rotate-180" : ""}`} />
    }
    return <SortIcon className="ml-1 h-4 w-4 inline opacity-20" />
  }

  return (
    <div className="rounded-md border border-gray-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-800">
          <TableRow className="hover:bg-gray-800/80 border-gray-700">
            <TableHead className="text-gray-400 w-[250px]">
              <button className="flex items-center font-medium" onClick={() => onSort("name")}>
                Token {getSortIcon("name")}
              </button>
            </TableHead>
            <TableHead className="text-gray-400">
              <button className="flex items-center font-medium" onClick={() => onSort("marketCap")}>
                Market Cap {getSortIcon("marketCap")}
              </button>
            </TableHead>
            <TableHead className="text-gray-400">
              <button className="flex items-center font-medium" onClick={() => onSort("price")}>
                Price {getSortIcon("price")}
              </button>
            </TableHead>
            <TableHead className="text-gray-400">
              <button className="flex items-center font-medium" onClick={() => onSort("launchDate")}>
                Launch Date {getSortIcon("launchDate")}
              </button>
            </TableHead>
            <TableHead className="text-gray-400">Contract</TableHead>
            <TableHead className="text-gray-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => (
            <TableRow key={token.id} className="hover:bg-gray-800/50 border-gray-700">
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <div className="relative w-8 h-8 mr-3">
                    {/* Then replace all instances of Image with NextImage in the component */}
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
                      <div className="ml-2 flex space-x-1">
                        {token.trending && (
                          <Badge className="bg-orange-600 hover:bg-orange-700 text-xs py-0">Trending</Badge>
                        )}
                        {token.verified && (
                          <Badge className="bg-green-600 hover:bg-green-700 text-xs py-0">Verified</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{token.symbol}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-white">{formatMarketCap(token.marketCap)}</TableCell>
              <TableCell className="text-white">{formatPrice(token.price)}</TableCell>
              <TableCell className="text-white">
                {formatDate(token.launchDate)}
                {new Date(token.launchDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                  <Badge className="ml-2 bg-blue-600 hover:bg-blue-700 text-xs py-0">New</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="text-white mr-1">{shortenAddress(token.mintAddress)}</span>
                  <button onClick={() => copyAddress(token.mintAddress)} className="text-gray-400 hover:text-white">
                    {copiedAddress === token.mintAddress ? (
                      <span className="text-green-500 text-xs">Copied!</span>
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    asChild
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!token.hasLiquidity}
                  >
                    <a
                      href={`https://raydium.io/swap/?input=SOL&output=${token.mintAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ArrowUpDown className="mr-1 h-3 w-3" />
                      Swap
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <a
                      href={`https://explorer.solana.com/address/${token.mintAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
