"use client"

import Link from "next/link"
import Image from "next/image"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useEffect, useState } from "react"
import { Rocket, Search } from "lucide-react"

export function Navbar() {
  const { connected, publicKey } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Synthfi-1QApORZT7i2i0rPs0B1oGlt3WYqCL4.png"
            alt="SynthFi"
            width={120}
            height={40}
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/explore" className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <Search className="h-4 w-4" />
            <span>Explore</span>
          </Link>
          <Link href="/launchpad" className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <Rocket className="h-4 w-4" />
            <span>Launchpad</span>
          </Link>

          {mounted && (
            <WalletMultiButton className="!bg-gray-800 hover:!bg-gray-700 !rounded-md !px-4 !py-2 !text-sm" />
          )}
        </div>
      </div>
    </header>
  )
}
