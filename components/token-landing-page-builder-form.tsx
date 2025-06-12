// Component Version 1.0.2 - Enhanced with Auto Icon Injection
"use client"
import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type {
  CustomLandingPageConfig,
  LandingPageSection,
  HeroSectionData,
  FeatureGridSectionData,
  TextBlockSectionData,
  CallToActionSectionData,
  FooterSectionData,
} from "@/types/custom-landing-page"
import { useToast } from "@/components/ui/use-toast"
import { Bot, Loader2, Sparkles } from "lucide-react"

interface TokenLandingPageBuilderFormProps {
  tokenId: string
  initialTokenName?: string
  initialTokenSymbol?: string
}

const isValidUrl = (urlString: string): boolean => {
  if (!urlString) return false
  try {
    const url = new URL(urlString)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch (_) {
    return false
  }
}

// Enhanced icon mapping for automatic feature icon injection
const getFeatureIcon = (title: string, description: string): string => {
  const text = `${title} ${description}`.toLowerCase()

  // Primary keyword matches
  if (text.includes("ai") || text.includes("artificial") || text.includes("engine")) return "Cpu"
  if (text.includes("transparent") || text.includes("visibility") || text.includes("open")) return "Eye"
  if (text.includes("vault") || text.includes("lock") || text.includes("secure") || text.includes("safety"))
    return "Lock"
  if (
    text.includes("multichain") ||
    text.includes("cross-chain") ||
    text.includes("global") ||
    text.includes("worldwide")
  )
    return "Globe"
  if (text.includes("strategy") || text.includes("config") || text.includes("setting") || text.includes("custom"))
    return "SlidersHorizontal"
  if (text.includes("rebalance") || text.includes("auto") || text.includes("refresh") || text.includes("update"))
    return "RefreshCw"
  if (text.includes("predict") || text.includes("forecast") || text.includes("brain") || text.includes("smart"))
    return "BrainCircuit"
  if (text.includes("security") || text.includes("audit") || text.includes("protect") || text.includes("shield"))
    return "ShieldCheck"

  // Secondary keyword matches
  if (text.includes("decentral") || text.includes("distributed") || text.includes("network")) return "Network"
  if (text.includes("scale") || text.includes("performance") || text.includes("speed") || text.includes("fast"))
    return "Zap"
  if (text.includes("community") || text.includes("social") || text.includes("people") || text.includes("user"))
    return "Users"
  if (text.includes("token") || text.includes("coin") || text.includes("currency") || text.includes("money"))
    return "Coins"
  if (text.includes("stake") || text.includes("yield") || text.includes("earn") || text.includes("reward"))
    return "TrendingUp"
  if (text.includes("govern") || text.includes("vote") || text.includes("dao") || text.includes("decision"))
    return "Vote"
  if (text.includes("liquid") || text.includes("pool") || text.includes("swap") || text.includes("trade"))
    return "Waves"
  if (text.includes("analytic") || text.includes("data") || text.includes("chart") || text.includes("metric"))
    return "BarChart3"
  if (text.includes("mobile") || text.includes("app") || text.includes("phone") || text.includes("device"))
    return "Smartphone"
  if (
    text.includes("innovate") ||
    text.includes("future") ||
    text.includes("next-gen") ||
    text.includes("cutting-edge")
  )
    return "Rocket"

  // Fallback to default icon
  return "Sparkles"
}

export function TokenLandingPageBuilderForm({
  tokenId,
  initialTokenName = "My Token",
  initialTokenSymbol = "TKN",
}: TokenLandingPageBuilderFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [aiPrompt, setAiPrompt] = useState("")
  const [isSimulatingAI, setIsSimulatingAI] = useState(false)
  const [aiGeneratedPageConfig, setAiGeneratedPageConfig] = useState<CustomLandingPageConfig | null>(null)

  useEffect(() => {
    const savedDataString = localStorage.getItem(`landingPageConfig-${tokenId}`)
    if (savedDataString) {
      try {
        const savedData: CustomLandingPageConfig = JSON.parse(savedDataString)
        setAiPrompt(savedData.aiPrompt || "")
      } catch (error) {
        console.error("Failed to parse saved landing page data:", error)
      }
    }
  }, [tokenId])

  const simulateAICreativeGeneration = () => {
    if (!aiPrompt.trim()) {
      toast({ title: "AI Assistant", description: "Please enter a prompt for AI design.", variant: "default" })
      return
    }
    setIsSimulatingAI(true)
    setAiGeneratedPageConfig(null)
    toast({
      title: "🤖 AI Design Engine Initialized",
      description: "Parsing prompt and generating structured page layout...",
      duration: 4000,
    })

    setTimeout(() => {
      const currentPrompt = aiPrompt
      const lowerCasePrompt = currentPrompt.toLowerCase()
      const tokenSym = initialTokenSymbol.toUpperCase()

      let inferredProjectName = initialTokenName
      const projectSymbolMatch = currentPrompt.match(/\$([A-Z0-9_]+)/)
      if (projectSymbolMatch && projectSymbolMatch[1]) {
        inferredProjectName = projectSymbolMatch[1]
      } else {
        const forTokenMatch = currentPrompt.match(/for\s+([A-Za-z0-9_]+)\b/i)
        if (forTokenMatch && forTokenMatch[1]) {
          inferredProjectName = forTokenMatch[1]
        }
      }

      const newAIConfig: CustomLandingPageConfig = {
        tokenId,
        projectTitle: inferredProjectName,
        shortDescription: `An innovative project: ${inferredProjectName}`,
        logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(tokenSym)}&backgroundColor=7c3aed&textColor=ffffff&fontSize=40&radius=10`,
        aiGeneratedLogoUrl: "",
        socialLinks: { twitter: "", telegram: "", website: "" },
        backgroundStyle: "dark",
        layoutPreset: "ai-generated",
        customSections: [],
        aiPrompt: currentPrompt,
        tokenSymbol: tokenSym,
      }

      // --- Global Theme & Logo Inference ---
      if (lowerCasePrompt.includes("retro synthwave")) newAIConfig.backgroundStyle = "cyberpunk"
      else if (lowerCasePrompt.includes("comic")) newAIConfig.backgroundStyle = "comic"
      else if (lowerCasePrompt.includes("neon")) newAIConfig.backgroundStyle = "neon"
      else if (lowerCasePrompt.includes("light")) newAIConfig.backgroundStyle = "light"

      if (lowerCasePrompt.includes("frog logo")) {
        newAIConfig.logoUrl = `/placeholder.svg?width=120&height=120&query=pixel+art+frog+logo+transparent`
      } else if (lowerCasePrompt.includes("brain logo")) {
        newAIConfig.logoUrl = `/placeholder.svg?width=120&height=120&query=stylized+glowing+brain+logo`
      }
      newAIConfig.aiGeneratedLogoUrl = newAIConfig.logoUrl

      // --- Social Links Inference ---
      const twitterMatch = currentPrompt.match(/(?:twitter|x)\s*[:@\s]*([\w.-]+)/i)
      if (twitterMatch?.[1]) newAIConfig.socialLinks.twitter = `https://x.com/${twitterMatch[1].replace("@", "")}`
      const telegramMatch = currentPrompt.match(/telegram\s*[:@\s]*([\w.-]+)/i)
      if (telegramMatch?.[1]) newAIConfig.socialLinks.telegram = `https://t.me/${telegramMatch[1].replace("@", "")}`
      const websiteMatch = currentPrompt.match(/website\s*[:\s]*([\w/:.-]+)/i)
      if (websiteMatch?.[1]) {
        let webUrl = websiteMatch[1]
        if (!webUrl.startsWith("http")) webUrl = `https://${webUrl}`
        if (isValidUrl(webUrl)) newAIConfig.socialLinks.website = webUrl
      }

      // --- Section Parsing and Data Generation ---
      const sections: LandingPageSection[] = []
      let sectionIdCounter = 0

      // Helper to extract content for a section
      const getSectionContent = (startKeyword: string, endKeywords: string[]): string => {
        const startIndex = lowerCasePrompt.indexOf(startKeyword)
        if (startIndex === -1) return ""
        let endIndex = currentPrompt.length
        for (const endKeyword of endKeywords) {
          const tempEndIndex = lowerCasePrompt.indexOf(endKeyword, startIndex + startKeyword.length)
          if (tempEndIndex !== -1) {
            endIndex = Math.min(endIndex, tempEndIndex)
          }
        }
        return currentPrompt
          .substring(startIndex + startKeyword.length, endIndex)
          .trim()
          .replace(/^[:\s]+/, "")
      }

      const allOtherSectionKeywords = ["feature", "tech", "about", "cta", "footer"]

      // HERO SECTION
      if (lowerCasePrompt.includes("hero")) {
        const heroData: HeroSectionData = {
          title: newAIConfig.projectTitle,
          subtitle: newAIConfig.shortDescription,
          logoUrl: newAIConfig.logoUrl,
          animation: "none",
        }
        if (lowerCasePrompt.includes("animated") || lowerCasePrompt.includes("pulse")) heroData.animation = "pulse"
        if (lowerCasePrompt.includes("gradient hero") && newAIConfig.backgroundStyle === "neon")
          heroData.animation = "gradientShift" // Example for neon gradient

        const heroContent = getSectionContent(
          "hero",
          allOtherSectionKeywords.filter((k) => k !== "hero"),
        )
        if (heroContent) {
          // Try to parse title/subtitle from prompt if available
          const titleMatch = heroContent.match(/(?:title|headline)\s*[:"']?\s*([^"'\n]+)/i)
          if (titleMatch && titleMatch[1]) heroData.title = titleMatch[1].trim()

          const subtitleMatch = heroContent.match(/(?:subtitle|tagline)\s*[:"']?\s*([^"'\n]+)/i)
          if (subtitleMatch && subtitleMatch[1]) heroData.subtitle = subtitleMatch[1].trim()
        }

        sections.push({ id: `section-${sectionIdCounter++}`, type: "hero", data: heroData })
      }

      // FEATURES SECTION - Enhanced with automatic icon injection
      if (lowerCasePrompt.includes("feature")) {
        const featureData: FeatureGridSectionData = {
          title: "Key Features",
          features: [],
          columns: 3,
        }

        // Enhanced feature generation with automatic icon assignment
        const defaultFeatures = [
          {
            title: "AI Engine",
            description: "Advanced artificial intelligence powering smart decisions and automated strategies.",
          },
          {
            title: "Transparency",
            description: "Full visibility into all operations with open-source smart contracts and real-time data.",
          },
          {
            title: "Security Vault",
            description: "Multi-layered security protocols protecting your assets with audited smart contracts.",
          },
          {
            title: "Multichain Support",
            description: "Seamless cross-chain functionality connecting multiple blockchain networks.",
          },
          {
            title: "Custom Strategies",
            description: "Configurable investment strategies tailored to your risk profile and goals.",
          },
          {
            title: "Auto Rebalance",
            description: "Automated portfolio rebalancing to maintain optimal asset allocation.",
          },
        ]

        // Generate features with automatic icon assignment
        featureData.features = defaultFeatures.slice(0, 3).map((feature) => ({
          ...feature,
          iconName: getFeatureIcon(feature.title, feature.description),
        }))

        // Adjust columns based on prompt
        if (lowerCasePrompt.includes("2-column") || lowerCasePrompt.includes("two column")) {
          featureData.columns = 2
          featureData.features = defaultFeatures.slice(0, 2).map((feature) => ({
            ...feature,
            iconName: getFeatureIcon(feature.title, feature.description),
          }))
        }
        if (lowerCasePrompt.includes("4-column") || lowerCasePrompt.includes("four column")) {
          featureData.columns = 4
          featureData.features = defaultFeatures.slice(0, 4).map((feature) => ({
            ...feature,
            iconName: getFeatureIcon(feature.title, feature.description),
          }))
        }
        if (lowerCasePrompt.includes("6") || lowerCasePrompt.includes("six")) {
          featureData.columns = 3
          featureData.features = defaultFeatures.map((feature) => ({
            ...feature,
            iconName: getFeatureIcon(feature.title, feature.description),
          }))
        }

        sections.push({ id: `section-${sectionIdCounter++}`, type: "featureGrid", data: featureData })
      }

      // TECHNOLOGY / ABOUT SECTION (as TextBlock)
      const techKeywords = ["technology", "tech stack", "about section", "what is"]
      for (const keyword of techKeywords) {
        if (lowerCasePrompt.includes(keyword)) {
          const content = getSectionContent(
            keyword,
            allOtherSectionKeywords.filter((k) => !techKeywords.includes(k) && k !== keyword),
          )
          const textBlockData: TextBlockSectionData = {
            title:
              keyword.split(" ")[0].charAt(0).toUpperCase() +
              keyword.split(" ")[0].slice(1) +
              (keyword.includes("stack") ? " Stack" : ""),
            content:
              content ||
              `Detailed information about the ${newAIConfig.projectTitle}'s ${keyword} will be presented here. We leverage cutting-edge solutions to deliver a robust and efficient platform.`,
            alignment: "left",
          }
          if (lowerCasePrompt.includes("center align")) textBlockData.alignment = "center"
          sections.push({ id: `section-${sectionIdCounter++}`, type: "textBlock", data: textBlockData })
          break // Add only one text block for these related keywords
        }
      }

      // CALL TO ACTION (CTA) SECTION
      if (lowerCasePrompt.includes("cta") || lowerCasePrompt.includes("call to action")) {
        const ctaData: CallToActionSectionData = {
          title: `Join ${newAIConfig.projectTitle} Today!`,
          description: "Be part of our growing community and explore the future.",
          buttonText: "Get Started",
          buttonLink: newAIConfig.socialLinks.website || "#explore",
        }
        sections.push({ id: `section-${sectionIdCounter++}`, type: "cta", data: ctaData })
      }

      // FOOTER SECTION
      if (lowerCasePrompt.includes("footer")) {
        const footerData: FooterSectionData = {
          text: `© ${new Date().getFullYear()} ${newAIConfig.projectTitle}. All rights reserved.`,
          socialLinks: newAIConfig.socialLinks,
        }
        sections.push({ id: `section-${sectionIdCounter++}`, type: "footer", data: footerData })
      }

      // Ensure at least a hero and footer if no sections were parsed but prompt was given
      if (sections.length === 0 && currentPrompt.trim() !== "") {
        sections.push({
          id: `section-${sectionIdCounter++}`,
          type: "hero",
          data: {
            title: newAIConfig.projectTitle,
            subtitle: "Welcome to our project!",
            logoUrl: newAIConfig.logoUrl,
            animation: "none",
          },
        })
        sections.push({
          id: `section-${sectionIdCounter++}`,
          type: "footer",
          data: {
            text: `© ${new Date().getFullYear()} ${newAIConfig.projectTitle}`,
            socialLinks: newAIConfig.socialLinks,
          },
        })
      }

      newAIConfig.customSections = sections

      if (newAIConfig.customSections.length === 0) {
        const fallbackData: TextBlockSectionData = {
          title: "AI Generation Issue",
          content:
            "The AI could not generate a structured layout from the prompt. Please try a more descriptive prompt, clearly mentioning sections like 'hero', 'features', 'technology', 'CTA', and 'footer'.",
          alignment: "center",
        }
        newAIConfig.customSections.push({
          id: `ai_fallback_${Date.now()}`,
          type: "textBlock",
          data: fallbackData,
        })
      }

      setAiGeneratedPageConfig(newAIConfig)
      setIsSimulatingAI(false)
      toast({
        title: "✅ AI Page Design Generated!",
        description: `A new page layout with ${newAIConfig.customSections.length} structured sections has been created with auto-injected icons.`,
        duration: 8000,
      })
    }, 2500)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!aiGeneratedPageConfig) {
      toast({
        title: "No AI Page Generated",
        description: "Please generate a page design using the AI prompt first.",
        variant: "default",
      })
      return
    }
    try {
      localStorage.setItem(`landingPageConfig-${tokenId}`, JSON.stringify(aiGeneratedPageConfig))
      toast({ title: "💾 AI Landing Page Saved!", description: "Your AI-generated configuration has been saved." })
      router.push(`/token/${tokenId}`)
    } catch (error) {
      console.error("Failed to save landing page data:", error)
      toast({ title: "Error Saving", description: "Could not save data.", variant: "destructive" })
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#0f172a] border-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-400 flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-yellow-400" /> SynthFi AI Page Composer
        </CardTitle>
        <CardDescription className="text-gray-400">
          Describe your dream token landing page. The AI will generate structured visual blocks with auto-injected
          icons.
          <br />
          (Token: {initialTokenSymbol} - ID: {tokenId})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3 p-4 border border-purple-700 rounded-lg bg-purple-900/20">
            <Label htmlFor="aiPrompt" className="text-lg font-semibold text-purple-300 flex items-center">
              <Bot className="mr-2 h-5 w-5" /> AI Page Prompt
            </Label>
            <Textarea
              id="aiPrompt"
              value={aiPrompt}
              onChange={(e) => {
                setAiPrompt(e.target.value)
                if (aiGeneratedPageConfig) setAiGeneratedPageConfig(null)
              }}
              placeholder="e.g., Design a landing page for NEURON in retro synthwave style with an animated hero. Add a 3-column feature grid with icons, a technology section, a CTA, and a footer with social links (Twitter @SynthFi)."
              className="bg-zinc-800 border-zinc-700 text-white min-h-[180px] focus:ring-purple-500 focus:border-purple-500"
            />
            <Button
              type="button"
              onClick={simulateAICreativeGeneration}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-md py-2.5 px-6 shadow-lg hover:shadow-xl"
              disabled={isSimulatingAI}
            >
              {isSimulatingAI ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> AI Generating Structured Layout...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Page with AI
                </>
              )}
            </Button>
            {aiGeneratedPageConfig && aiGeneratedPageConfig.customSections.length > 0 && (
              <div className="p-3 mt-2 text-sm bg-green-900/30 border border-green-700 rounded-md text-green-300">
                AI has generated a new page configuration with {aiGeneratedPageConfig.customSections.length} sections
                and auto-injected feature icons. Click "Save and View Token Page" below to apply it.
              </div>
            )}
            <p className="text-xs text-purple-300/70 mt-1">
              Tip: Clearly mention sections (hero, features, tech, CTA, footer) and desired styles. Icons are
              automatically injected based on feature content.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
            disabled={!aiGeneratedPageConfig || aiGeneratedPageConfig.customSections.length === 0 || isSimulatingAI}
          >
            Save and View Token Page
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
