import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AiPromptSection } from "@/components/ai-prompt-section"
import { FeaturesSection } from "@/components/features-section"
import { ContractAddressSection } from "@/components/contract-address-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AiPromptSection />
      <ContractAddressSection />
      <Footer />
    </main>
  )
}
