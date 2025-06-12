"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { LandingPageConfig, LandingPageTheme } from "@/types/token-landing-page"
import SynthFiHeader from "@/components/synthfi-header"
import { SynthFiFooter } from "@/components/synthfi-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getTokenImage } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Edit3, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ViewTokenLandingPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const tokenId = params.id as string

  const [config, setConfig] = useState<LandingPageConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (tokenId) {
      try {
        const savedConfigString = localStorage.getItem(`landingPageConfig-${tokenId}`)
        if (savedConfigString) {
          setConfig(JSON.parse(savedConfigString))
        }
      } catch (e) {
        console.error("Failed to load landing page config:", e)
        toast({ title: "Error", description: "Could not load landing page data.", variant: "destructive" })
      }
      setIsLoading(false)
    }
  }, [tokenId, toast])

  const getThemeStyles = (selectedTheme?: LandingPageTheme) => {
    switch (selectedTheme) {
      case "synthwave":
        return {
          background: "linear-gradient(to bottom right, #2a004f, #000c2e)",
          textColor: "#e0e0e0",
          headingColor: "#ff00ff",
          accentColor: "#00ffff",
          cardBg: "rgba(20, 0, 40, 0.8)",
        }
      case "minimal-dark":
        return {
          background: "#121212",
          textColor: "#cccccc",
          headingColor: "#ffffff",
          accentColor: "#bb86fc",
          cardBg: "#1e1e1e",
        }
      case "light-sky":
        return {
          background: "linear-gradient(to bottom, #e0f2fe, #bae6fd)",
          textColor: "#0f172a",
          headingColor: "#0369a1",
          accentColor: "#0ea5e9",
          cardBg: "rgba(255, 255, 255, 0.8)",
        }
      case "dark-purple":
      default:
        return {
          background: "#0f001a",
          textColor: "#e0e0e0",
          headingColor: "#c084fc",
          accentColor: "#a855f7",
          cardBg: "rgba(20, 0, 40, 0.7)",
        }
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({ title: "Link Copied!", description: "Landing page URL copied to clipboard." })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <SynthFiHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading landing page...</p>
        </main>
        <SynthFiFooter />
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <SynthFiHeader />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl font-bold mb-4">Landing Page Not Found</h1>
          <p className="text-gray-400 mb-6">A custom landing page has not been created for this token yet.</p>
          <Link href={`/token/${tokenId}/create-page`}>
            <Button className="bg-purple-600 hover:bg-purple-700">Create Landing Page</Button>
          </Link>
        </main>
        <SynthFiFooter />
      </div>
    )
  }

  const currentThemeStyles = getThemeStyles(config.theme)
  const logoDisplayUrl =
    config.logoUrl || getTokenImage(config.tokenSymbol.substring(0, 3).toUpperCase(), config.tokenSymbol, 100)

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: currentThemeStyles.background, color: currentThemeStyles.textColor }}
    >
      <SynthFiHeader />
      <main className="flex-1 py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="fixed top-24 right-4 md:right-8 z-50 flex flex-col gap-2">
            <Button
              onClick={() => router.push(`/token/${tokenId}/edit-page`)}
              variant="outline"
              size="sm"
              className="bg-opacity-50 backdrop-blur-sm"
              style={{
                backgroundColor: currentThemeStyles.cardBg,
                color: currentThemeStyles.accentColor,
                borderColor: currentThemeStyles.accentColor,
              }}
            >
              <Edit3 className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="bg-opacity-50 backdrop-blur-sm"
              style={{
                backgroundColor: currentThemeStyles.cardBg,
                color: currentThemeStyles.accentColor,
                borderColor: currentThemeStyles.accentColor,
              }}
            >
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>

          <header className="text-center mb-16">
            <img
              src={logoDisplayUrl || "/placeholder.svg"}
              alt={`${config.tokenName} Logo`}
              className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-6 rounded-full object-cover shadow-lg"
              style={{ border: `3px solid ${currentThemeStyles.accentColor}` }}
            />
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3"
              style={{ color: currentThemeStyles.headingColor }}
            >
              {config.tokenName} ({config.tokenSymbol})
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl" style={{ color: currentThemeStyles.accentColor }}>
              {config.tagline}
            </p>
          </header>

          <section
            className="mb-12 p-6 md:p-8 rounded-xl shadow-xl"
            style={{ backgroundColor: currentThemeStyles.cardBg }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: currentThemeStyles.headingColor }}>
              About {config.tokenName}
            </h2>
            <div className="prose prose-invert max-w-none landing-page-markdown-view">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{config.fullDescription}</ReactMarkdown>
            </div>
          </section>

          {config.roadmap && (
            <section
              className="mb-12 p-6 md:p-8 rounded-xl shadow-xl"
              style={{ backgroundColor: currentThemeStyles.cardBg }}
            >
              <h2
                className="text-2xl md:text-3xl font-semibold mb-4"
                style={{ color: currentThemeStyles.headingColor }}
              >
                Roadmap
              </h2>
              <div className="prose prose-invert max-w-none landing-page-markdown-view">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{config.roadmap}</ReactMarkdown>
              </div>
            </section>
          )}

          {config.mediaGalleryUrls && config.mediaGalleryUrls.filter((url) => url.trim() !== "").length > 0 && (
            <section
              className="mb-12 p-6 md:p-8 rounded-xl shadow-xl"
              style={{ backgroundColor: currentThemeStyles.cardBg }}
            >
              <h2
                className="text-2xl md:text-3xl font-semibold mb-4"
                style={{ color: currentThemeStyles.headingColor }}
              >
                Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {config.mediaGalleryUrls
                  .filter((url) => url.trim() !== "")
                  .map((url, idx) => (
                    <img
                      key={idx}
                      src={url || "/placeholder.svg"}
                      alt={`Gallery image ${idx + 1}`}
                      className="rounded-lg object-cover aspect-video shadow-md"
                    />
                  ))}
              </div>
            </section>
          )}

          {config.teamSection && (
            <section
              className="mb-12 p-6 md:p-8 rounded-xl shadow-xl"
              style={{ backgroundColor: currentThemeStyles.cardBg }}
            >
              <h2
                className="text-2xl md:text-3xl font-semibold mb-4"
                style={{ color: currentThemeStyles.headingColor }}
              >
                Our Team
              </h2>
              <div className="prose prose-invert max-w-none landing-page-markdown-view">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{config.teamSection}</ReactMarkdown>
              </div>
            </section>
          )}

          <footer
            className="text-center pt-10 mt-10 border-t"
            style={{ borderColor: currentThemeStyles.accentColor + "50" }}
          >
            <p className="mb-6 text-lg" style={{ color: currentThemeStyles.headingColor }}>
              Connect with {config.tokenName}:
            </p>
            <div className="flex justify-center items-center space-x-6 mb-8">
              {Object.entries(config.socialLinks || {}).map(([platform, url]) =>
                url ? (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-75 transition-opacity text-2xl"
                    style={{ color: currentThemeStyles.accentColor }}
                    title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                  >
                    {/* Basic text links, could be icons later */}
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                ) : null,
              )}
            </div>
            <p className="text-sm opacity-70">Powered by SynthFi</p>
          </footer>
        </div>
      </main>
      <SynthFiFooter />
      <style jsx global>{`
        .landing-page-markdown-view h1, .landing-page-markdown-view h2, .landing-page-markdown-view h3 { color: ${currentThemeStyles.headingColor}; }
        .landing-page-markdown-view p, .landing-page-markdown-view li, .landing-page-markdown-view blockquote { color: ${currentThemeStyles.textColor}; }
        .landing-page-markdown-view a { color: ${currentThemeStyles.accentColor}; }
        .landing-page-markdown-view strong { color: ${currentThemeStyles.headingColor}; }
        .landing-page-markdown-view code { background-color: ${currentThemeStyles.cardBg === "rgba(255, 255, 255, 0.8)" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}; padding: 0.2em 0.4em; border-radius: 3px;}
        .landing-page-markdown-view pre code { background-color: transparent; padding: 0;}
        .landing-page-markdown-view pre { background-color: ${currentThemeStyles.cardBg === "rgba(255, 255, 255, 0.8)" ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.2)"}; padding: 1em; border-radius: 5px;}
      `}</style>
    </div>
  )
}
