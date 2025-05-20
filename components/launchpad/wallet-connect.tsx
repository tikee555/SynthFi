"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useEffect, useState } from "react"

export function WalletConnect() {
  const { connected, publicKey } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
        <p className="mb-4 text-gray-300">
          {connected
            ? `Connected: ${publicKey?.toString().slice(0, 4)}...${publicKey?.toString().slice(-4)}`
            : "Connect your Phantom wallet to continue"}
        </p>
        <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 rounded-md px-4 py-2 text-white" />
      </div>
    </div>
  )
}
