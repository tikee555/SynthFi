import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-16 text-center">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex justify-center mb-6">
          <div className="text-purple-500 font-bold text-4xl flex items-center">
            <img src="/images/synthfi-logo.png" alt="SynthFi" className="h-12" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Onchain Apps with Natural Language. Cross Chain</h1>
        <p className="text-gray-400 mb-8">Now supporting Solana and Base.</p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">
            Start Building
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Button>

          <Button variant="outline" className="border-zinc-700 text-gray-300 hover:bg-zinc-900 px-6">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 text-purple-500"
            >
              <path d="M15 14l5-5-5-5" />
              <path d="M4 20v-7a4 4 0 014-4h12" />
            </svg>
            Launchpad
          </Button>

          <a href="https://synthfi.gitbook.io/synthfi" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-zinc-700 text-gray-300 hover:bg-zinc-900 px-6">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Read Documentation
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
