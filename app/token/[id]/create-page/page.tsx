"use client"

import { useRouter, useParams, useSearchParams } from "next/navigation"
import { TokenLandingPageEditor } from "@/components/token-landing-page-editor"
import type { LandingPageConfig } from "@/types/token-landing-page"
import SynthFiHeader from "@/components/synthfi-header"
import { SynthFiFooter } from "@/components/synthfi-footer"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"

export default function CreateTokenLandingPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const tokenId = params.id as string
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const name = searchParams.get("name")
    const symbol = searchParams.get("symbol")

    if (name && symbol) {
      setTokenName(name)
      setTokenSymbol(symbol)
      setIsLoading(false)
    } else {
      // Fallback: try to get from a simulated token if query params are missing
      // This might happen if user navigates directly or refreshes
      const storedSimulatedTokenString = localStorage.getItem("currentSimulatedToken")
      if (storedSimulatedTokenString) {
        const storedToken = JSON.parse(storedSimulatedTokenString)
        if (storedToken.id === tokenId) {
          setTokenName(storedToken.name)
          setTokenSymbol(storedToken.symbol)
          setIsLoading(false)
          return
        }
      }
      // If still no name/symbol, consider redirecting or showing error
      // For now, let's allow proceeding with defaults if necessary
      setTokenName(tokenId) // Default to ID if name not found
      setTokenSymbol(tokenId.substring(0, 5).toUpperCase()) // Default to part of ID
      toast({
        title: "Token Info Missing",
        description: "Could not fully load token name and symbol. Using defaults.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [searchParams, tokenId, toast])

  const handleSave = (config: LandingPageConfig) => {
    try {
      localStorage.setItem(`landingPageConfig-${tokenId}`, JSON.stringify(config))
      toast({
        title: "Landing Page Saved!",
        description: "Your token landing page has been created and saved.",
      })
      router.push(`/token/${tokenId}/landing`)
    } catch (error) {
      console.error("Failed to save landing page config:", error)
      toast({
        title: "Error Saving Page",
        description: "Could not save your landing page. Local storage might be full.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <SynthFiHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading editor...</p>
        </main>
        <SynthFiFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SynthFiHeader />
      <main className="flex-1 py-8">
        <TokenLandingPageEditor tokenId={tokenId} tokenName={tokenName} tokenSymbol={tokenSymbol} onSave={handleSave} />
      </main>
      <SynthFiFooter />
    </div>
  )
}
