"use client"

import { useState, useEffect } from "react"
import SynthFiHeader from "@/components/synthfi-header"
import { SynthFiFooter } from "@/components/synthfi-footer"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCurrency, formatNumber, shortenAddress } from "@/lib/utils"
import Link from "next/link"

export default function TokenPreviewPage() {
  const [token, setToken] = useState<any>(null)
  const [swapAmount, setSwapAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")

  useEffect(() => {
    // Get the simulated token from localStorage
    const simulatedToken = localStorage.getItem("currentSimulatedToken")
    if (simulatedToken) {
      setToken(JSON.parse(simulatedToken))
    }
  }, [])

  if (!token) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <SynthFiHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Token Preview Available</h1>
            <p className="text-gray-400 mb-6">You need to complete the token creation process first.</p>
            <Link href="/launchpad">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Go to Launchpad</Button>
            </Link>
          </div>
        </main>
        <SynthFiFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SynthFiHeader />

      <main className="flex-1 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Simulation Warning */}
          <Alert className="mb-6 bg-purple-900/20 border-purple-600/50 text-purple-200">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-400"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <AlertDescription className="text-purple-100">
              <strong>Devnet Simulation Only.</strong> This token preview shows how your token would appear if deployed
              to Solana. To deploy this token for real, you would need to connect a wallet and pay gas fees.
            </AlertDescription>
          </Alert>

          {/* Token Header */}
          <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-[#1e293b] border border-zinc-700">
                <img src={token.logo || "/placeholder.svg?height=300&width=500&text=" + (token.symbol || "TOKEN")} alt={token.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{token.name}</h1>
                  <span className="text-gray-400 text-xl md:text-2xl">{token.symbol}</span>

                  <div className="bg-purple-900/70 text-purple-400 text-xs px-2 py-1 rounded-full flex items-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                    Devnet Preview
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                  <div>
                    <div className="text-sm text-gray-400">Price</div>
                    <div className="font-medium text-lg">{formatCurrency(token.price)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Market Cap</div>
                    <div className="font-medium text-lg">{formatNumber(token.marketCap)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Launch Date</div>
                    <div className="font-medium text-lg">{new Date(token.launchDate).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-400 mr-2">Contract:</div>
                    <div className="font-medium">{shortenAddress(token.contractAddress)}</div>
                    <button
                      className="ml-2 text-gray-400 hover:text-white"
                      onClick={() => {
                        navigator.clipboard.writeText(token.contractAddress)
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    {token.website && (
                      <a
                        href={token.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1e293b] hover:bg-[#2a324a] p-2 rounded-full"
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
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                      </a>
                    )}

                    {token.twitter && (
                      <a
                        href={token.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1e293b] hover:bg-[#2a324a] p-2 rounded-full"
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
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                      </a>
                    )}

                    {token.github && (
                      <a
                        href={token.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#1e293b] hover:bg-[#2a324a] p-2 rounded-full"
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
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white" disabled>
                  Deploy to Mainnet
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
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Price Chart */}
              <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
                <div className="aspect-video w-full bg-[#1e293b] rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-12 h-12 bg-[#2a324a] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                      </svg>
                    </div>
                    <p className="text-gray-400">Price chart unavailable for devnet preview</p>
                    <p className="text-sm text-gray-500 mt-2">Deploy to mainnet to see real price data</p>
                  </div>
                </div>
              </div>

              {/* Token Description */}
              <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">About {token.name}</h2>
                <p className="text-gray-300 mb-4">{token.description}</p>

                {token.prompt && (
                  <div className="mt-6 pt-6 border-t border-zinc-800">
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
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      <div className="text-sm text-gray-400">Original Prompt</div>
                    </div>
                    <div className="bg-[#1e293b] p-3 rounded-lg text-gray-300 text-sm">"{token.prompt}"</div>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                      Created with SynthFi
                    </div>
                  </div>
                )}

                {token.aiIntegration && (
                  <div className="mt-6 pt-6 border-t border-zinc-800">
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
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <div className="text-sm text-gray-400">AI Integration</div>
                    </div>
                    <div className="bg-[#1e293b] p-3 rounded-lg">
                      <div className="text-sm text-purple-400 mb-1">Template: {token.aiTemplate}</div>
                      <div className="text-gray-300 text-sm">{token.aiDescription}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tokenomics */}
              <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Tokenomics</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Max Supply</div>
                        <div className="font-medium">{token.tokenomics.maxSupply}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Mint Authority</div>
                        <div className="font-medium">
                          {token.tokenomics.mintAuthorityRevoked ? (
                            <span className="text-green-500">Revoked</span>
                          ) : (
                            <span className="text-yellow-500">Active</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Transfer Rules</div>
                        <div className="font-medium">{token.tokenomics.transferRules}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Vesting Info</div>
                        <div className="font-medium">{token.tokenomics.vestingInfo}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1e293b] rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      {token.tokenomics.auditResult === "No issues found" ? (
                        <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center mr-3">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-yellow-900/30 flex items-center justify-center mr-3">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-yellow-500"
                          >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-400">Audit Result</div>
                        <div className="font-medium">{token.tokenomics.auditResult}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <div className="flex items-center">
                    <div className="text-sm text-gray-400 mr-2">Creator:</div>
                    <div className="font-medium">{shortenAddress(token.creatorWallet)}</div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                <div className="bg-[#1e293b] rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-[#2a324a] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-400">Comments are coming soon!</p>
                  <p className="text-sm text-gray-500 mt-2">Join the conversation about {token.name}</p>
                </div>
              </div>
            </div>

            <div>
              {/* Swap Widget */}
              <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 mb-8 sticky top-8">
                <h2 className="text-xl font-semibold mb-4">Swap</h2>

                <div className="bg-[#1e293b] rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-400"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-400 mb-2">Swap unavailable in preview</p>
                  <p className="text-sm text-gray-500">This token needs to be deployed on-chain before you can swap</p>
                </div>
              </div>

              {/* Deploy to Mainnet */}
              <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Deploy to Mainnet</h2>
                <p className="text-gray-300 text-sm mb-4">
                  Ready to launch your token on Solana mainnet? Connect your wallet and deploy with one click.
                </p>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-3">
                  Connect Wallet to Deploy
                </Button>

                <div className="text-xs text-gray-500 text-center">Deployment requires SOL for gas fees</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SynthFiFooter />
    </div>
  )
}
