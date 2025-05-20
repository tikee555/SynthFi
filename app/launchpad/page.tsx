"use client"
import { LaunchpadStepper } from "@/components/launchpad/launchpad-stepper"
import { WalletConnect } from "@/components/launchpad/wallet-connect"
import { useCodeStore } from "@/lib/store"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function LaunchpadPage() {
  const { generatedCode } = useCodeStore()

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto py-24 px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">SynthFi Launchpad</h1>
        <p className="text-gray-400 text-center mb-12">Deploy your Solana program and add liquidity in minutes</p>

        <WalletConnect />
        <LaunchpadStepper initialCode={generatedCode} />
      </div>
      <Footer />
    </main>
  )
}
