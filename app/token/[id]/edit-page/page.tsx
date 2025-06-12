"use client"

import { useRouter, useParams } from "next/navigation"
import { TokenLandingPageEditor } from "@/components/token-landing-page-editor"
import type { LandingPageConfig } from "@/types/token-landing-page"
import SynthFiHeader from "@/components/synthfi-header"
import { SynthFiFooter } from "@/components/synthfi-footer"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"

export default function EditTokenLandingPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const tokenId = params.id as string

  const [initialConfig, setInitialConfig] = useState<Partial<LandingPageConfig> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const savedConfigString = localStorage.getItem(`landingPageConfig-${tokenId}`)
      if (savedConfigString) {
        const savedConfig = JSON.parse(savedConfigString) as LandingPageConfig
        setInitialConfig(savedConfig)
      } else {
        // If no config, maybe redirect to create or show a message
        // For now, we'll allow editing from a blank slate if tokenName/Symbol are present
        // but it's better if this page is only accessed if a config exists.
        // Let's try to get tokenName/Symbol from currentSimulatedToken if no config
        const storedSimulatedTokenString = localStorage.getItem("currentSimulatedToken")
        let name = tokenId
        let symbol = tokenId.substring(0, 5).toUpperCase()
        if (storedSimulatedTokenString) {
          const storedToken = JSON.parse(storedSimulatedTokenString)
          if (storedToken.id === tokenId) {
            name = storedToken.name
            symbol = storedToken.symbol
          }
        }
        setInitialConfig({ tokenName: name, tokenSymbol: symbol }) // Provide base info
        toast({
          title: "No existing page found",
          description: "Starting with a new configuration for this token.",
          variant: "default",
        })
      }
    } catch (e) {
      console.error("Failed to load landing page config:", e)
      setError("Could not load existing configuration.")
      toast({
        title: "Error Loading Page",
        description: "Could not load your landing page configuration.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }, [tokenId, toast])

  const handleSave = (config: LandingPageConfig) => {
    try {
      localStorage.setItem(`landingPageConfig-${tokenId}`, JSON.stringify(config))
      toast({
        title: "Landing Page Updated!",
        description: "Your token landing page has been updated.",
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

  if (error || !initialConfig) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <SynthFiHeader />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-red-500">{error || "Could not load page configuration."}</p>
        </main>
        <SynthFiFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SynthFiHeader />
      <main className="flex-1 py-8">
        <TokenLandingPageEditor
          initialConfig={initialConfig}
          tokenId={tokenId}
          tokenName={initialConfig.tokenName || tokenId}
          tokenSymbol={initialConfig.tokenSymbol || tokenId.substring(0, 5).toUpperCase()}
          onSave={handleSave}
        />
      </main>
      <SynthFiFooter />
    </div>
  )
}
