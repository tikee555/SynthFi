"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Info } from "lucide-react"

interface LiquidityStepProps {
  programId: string
  walletConnected: boolean
  onComplete: (data: { poolAddress: string; lpTokenAmount: string; transactionId: string }) => void
}

export function LiquidityStep({ programId, walletConnected, onComplete }: LiquidityStepProps) {
  const [tokenPair, setTokenPair] = useState("SOL")
  const [tokenAmount, setTokenAmount] = useState("")
  const [baseAmount, setBaseAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState<
    "idle" | "validating" | "creating" | "adding" | "confirming" | "complete" | "error"
  >("idle")
  const [error, setError] = useState<string | null>(null)
  const [liquidityData, setLiquidityData] = useState<{
    poolAddress: string
    lpTokenAmount: string
    transactionId: string
  } | null>(null)
  const [showComingSoon, setShowComingSoon] = useState(false)

  const handleAddLiquidity = async () => {
    if (!walletConnected) {
      setError("Please connect your wallet to add liquidity")
      return
    }

    if (!tokenAmount || !baseAmount) {
      setError("Please enter both token and base amounts")
      return
    }

    setIsProcessing(true)
    setStatus("validating")
    setError(null)

    // Simulate balance validation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStatus("creating")
    // Simulate pool creation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setStatus("adding")
    // Simulate adding liquidity
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Instead of showing success, show the coming soon message
    setShowComingSoon(true)
    setIsProcessing(false)

    // Simulate successful liquidity addition for UI flow
    const data = {
      poolAddress: "DFL1zNkaGPWm1BqAVqRjCZvHmwTFrEaJtbzJWgseoNJh",
      lpTokenAmount: "1000.00",
      transactionId: "4WA5AUwPcEuMKd4R9u3sFXLqgTbRmwMkm4xw7JNxBUrPQebHYmCiAWNVSiJeYTgHxPCkrQXoTYJwL1tM3HJgimQs",
    }

    setLiquidityData(data)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Step 3: Add Liquidity to Raydium</h2>

      {!walletConnected && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>Please connect your Phantom wallet to add liquidity.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showComingSoon && (
        <Alert className="mb-6 bg-blue-900/20 border-blue-800">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertTitle className="text-blue-300">Liquidity Addition Coming Soon</AlertTitle>
          <AlertDescription className="text-blue-300">
            On-chain integration with Raydium is in progress. Full liquidity functionality will be available soon.
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-gray-900 border-gray-700 mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="token-pair">Select Pair</Label>
              <Select value={tokenPair} onValueChange={setTokenPair} disabled={isProcessing}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select pair" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="token-amount">Token Amount</Label>
              <Input
                id="token-amount"
                type="number"
                placeholder="Enter token amount"
                className="bg-gray-800 border-gray-700"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div>
              <Label htmlFor="base-amount">{tokenPair} Amount</Label>
              <Input
                id="base-amount"
                type="number"
                placeholder={`Enter ${tokenPair} amount`}
                className="bg-gray-800 border-gray-700"
                value={baseAmount}
                onChange={(e) => setBaseAmount(e.target.value)}
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Liquidity Status</h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full mr-3 ${
                    status === "validating"
                      ? "bg-yellow-500 animate-pulse"
                      : status === "creating" || status === "adding" || status === "confirming" || status === "complete"
                        ? "bg-green-500"
                        : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-gray-300">Validating balances</span>
              </div>

              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full mr-3 ${
                    status === "creating"
                      ? "bg-yellow-500 animate-pulse"
                      : status === "adding" || status === "confirming" || status === "complete"
                        ? "bg-green-500"
                        : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-gray-300">Creating pool</span>
              </div>

              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full mr-3 ${
                    status === "adding"
                      ? "bg-yellow-500 animate-pulse"
                      : status === "confirming" || status === "complete"
                        ? "bg-green-500"
                        : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-gray-300">Adding liquidity</span>
              </div>

              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full mr-3 ${
                    status === "confirming"
                      ? "bg-yellow-500 animate-pulse"
                      : status === "complete"
                        ? "bg-green-500"
                        : "bg-gray-500"
                  }`}
                ></div>
                <span className="text-gray-300">Confirming transaction</span>
              </div>
            </div>
          </div>

          {liquidityData && showComingSoon && (
            <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-700">
              <h4 className="font-semibold text-blue-400 mb-2">Liquidity Preview</h4>
              <p className="text-gray-400 mb-2">
                This is a preview of how your liquidity addition will appear once on-chain integration is complete:
              </p>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Pool Address: </span>
                  <span className="text-gray-300">{liquidityData.poolAddress}</span>
                </div>

                <div>
                  <span className="text-gray-400">LP Token Amount: </span>
                  <span className="text-gray-300">{liquidityData.lpTokenAmount}</span>
                </div>

                <div>
                  <span className="text-gray-400">Transaction: </span>
                  <span className="text-gray-300">{`${liquidityData.transactionId.slice(
                    0,
                    8,
                  )}...${liquidityData.transactionId.slice(-8)}`}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {showComingSoon ? (
          <Button onClick={() => onComplete(liquidityData!)} className="bg-purple-600 hover:bg-purple-700">
            Continue to Finalize Launch
          </Button>
        ) : (
          <Button
            onClick={handleAddLiquidity}
            disabled={isProcessing || !walletConnected || !tokenAmount || !baseAmount}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Add Liquidity"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
