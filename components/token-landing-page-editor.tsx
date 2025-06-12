"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LandingPageConfig, LandingPageSocialLinks, LandingPageTheme } from "@/types/token-landing-page"
import { getTokenImage } from "@/lib/utils" // Assuming this utility exists and can generate/fetch token images
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, PlusCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface TokenLandingPageEditorProps {
  initialConfig?: Partial<LandingPageConfig>
  tokenId: string
  tokenName: string
  tokenSymbol: string
  onSave: (config: LandingPageConfig) => void
}

const availableThemes: { value: LandingPageTheme; label: string }[] = [
  { value: "dark-purple", label: "Dark Purple (Default)" },
  { value: "synthwave", label: "Synthwave" },
  { value: "minimal-dark", label: "Minimal Dark" },
  { value: "light-sky", label: "Light Sky" },
]

export function TokenLandingPageEditor({
  initialConfig,
  tokenId,
  tokenName,
  tokenSymbol,
  onSave,
}: TokenLandingPageEditorProps) {
  const [logoUrl, setLogoUrl] = useState(initialConfig?.logoUrl || "")
  const [tagline, setTagline] = useState(initialConfig?.tagline || `Welcome to ${tokenName}!`)
  const [fullDescription, setFullDescription] = useState(
    initialConfig?.fullDescription || `Learn all about ${tokenName} (${tokenSymbol}), its mission, and utility.`,
  )
  const [roadmap, setRoadmap] = useState(initialConfig?.roadmap || "")
  const [socialLinks, setSocialLinks] = useState<LandingPageSocialLinks>(
    initialConfig?.socialLinks || { twitter: "", discord: "", website: "", telegram: "", github: "" },
  )
  const [teamSection, setTeamSection] = useState(initialConfig?.teamSection || "")
  const [theme, setTheme] = useState<LandingPageTheme>(initialConfig?.theme || "dark-purple")
  const [mediaGalleryUrls, setMediaGalleryUrls] = useState<string[]>(initialConfig?.mediaGalleryUrls || [""])

  const autoLogo = getTokenImage(tokenSymbol.substring(0, 3).toUpperCase(), tokenSymbol, 100) // Example category

  const currentPreviewConfig: LandingPageConfig = {
    tokenId,
    tokenName,
    tokenSymbol,
    logoUrl: logoUrl || autoLogo,
    tagline,
    fullDescription,
    roadmap,
    socialLinks,
    teamSection,
    theme,
    mediaGalleryUrls: mediaGalleryUrls.filter((url) => url.trim() !== ""),
  }

  const handleSocialLinkChange = (platform: keyof LandingPageSocialLinks, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [platform]: value }))
  }

  const handleMediaGalleryChange = (index: number, value: string) => {
    const newUrls = [...mediaGalleryUrls]
    newUrls[index] = value
    setMediaGalleryUrls(newUrls)
  }

  const addMediaGalleryItem = () => {
    setMediaGalleryUrls([...mediaGalleryUrls, ""])
  }

  const removeMediaGalleryItem = (index: number) => {
    const newUrls = mediaGalleryUrls.filter((_, i) => i !== index)
    setMediaGalleryUrls(newUrls.length > 0 ? newUrls : [""]) // Ensure at least one input
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave(currentPreviewConfig)
  }

  const getThemeStyles = (selectedTheme: LandingPageTheme) => {
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
          background: "#0f001a", // Darker purple
          textColor: "#e0e0e0",
          headingColor: "#c084fc", // Lighter purple for headings
          accentColor: "#a855f7", // Main purple accent
          cardBg: "rgba(20, 0, 40, 0.7)", // Semi-transparent card bg
        }
    }
  }

  const currentThemeStyles = getThemeStyles(theme)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8 max-w-screen-2xl mx-auto">
      {/* Editor Form */}
      <Card className="bg-[#0A0A0A] border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-400">Customize Your Token Page</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="theme" className="text-gray-300">
                Theme
              </Label>
              <Select value={theme} onValueChange={(value) => setTheme(value as LandingPageTheme)}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                  {availableThemes.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="hover:bg-zinc-700">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="logoUrl" className="text-gray-300">
                Logo URL (Optional - uses auto-generated if blank)
              </Label>
              <Input
                id="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="tagline" className="text-gray-300">
                Tagline
              </Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="fullDescription" className="text-gray-300">
                Full Description (Markdown supported)
              </Label>
              <Textarea
                id="fullDescription"
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                rows={6}
                placeholder="Describe your token, its utility, vision, etc."
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="roadmap" className="text-gray-300">
                Roadmap (Markdown supported)
              </Label>
              <Textarea
                id="roadmap"
                value={roadmap}
                onChange={(e) => setRoadmap(e.target.value)}
                rows={4}
                placeholder="Q1: Launch, Q2: New Features..."
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Social Links</Label>
              {(Object.keys(socialLinks) as Array<keyof LandingPageSocialLinks>).map((platform) => (
                <Input
                  key={platform}
                  value={socialLinks[platform]}
                  onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                  placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              ))}
            </div>

            <div>
              <Label htmlFor="teamSection" className="text-gray-300">
                Team Section (Markdown supported)
              </Label>
              <Textarea
                id="teamSection"
                value={teamSection}
                onChange={(e) => setTeamSection(e.target.value)}
                rows={3}
                placeholder="Introduce your team (optional)"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">Media Gallery (Image URLs)</Label>
              {mediaGalleryUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => handleMediaGalleryChange(index, e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="bg-zinc-800 border-zinc-700 text-white flex-grow"
                  />
                  {mediaGalleryUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMediaGalleryItem(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMediaGalleryItem}
                className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-black"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Image URL
              </Button>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Save Landing Page
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <div className="rounded-lg border border-zinc-700 overflow-hidden">
        <div className="p-2 bg-zinc-800 text-sm text-center text-gray-400">Live Preview</div>
        <div
          className="p-6 md:p-10 min-h-[600px] transition-all duration-500"
          style={{
            background: currentThemeStyles.background,
            color: currentThemeStyles.textColor,
          }}
        >
          <header className="text-center mb-12">
            <img
              src={currentPreviewConfig.logoUrl || "/placeholder.svg"}
              alt={`${currentPreviewConfig.tokenName} Logo`}
              className="w-24 h-24 mx-auto mb-4 rounded-full object-cover bg-gray-700"
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: currentThemeStyles.headingColor }}>
              {currentPreviewConfig.tokenName} ({currentPreviewConfig.tokenSymbol})
            </h1>
            <p className="text-xl md:text-2xl" style={{ color: currentThemeStyles.accentColor }}>
              {currentPreviewConfig.tagline}
            </p>
          </header>

          <section className="mb-12 p-6 rounded-lg" style={{ backgroundColor: currentThemeStyles.cardBg }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: currentThemeStyles.headingColor }}>
              About {currentPreviewConfig.tokenName}
            </h2>
            <div className="prose prose-invert max-w-none landing-page-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentPreviewConfig.fullDescription}</ReactMarkdown>
            </div>
          </section>

          {currentPreviewConfig.roadmap && (
            <section className="mb-12 p-6 rounded-lg" style={{ backgroundColor: currentThemeStyles.cardBg }}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: currentThemeStyles.headingColor }}>
                Roadmap
              </h2>
              <div className="prose prose-invert max-w-none landing-page-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentPreviewConfig.roadmap}</ReactMarkdown>
              </div>
            </section>
          )}

          {currentPreviewConfig.mediaGalleryUrls && currentPreviewConfig.mediaGalleryUrls.length > 0 && (
            <section className="mb-12 p-6 rounded-lg" style={{ backgroundColor: currentThemeStyles.cardBg }}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: currentThemeStyles.headingColor }}>
                Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentPreviewConfig.mediaGalleryUrls.map(
                  (url, idx) =>
                    url && (
                      <img
                        key={idx}
                        src={url || "/placeholder.svg"}
                        alt={`Gallery image ${idx + 1}`}
                        className="rounded-lg object-cover aspect-video"
                      />
                    ),
                )}
              </div>
            </section>
          )}

          {currentPreviewConfig.teamSection && (
            <section className="mb-12 p-6 rounded-lg" style={{ backgroundColor: currentThemeStyles.cardBg }}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: currentThemeStyles.headingColor }}>
                Our Team
              </h2>
              <div className="prose prose-invert max-w-none landing-page-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentPreviewConfig.teamSection}</ReactMarkdown>
              </div>
            </section>
          )}

          <footer className="text-center pt-8 border-t" style={{ borderColor: currentThemeStyles.accentColor + "50" }}>
            <p className="mb-4">Connect with us:</p>
            <div className="flex justify-center space-x-4">
              {Object.entries(currentPreviewConfig.socialLinks || {}).map(([platform, url]) =>
                url ? (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-75"
                    style={{ color: currentThemeStyles.accentColor }}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                ) : null,
              )}
            </div>
            <p className="mt-8 text-sm opacity-70">Powered by SynthFi</p>
          </footer>
        </div>
      </div>
      <style jsx global>{`
        .landing-page-markdown h1, .landing-page-markdown h2, .landing-page-markdown h3 { color: ${currentThemeStyles.headingColor}; }
        .landing-page-markdown p, .landing-page-markdown li, .landing-page-markdown blockquote { color: ${currentThemeStyles.textColor}; }
        .landing-page-markdown a { color: ${currentThemeStyles.accentColor}; }
        .landing-page-markdown strong { color: ${currentThemeStyles.headingColor}; }
        .landing-page-markdown code { background-color: ${currentThemeStyles.cardBg}; padding: 0.2em 0.4em; border-radius: 3px;}
        .landing-page-markdown pre code { background-color: transparent; padding: 0;}
        .landing-page-markdown pre { background-color: ${currentThemeStyles.cardBg}; padding: 1em; border-radius: 5px;}
      `}</style>
    </div>
  )
}
