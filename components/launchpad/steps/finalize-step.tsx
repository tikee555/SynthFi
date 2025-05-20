"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, CheckCircle } from "lucide-react"
import Link from "next/link"

interface FinalizeStepProps {
  programId: string
  poolAddress: string
  lpTokenAmount: string
  onComplete: () => void
}

export function FinalizeStep({ programId, poolAddress, lpTokenAmount, onComplete }: FinalizeStepProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-green-900/30 p-4 rounded-full">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">Launch Complete!</h2>
      <p className="text-gray-400 text-center mb-8">
        Your Solana program has been successfully deployed and liquidity has been added to Raydium.
      </p>

      <Card className="bg-gray-900 border-gray-700 mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Deployment Summary</h3>

          <div className="space-y-4">
            <div>
              <span className="text-gray-400 block mb-1">Program ID:</span>
              <a
                href={`https://explorer.solana.com/address/${programId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline flex items-center"
              >
                {programId}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>

            <div>
              <span className="text-gray-400 block mb-1">Pool Address:</span>
              <a
                href={`https://explorer.solana.com/address/${poolAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline flex items-center"
              >
                {poolAddress}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>

            <div>
              <span className="text-gray-400 block mb-1">LP Token Amount:</span>
              <span className="text-white">{lpTokenAmount}</span>
            </div>

            <div>
              <span className="text-gray-400 block mb-1">Trade on Raydium:</span>
              <a
                href={`https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${programId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline flex items-center"
              >
                Open on Raydium
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/app">Create Another Program</Link>
        </Button>

        <Button asChild variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-950/30">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
