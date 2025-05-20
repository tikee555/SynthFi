import Link from "next/link"
import { Twitter, Github } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 px-4 md:px-8 bg-black border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">SynthFi</h3>
            <p className="text-gray-400">Prompt-to-Protocol in Seconds. Deployed on Solana.</p>
            <p className="text-gray-500 mt-4">© {currentYear} SynthFi. All rights reserved.</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold mb-4 text-white">Connect</h3>
            <div className="flex space-x-6">
              <Link href="https://x.com/SynthFi_Hub" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://github.com/tikee555/SynthFi"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://synthfi.gitbook.io/synthfi"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://dexscreener.com/solana/5ugeszurqxuappq8tsrnutq3dnvhgzf95tggy3q9lwxf"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Dexscreener
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
