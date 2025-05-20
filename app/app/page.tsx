import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AiPromptSection } from "@/components/ai-prompt-section"

export default function AppPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="max-w-6xl mx-auto py-12 px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">SynthFi App Builder</h1>
        <p className="text-gray-400 text-center mb-12">Create Solana programs with natural language</p>

        <AiPromptSection />

        <div className="mt-12 flex justify-center">
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/launchpad">Go to Launchpad</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
