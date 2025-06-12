"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddLiquidityStepProps {
  contractData: {
    name: string
    symbol: string
    contractId: string
  }
  onAddLiquidity: (amount: string, tokenAmount: string, pair: string) => void
}

export function AddLiquidityStep({ contractData, onAddLiquidity }: AddLiquidityStepProps) {
  const [tokenAmount, setTokenAmount] = useState("1000")
  const [solAmount, setSolAmount] = useState("10")
  const [pair, setPair] = useState("SOL")

  return (
    <div className="space-y-8">
      <div className="bg-[#0f172a] rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Add Liquidity to Raydium</h2>

        <div className="bg-purple-900/20 border border-purple-900 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-300">
            Liquidity provisioning is currently simulated. Full Raydium integration coming soon.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Contract ID:</span>
            <div className="flex items-center">
              <span className="font-medium text-sm mr-2">{contractData.contractId}</span>
              <a
                href={`https://explorer.solana.com/address/${contractData.contractId}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-500 hover:text-purple-400"
              >
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
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Token Amount</label>
            <div className="flex">
              <Input
                type="number"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                className="bg-[#1e293b] border-zinc-700 text-white"
              />
              <div className="bg-zinc-800 px-3 flex items-center ml-2 rounded-md">{contractData.symbol}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Pair With</label>
            <div className="flex space-x-2 mb-2">
              <Button
                type="button"
                onClick={() => setPair("SOL")}
                className={`rounded-full px-4 ${
                  pair === "SOL"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
                }`}
              >
                SOL
              </Button>
              <Button
                type="button"
                onClick={() => setPair("USDC")}
                className={`rounded-full px-4 ${
                  pair === "USDC"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
                }`}
              >
                USDC
              </Button>
            </div>

            <div className="flex">
              <Input
                type="number"
                value={solAmount}
                onChange={(e) => setSolAmount(e.target.value)}
                className="bg-[#1e293b] border-zinc-700 text-white"
              />
              <div className="bg-zinc-800 px-3 flex items-center ml-2 rounded-md">{pair}</div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onAddLiquidity(solAmount, tokenAmount, pair)}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full"
        >
          Add Liquidity
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
