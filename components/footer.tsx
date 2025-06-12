export function Footer() {
  return (
    <footer className="bg-[#0a0d16] border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-purple-500 font-bold text-xl flex items-center">
              <img src="/images/synthfi-logo.png" alt="SynthFi" className="h-6 mr-2" />
              SynthFi
            </div>
            <p className="text-gray-400 text-sm mt-2">Create Onchain Apps with Natural Language</p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
            <a
              href="https://synthfi.gitbook.io/synthfi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              Documentation
            </a>
            <a
              href="https://x.com/SynthFi_Hub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              X / Twitter
            </a>
            <a
              href="https://dexscreener.com/solana/5ugeszurqxuappq8tsrnutq3dnvhgzf95tggy3q9lwxf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              Dexscreener
            </a>
            <a
              href="https://synthfi.gitbook.io/synthfi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              GitBook
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} SynthFi. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
