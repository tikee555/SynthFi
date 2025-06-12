"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { WalletConnectModal } from "@/components/wallet-connect-modal"

interface DeployContractStepProps {
  contractData: {
    name: string
    symbol: string
    description: string
    image: string
    totalSupply: string
    mintAuthorityRevoked: boolean
    contractId: string
    aiIntegration?: boolean
    aiDescription?: string
    aiCost?: number
  }
  walletConnected: boolean
  onConnectWallet: () => void
  onDeploy: () => void
}

export function DeployContractStep({
  contractData,
  walletConnected,
  onConnectWallet,
  onDeploy,
}: DeployContractStepProps) {
  const { isConnected, walletAddress, walletType } = useWallet()
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  return (
    <div className="space-y-8">
      <div className="bg-[#0f172a] rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Deploy to Solana Devnet</h2>

        <div className="bg-purple-900/20 border border-purple-900 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-300">
            Deployment is on Solana Devnet only — backend deployment system is under development.
          </p>
        </div>

        {!isConnected ? (
          <div>
            <p className="mb-4 text-gray-300">Connect your wallet to deploy your contract to Solana Devnet.</p>
            <Button onClick={() => setIsWalletModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div>
            <div className="bg-[#0d111c] rounded-lg p-6 mb-6">
              <h3 className="text-xl font-medium mb-4">Token Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="font-medium">{contractData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Symbol:</span>
                    <span className="font-medium">{contractData.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Supply:</span>
                    <span className="font-medium">{contractData.totalSupply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mint Authority:</span>
                    <span
                      className={`font-medium ${contractData.mintAuthorityRevoked ? "text-red-500" : "text-green-500"}`}
                    >
                      {contractData.mintAuthorityRevoked ? "Revoked" : "Active"}
                    </span>
                  </div>
                  {contractData.aiIntegration && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">AI Integration:</span>
                      <span className="font-medium text-purple-500">Enabled</span>
                    </div>
                  )}
                </div>

                {contractData.image && (
                  <div className="flex justify-center">
                    <div className="w-24 h-24 bg-[#1e293b] border border-zinc-700 rounded-lg overflow-hidden">
                      <img
                        src={contractData.image || "/placeholder.svg"}
                        alt="Token"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {contractData.description && (
                <div className="mt-4">
                  <span className="text-gray-400">Description:</span>
                  <p className="mt-1 text-gray-300">{contractData.description}</p>
                </div>
              )}

              {contractData.aiIntegration && contractData.aiDescription && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center mb-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-500 mr-2"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    <span className="text-gray-400">AI Capabilities:</span>
                  </div>
                  <p className="mt-1 text-gray-300">{contractData.aiDescription}</p>

                  <div className="mt-4 bg-purple-900/20 border border-purple-900 rounded-lg p-3">
                    <div className="flex items-center text-sm">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-purple-500 mr-2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>
                        AI Integration Fee: <span className="font-medium">$50 worth of SYNTHFI</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#0d111c] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-600 mr-3 flex items-center justify-center">
                    {walletType === "metamask" ? (
                      <svg width="16" height="16" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M32.9582 1L19.8241 10.7183L22.2665 5.09082L32.9582 1Z"
                          fill="#E17726"
                          stroke="#E17726"
                          strokeWidth="0.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.04187 1L15.0446 10.809L12.7336 5.09082L2.04187 1Z"
                          fill="#E27625"
                          stroke="#E27625"
                          strokeWidth="0.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M64 0C28.7 0 0 28.7 0 64C0 99.3 28.7 128 64 128C99.3 128 128 99.3 128 64C128 28.7 99.3 0 64 0Z"
                          fill="#AB9FF2"
                        />
                        <path
                          d="M108.9 59.7C108.1 58.1 106.6 57 104.9 56.7C103.9 56.5 102.8 56.5 101.8 56.5H97.2C96.4 56.5 95.7 55.8 95.7 55V42.4C95.7 40.5 94.5 38.8 92.7 38.1C91.9 37.8 91 37.7 90.1 37.7C88.8 37.7 87.6 38.1 86.6 38.8L53.5 62.2C52.5 62.9 51.3 63.2 50.1 63.2C48.8 63.2 47.6 62.8 46.6 62.2L40.1 57.6C39.1 56.9 37.9 56.5 36.6 56.5C35.4 56.5 34.2 56.9 33.2 57.6L28.5 60.9C27.2 61.8 26.4 63.3 26.4 64.9C26.4 66.5 27.2 68 28.5 68.9L33.2 72.2C34.2 72.9 35.4 73.3 36.6 73.3C37.9 73.3 39.1 72.9 40.1 72.2L46.6 67.6C47.6 66.9 48.8 66.5 50.1 66.5C51.3 66.5 52.5 66.9 53.5 67.6L86.6 90.9C87.6 91.6 88.8 92 90.1 92C91 92 91.9 91.9 92.7 91.6C94.5 90.9 95.7 89.2 95.7 87.3V74.7C95.7 73.9 96.4 73.2 97.2 73.2H101.8C102.8 73.2 103.9 73.2 104.9 73C106.6 72.7 108.1 71.6 108.9 70C109.5 68.8 109.5 67.4 109.5 66.1V63.6C109.5 62.3 109.5 60.9 108.9 59.7Z"
                          fill="white"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">
                      Connected with {walletType === "metamask" ? "MetaMask" : "Phantom"}
                    </div>
                    <div className="font-medium">
                      {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress.length - 4)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
                  onClick={() => setIsWalletModalOpen(true)}
                >
                  Change
                </Button>
              </div>
            </div>

            <Button onClick={onDeploy} className="bg-purple-600 hover:bg-purple-700 text-white w-full">
              Deploy to Devnet
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
        )}
      </div>

      <WalletConnectModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </div>
  )
}
