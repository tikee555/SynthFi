"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatCurrency, formatNumber } from "@/lib/utils"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Sparkles, LinkIcon, TwitterIcon as LucideTwitterIcon, Edit3, AlertTriangle } from "lucide-react"
import { WatchlistButton } from "@/components/watchlist-button"
import { PriceHistoryChart } from "@/components/price-history-chart"
import type {
  CustomLandingPageConfig,
  LandingPageSection,
  HeroSectionData,
  FeatureGridSectionData,
  TextBlockSectionData,
  CallToActionSectionData,
  FooterSectionData,
} from "@/types/custom-landing-page"
import { initialMockTemplates } from "@/lib/mock-templates"

// Import new block components
import { HeroBlock } from "@/components/landing-page-blocks/hero-block"
import { FeatureGridBlock } from "@/components/landing-page-blocks/feature-grid-block"
import { TextBlock } from "@/components/landing-page-blocks/text-block"
import { CallToActionBlock } from "@/components/landing-page-blocks/cta-block"
import { FooterBlock } from "@/components/landing-page-blocks/footer-block"

const DEFAULT_LOGO_FALLBACK = "/images/synthfi-default-logo.png" // You might need to create this

const isValidDisplayUrl = (urlString?: string): boolean => {
  if (!urlString) return false
  try {
    const url = new URL(urlString)
    return url.protocol === "http:" || url.protocol === "https:" || urlString.startsWith("data:image")
  } catch (_) {
    return false
  }
}

const CustomSectionRenderer: React.FC<{
  section: LandingPageSection
  theme: CustomLandingPageConfig["backgroundStyle"]
  tokenSymbol?: string // For potential use within blocks if needed
}> = ({ section, theme, tokenSymbol }) => {
  switch (section.type) {
    case "hero":
      return <HeroBlock data={section.data as HeroSectionData} theme={theme} />
    case "featureGrid":
      return <FeatureGridBlock data={section.data as FeatureGridSectionData} theme={theme} />
    case "textBlock":
      return <TextBlock data={section.data as TextBlockSectionData} theme={theme} />
    case "cta":
      return <CallToActionBlock data={section.data as CallToActionSectionData} theme={theme} />
    case "footer":
      return <FooterBlock data={section.data as FooterSectionData} theme={theme} />
    default:
      // Optionally render a fallback for unknown section types
      // For now, we'll just return null if type is not recognized
      // This shouldn't happen if AI simulation only generates known types
      console.warn("Unknown section type:", section.type)
      return <div className="p-4 text-center text-red-500">Unsupported section type: {section.type}</div>
  }
}

function TokenDetailPageContent() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const tokenId = params.id as string
  const [tokenData, setTokenData] = useState<any>(null) // For standard view
  const [customPageConfig, setCustomPageConfig] = useState<CustomLandingPageConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSimulatedToken, setIsSimulatedToken] = useState(false)
  const [pageUrl, setPageUrl] = useState("")
  const [aiLayoutError, setAiLayoutError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href)
    }

    if (tokenId) {
      const savedConfigString = localStorage.getItem(`landingPageConfig-${tokenId}`)
      if (savedConfigString) {
        try {
          const parsedConfig = JSON.parse(savedConfigString) as CustomLandingPageConfig
          if (parsedConfig.layoutPreset === "ai-generated") {
            if (!Array.isArray(parsedConfig.customSections) || parsedConfig.customSections.length === 0) {
              setAiLayoutError(
                "AI generated an empty or invalid page layout. Please try regenerating the page via the editor.",
              )
            } else {
              // Validate section data (basic check)
              const isValidSections = parsedConfig.customSections.every((sec) => sec.type && sec.data)
              if (!isValidSections) {
                setAiLayoutError("AI generated sections with missing data. Please regenerate.")
              }
            }
          } else {
            // This case should ideally not happen if form only saves 'ai-generated'
            setAiLayoutError("Saved page configuration is not in the AI-generated format. Please regenerate.")
          }
          setCustomPageConfig(parsedConfig)
        } catch (error) {
          console.error("Failed to parse custom landing page config:", error)
          toast({
            title: "Error Loading Page Design",
            description: "The saved page data seems corrupted.",
            variant: "destructive",
          })
          setAiLayoutError("Could not load the saved page design due to an error.")
        }
      }
      // Load standard token data for fallback view or if no custom config
      let foundToken: any = null
      const storedSimulatedTokenString = localStorage.getItem("currentSimulatedToken")
      if (storedSimulatedTokenString) {
        const storedSimulatedToken = JSON.parse(storedSimulatedTokenString)
        if (storedSimulatedToken.id === tokenId || storedSimulatedToken.contractId === tokenId) {
          foundToken = storedSimulatedToken
          setIsSimulatedToken(true)
        }
      }
      if (!foundToken) {
        const simulatedTokensArray = JSON.parse(localStorage.getItem("simulatedTokens") || "[]")
        foundToken = simulatedTokensArray?.find((t: any) => t.id === tokenId)
        if (foundToken) setIsSimulatedToken(true)
      }
      if (!foundToken) {
        foundToken = initialMockTemplates.find((t) => t.id === tokenId)
        if (foundToken) setIsSimulatedToken(false)
      }
      setTokenData(foundToken)
      setIsLoading(false)
    }
  }, [tokenId, toast])

  if (isLoading)
    return (
      <main className="flex-1 flex items-center justify-center text-white bg-black">
        <p>Loading Token Page...</p>
      </main>
    )

  // --- AI-Generated Page View ---
  if (customPageConfig && customPageConfig.layoutPreset === "ai-generated") {
    const config = customPageConfig
    const theme = config.backgroundStyle || "dark"
    let pageContainerClasses = "flex-1" // Blocks will handle their own text colors based on theme
    const globalFontFamily = ""
    let bodyBgColor = "#000000" // Default body background

    // Apply global page theme styles
    switch (theme) {
      case "comic":
        pageContainerClasses += " font-comic" // Assuming you have a 'font-comic' utility
        bodyBgColor = "#FEFCE8" // Yellowish white for comic background
        break
      case "cyberpunk":
        pageContainerClasses += " font-orbitron" // Assuming 'font-orbitron'
        bodyBgColor = "#0d0221" // Dark purple/blue for cyberpunk
        break
      case "neon":
        pageContainerClasses += " font-rajdhani" // Assuming 'font-rajdhani'
        bodyBgColor = "#000000" // Black for neon
        break
      case "light":
        pageContainerClasses += " bg-gray-100"
        bodyBgColor = "#F3F4F6" // Light gray
        break
      case "gradient1":
        pageContainerClasses += " bg-gradient-to-br from-purple-900 via-black to-indigo-900"
        break
      case "gradient2":
        pageContainerClasses += " bg-gradient-to-br from-pink-700 via-purple-900 to-orange-700"
        break
      case "image":
        // Background image handled by inline style
        break
      default: // dark
        pageContainerClasses += " bg-black"
        break
    }

    const backgroundInlineStyle: React.CSSProperties =
      config.backgroundStyle === "image" && config.backgroundImageUrl && isValidDisplayUrl(config.backgroundImageUrl)
        ? {
            backgroundImage: `url(${config.backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed", // Optional: for parallax-like effect
          }
        : {}

    const pageContent = aiLayoutError ? (
      <div className="p-8 md:p-12 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto bg-red-900/30 border-red-700 text-red-200">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <AlertTitle className="text-red-300 font-semibold">AI Layout Generation Issue</AlertTitle>
          <AlertDescription className="text-red-200/90">{aiLayoutError}</AlertDescription>
        </Alert>
      </div>
    ) : (
      config.customSections.map((section) => (
        <CustomSectionRenderer
          key={section.id}
          section={section}
          theme={theme}
          tokenSymbol={config.tokenSymbol || config.projectTitle}
        />
      ))
    )

    return (
      <main className={pageContainerClasses} style={backgroundInlineStyle}>
        {/* Page content is now rendered by CustomSectionRenderer using block components */}
        {pageContent}

        {/* Edit/Reset buttons at the bottom of the AI page */}
        <div
          className={`text-center p-6 md:py-10 ${theme === "light" ? "bg-slate-200 border-t border-slate-300" : "bg-gray-950 border-t border-gray-800"}`}
        >
          <Link href={`/landing-builder/${config.tokenId}`} passHref>
            <Button
              className={`mr-2 mb-2 md:mb-0 ${theme === "light" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-purple-600 hover:bg-purple-700"} text-white`}
            >
              <Edit3 className="mr-2 h-4 w-4" /> Edit This Page
            </Button>
          </Link>
          <Button
            onClick={() => {
              localStorage.removeItem(`landingPageConfig-${tokenId}`)
              setCustomPageConfig(null)
              setAiLayoutError(null)
              router.refresh() // Reload to show standard view
              toast({ title: "Page Reset", description: "Custom page design cleared. Showing standard view." })
            }}
            variant="outline"
            className={`${theme === "light" ? "border-slate-400 text-slate-700 hover:bg-slate-300" : "border-gray-600 text-gray-300 hover:bg-gray-700"}`}
          >
            Reset to Standard View
          </Button>
        </div>
        <style jsx global>{`
          body { background-color: ${bodyBgColor}; ${globalFontFamily ? `font-family: ${globalFontFamily};` : ""} }
          /* You might want to import Orbitron, Rajdhani, Comic Neue in your app/layout.tsx or globals.css */
          .font-comic { font-family: 'Comic Neue', 'Comic Sans MS', cursive; }
          .font-orbitron { font-family: 'Orbitron', sans-serif; }
          .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
        `}</style>
      </main>
    )
  }

  // --- Standard Token Page View (Fallback) ---
  if (!tokenData)
    return (
      <main className="flex-1 flex items-center justify-center text-center text-white bg-black">
        <div>
          <h1 className="text-2xl font-bold mb-4">Token Not Found</h1>
          <p className="text-gray-400 mb-6">
            The token ID <code className="bg-zinc-800 p-1 rounded">{tokenId}</code> doesn't match any known token.
          </p>
          <Link href="/explore" passHref>
            <Button className="bg-purple-600 hover:bg-purple-700">Back to Explore</Button>
          </Link>
        </div>
      </main>
    )

  const token = tokenData
  const standardViewLogo = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(token.symbol || "TKN")}&backgroundColor=1e293b&textColor=ffffff&fontSize=40&radius=10`
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=Check%20out%20${token.name}%20(${token.symbol})%20on%20SynthFi!&url=${encodeURIComponent(pageUrl)}`

  return (
    <main className="flex-1 py-8 text-white bg-black">
      <div className="max-w-screen-xl mx-auto px-4">
        {isSimulatedToken && (
          <Alert className="mb-6 bg-purple-900/20 border-purple-600/50 text-purple-200">
            <AlertDescription className="text-purple-100">
              <strong>This token is a simulation.</strong>
            </AlertDescription>
          </Alert>
        )}
        <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={standardViewLogo || DEFAULT_LOGO_FALLBACK}
              alt={`${token.name} Logo`}
              className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover bg-[#1e293b] border border-zinc-700 p-1"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{token.name}</h1>
                <span className="text-gray-400 text-xl md:text-2xl">{token.symbol}</span>
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
            </div>
            <div className="mt-4 md:mt-0 space-y-2 w-full md:w-auto">
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => window.open(`https://jup.ag/swap/SOL-${token.symbol}`, "_blank")}
                disabled={isSimulatedToken}
              >
                {isSimulatedToken ? "Deploy First" : "Swap on Jupiter"}
              </Button>
              <WatchlistButton tokenId={token.id} tokenName={token.name} />
              <Link href={`/landing-builder/${tokenId}`} passHref className="block">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Create/Edit Custom Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PriceHistoryChart tokenSymbol={token.symbol} currentPrice={token.price} />
            <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6">
              <h2 className="text-xl font-semibold mb-4">About {token.name}</h2>
              <p className="text-gray-300 mb-4">{token.description}</p>
              {token.prompt && (
                <div className="mt-6 pt-6 border-t border-zinc-800 flex flex-wrap gap-2">
                  <Button
                    onClick={() => router.push(`/?remix=${encodeURIComponent(token.prompt)}`)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Remix This
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(pageUrl)
                      toast({ title: "Link Copied!" })
                    }}
                    className="border-zinc-700"
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button variant="outline" asChild className="border-zinc-700">
                    <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
                      <LucideTwitterIcon className="mr-2 h-4 w-4" />
                      Share on X
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Swap (Standard View)</h2>
              <p className="text-gray-400 text-sm">Swap functionality for standard view would be here.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function TokenDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-white bg-black">Loading Token Page...</div>
      }
    >
      <TokenDetailPageContent />
    </Suspense>
  )
}
