import { ExternalLink } from "lucide-react"
import Link from "next/link"

export function ContractAddressSection() {
  return (
    <section className="py-16 px-4 md:px-8 bg-black border-t border-gray-800">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6 text-white">Contract Address</h2>
        <Link
          href="https://explorer.solana.com/address/D9mendaps8MaMHtLz2w8Duum3FfamPh2yWX5owKZpump"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 text-lg"
        >
          D9mendaps8MaMHtLz2w8Duum3FfamPh2yWX5owKZpump
          <ExternalLink className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
