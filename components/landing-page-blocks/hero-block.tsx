"use client"

import type React from "react"
import type { HeroSectionData, BackgroundStyleType } from "@/types/custom-landing-page"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroBlockProps {
  data: HeroSectionData
  theme: BackgroundStyleType // Overall page theme
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ data, theme }) => {
  const { title, subtitle, logoUrl, ctaButton, animation, themeOverride } = data
  const currentTheme = themeOverride || theme

  let heroClasses =
    "relative text-center py-20 md:py-32 px-4 overflow-hidden min-h-[60vh] flex flex-col justify-center items-center"
  let titleClasses = "text-4xl md:text-6xl font-bold mb-6"
  let subtitleClasses = "text-lg md:text-xl max-w-2xl mx-auto mb-8"
  let animationDiv = null
  const animationStyles: React.CSSProperties = {}

  // Apply theme-specific styles
  if (currentTheme === "light") {
    heroClasses += " bg-slate-100 text-slate-900"
    titleClasses += " text-slate-900"
    subtitleClasses += " text-slate-700"
  } else if (currentTheme === "cyberpunk" || currentTheme === "neon") {
    heroClasses += " bg-black text-white" // Base for cyberpunk/neon
    if (currentTheme === "cyberpunk") {
      titleClasses += " text-pink-400 [text-shadow:_0_0_10px_rgb(236_72_153_/_50%)]"
      animationStyles.background = "linear-gradient(45deg, #2c003e, #1e002a, #ff00c1, #00c2ff, #1e002a, #2c003e)"
      animationStyles.backgroundSize = "400% 400%"
      animationStyles.animation = "synthwaveGradientAnim 15s ease infinite"
    }
    if (currentTheme === "neon") {
      titleClasses += " text-green-400 [text-shadow:_0_0_10px_rgb(74_222_128_/_50%)]"
    }
  } else {
    // dark, gradient1, gradient2, image (default to dark text on light bg if image is light)
    heroClasses += " bg-gray-900 text-white"
    titleClasses += " text-white"
    subtitleClasses += " text-gray-300"
  }

  if (data.backgroundImageUrl) {
    animationStyles.backgroundImage = `url(${data.backgroundImageUrl})`
    animationStyles.backgroundSize = "cover"
    animationStyles.backgroundPosition = "center"
  }

  if (animation === "pulse") {
    let pulseColor = "rgba(124, 58, 237, 0.2)" // Default purple
    if (currentTheme === "cyberpunk") pulseColor = "rgba(236, 72, 153, 0.3)" // Pink
    if (currentTheme === "neon") pulseColor = "rgba(74, 222, 128, 0.3)" // Green

    animationDiv = (
      <div
        className="absolute inset-0 animate-pulse-slow"
        style={{
          background: `radial-gradient(circle, ${pulseColor} 0%, transparent 70%)`,
        }}
      />
    )
  }

  return (
    <section className={heroClasses} style={animationStyles}>
      {animationDiv}
      <div className="relative z-10">
        {logoUrl && (
          <img
            src={logoUrl || "/placeholder.svg"}
            alt={`${title} Logo`}
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 rounded-full shadow-lg bg-black/20 p-2"
          />
        )}
        <h1 className={titleClasses}>{title}</h1>
        <p className={subtitleClasses}>{subtitle}</p>
        {ctaButton && ctaButton.text && ctaButton.link && (
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link href={ctaButton.link}>{ctaButton.text}</Link>
          </Button>
        )}
      </div>
      <style jsx global>{`
        @keyframes synthwaveGradientAnim { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-pulse-slow { animation: pulse-slow-anim 5s infinite ease-in-out; }
        @keyframes pulse-slow-anim { 0%, 100% { opacity: 0.7; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1.02); } }
      `}</style>
    </section>
  )
}
