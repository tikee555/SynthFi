import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center pt-16">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="mb-8 flex justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Synthfi-1QApORZT7i2i0rPs0B1oGlt3WYqCL4.png"
            alt="SynthFi Logo"
            width={300}
            height={100}
          />
        </div>

        <h1 className="text-2xl md:text-4xl font-medium mb-12 text-white">
          Prompt-to-Protocol in Seconds. Deployed on Solana.
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/app"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Start Building
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <Link
            href="/launchpad"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Launchpad
          </Link>

          <Link
            href="https://synthfi.gitbook.io/synthfi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-gray-700 text-white hover:bg-gray-800/50 transition-colors"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Read Documentation
          </Link>
        </div>
      </div>
    </section>
  )
}
