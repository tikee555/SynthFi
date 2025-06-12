// components/synthfi-footer.tsx
// CHANGE: Reverting to NAMED export
export function SynthFiFooter() {
  // Ensuring the export name is SynthFiFooter
  return (
    <footer className="bg-black border-t border-zinc-900 py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-purple-500 font-bold text-xl mb-4">
              <img src="/images/synthfi-logo.png" alt="SynthFi" className="h-8" />
            </div>
            <p className="text-gray-400 text-sm">Create Onchain Apps with Natural Language</p>
            <p className="text-gray-600 text-xs mt-4">© 2024 SynthFi. All rights reserved.</p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-4 text-gray-200">Connect</h3>
              <div className="flex space-x-4">
                <a
                  href="https://x.com/SynthFi_Hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                  aria-label="SynthFi on X"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
                <a
                  href="https://dexscreener.com/solana/5ugeszurqxuappq8tsrnutq3dnvhgzf95tggy3q9lwxf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                  aria-label="SynthFi on Dexscreener"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4 text-gray-200">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://synthfi.gitbook.io/synthfi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://dexscreener.com/solana/5ugeszurqxuappq8tsrnutq3dnvhgzf95tggy3q9lwxf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    Dexscreener
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
