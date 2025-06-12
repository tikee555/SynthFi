"use client"

// --- THIS IS THE CRUCIAL IMPORT ---
// Ensure this line is exactly: import { TokenLandingPageBuilderForm } from ...
import { TokenLandingPageBuilderForm } from "@/components/token-landing-page-builder-form"
import { Suspense } from "react"
import { useSearchParams, useParams } from "next/navigation"

function LandingBuilderContent() {
  const params = useParams()
  const searchParams = useSearchParams()

  const tokenId = params.id as string
  const tokenName = searchParams.get("tokenName") || undefined
  const tokenSymbol = searchParams.get("tokenSymbol") || undefined

  if (!tokenId) {
    // This case should render an error message, not the "Loading builder..." fallback.
    return <div className="text-white text-center py-10">Error: Token ID is missing.</div>
  }

  // If TokenLandingPageBuilderForm fails to import/render, Suspense fallback will show.
  return <TokenLandingPageBuilderForm tokenId={tokenId} initialTokenName={tokenName} initialTokenSymbol={tokenSymbol} />
}

export default function LandingBuilderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00000A] to-[#0A0014] text-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-white text-center py-10">Loading builder...</div>}>
          <LandingBuilderContent />
        </Suspense>
      </main>
    </div>
  )
}
