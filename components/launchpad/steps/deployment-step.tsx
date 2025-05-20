"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DeploymentStepProps {
  programCode: string
  securityIssues: string[]
  walletConnected: boolean
  onComplete: (data: { programId: string; signature: string }) => void
}

export function DeploymentStep({ programCode, securityIssues, walletConnected, onComplete }: DeploymentStepProps) {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<
    "idle" | "building" | "deploying" | "confirming" | "complete" | "error"
  >("idle")
  const [deploymentData, setDeploymentData] = useState<{
    programId: string
    signature: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showComingSoon, setShowComingSoon] = useState(false)

  const handleDeploy = async () => {
    if (!walletConnected) {
      setError("Please connect your wallet to deploy")
      return
    }

    if (securityIssues.length > 0) {
      setError("Please fix all security issues before deploying")
      return
    }

    setIsDeploying(true)
    setDeploymentStatus("building")
    setError(null)

    // Simulate build process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setDeploymentStatus("deploying")
    // Simulate deployment
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Instead of showing success, show the coming soon message
    setShowComingSoon(true)
    setIsDeploying(false)

    // Simulate successful deployment data for UI flow
    const data = {
      programId: "CgTTcBPXAjzdKJfbEPVUShKJnGWqNUDKASR8DQvh1SW5",
      signature: "5UqzMmJLBVD6R6SJ4RVzTRnQBNpNhCYrmWqR5xVy1xjKRT9qTBHyQMkTABKTJeCtA3kTq41K4EevzZ6xVxSG8UZj",
    }

    setDeploymentData(data)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Step 2: Contract Deployment to Solana</h2>

      {!walletConnected && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>Please connect your Phantom wallet to deploy your program to Solana.</AlertDescription>
        </Alert>
      )}

      {securityIssues.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Security Issues Detected</AlertTitle>
          <AlertDescription>Please fix all security issues before deploying your program.</AlertDescription>
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
          <AlertTitle className="text-blue-300">Deployment Coming Soon</AlertTitle>
          <AlertDescription className="text-blue-300">
            On-chain integration is in progress. Full deployment functionality will be available soon.
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-gray-900 border-gray-700 mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Deployment Status</h3>

          <div className="space-y-4">
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-3 ${
                  deploymentStatus === "building"
                    ? "bg-yellow-500 animate-pulse"
                    : deploymentStatus === "deploying" ||
                        deploymentStatus === "confirming" ||
                        deploymentStatus === "complete"
                      ? "bg-green-500"
                      : "bg-gray-500"
                }`}
              ></div>
              <span className="text-gray-300">Building program</span>
            </div>

            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-3 ${
                  deploymentStatus === "deploying"
                    ? "bg-yellow-500 animate-pulse"
                    : deploymentStatus === "confirming" || deploymentStatus === "complete"
                      ? "bg-green-500"
                      : "bg-gray-500"
                }`}
              ></div>
              <span className="text-gray-300">Deploying to Solana</span>
            </div>

            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-3 ${
                  deploymentStatus === "confirming"
                    ? "bg-yellow-500 animate-pulse"
                    : deploymentStatus === "complete"
                      ? "bg-green-500"
                      : "bg-gray-500"
                }`}
              ></div>
              <span className="text-gray-300">Confirming transaction</span>
            </div>
          </div>

          {deploymentData && showComingSoon && (
            <div className="mt-6 p-4 bg-gray-800 rounded border border-gray-700">
              <h4 className="font-semibold text-blue-400 mb-2">Deployment Preview</h4>
              <p className="text-gray-400 mb-2">
                This is a preview of how your deployment will appear once on-chain integration is complete:
              </p>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Program ID: </span>
                  <span className="text-gray-300">{deploymentData.programId}</span>
                </div>

                <div>
                  <span className="text-gray-400">Transaction: </span>
                  <span className="text-gray-300">{`${deploymentData.signature.slice(
                    0,
                    8,
                  )}...${deploymentData.signature.slice(-8)}`}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        {showComingSoon ? (
          <Button onClick={() => onComplete(deploymentData!)} className="bg-purple-600 hover:bg-purple-700">
            Continue to Add Liquidity
          </Button>
        ) : (
          <Button
            onClick={handleDeploy}
            disabled={isDeploying || !walletConnected || securityIssues.length > 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isDeploying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying...
              </>
            ) : (
              "Deploy to Solana"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
