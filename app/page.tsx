"use client"

// Header import is commented out, as it was in the previous state,
// implying it's handled by layout.tsx for this specific page.
// import SynthFiHeader from "@/components/synthfi-header";
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CreateAppSection } from "@/components/create-app-section"
import { FeaturedProjectsSection } from "@/components/featured-projects-section"
import { ContractAddressSection } from "@/components/contract-address-section"
// Footer import is commented out, as it was in the previous state.
// import { SynthFiFooter } from "@/components/synthfi-footer";
import { ActivityFeed } from "@/components/activity-feed"
import { RecentBuildsSection } from "@/components/recent-builds-section"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const [promptToRemix, setPromptToRemix] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const remixPromptFromUrl = searchParams.get("remix")
    if (remixPromptFromUrl) {
      setPromptToRemix(decodeURIComponent(remixPromptFromUrl))
      const createAppSectionElement = document.getElementById("create-app-section")
      if (createAppSectionElement) {
        createAppSectionElement.scrollIntoView({ behavior: "smooth" })
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }, [searchParams])

  const handleRemixPrompt = (promptContent: string) => {
    setPromptToRemix(promptContent)
    const createAppSectionElement = document.getElementById("create-app-section")
    if (createAppSectionElement) {
      createAppSectionElement.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleRemixApplied = () => {
    setPromptToRemix(null)
  }

  return (
    <div className="flex-1 flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <div id="create-app-section">
        <CreateAppSection remixPrompt={promptToRemix} onRemixApplied={handleRemixApplied} />
      </div>
      <RecentBuildsSection onRemix={handleRemixPrompt} />
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FeaturedProjectsSection />
            </div>
            <div>
              <ActivityFeed />
            </div>
          </div>
        </div>
      </section>
      <ContractAddressSection />
    </div>
  )
}
