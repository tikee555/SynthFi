"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"

// Define the project type
interface Project {
  name: string
  type: string
  chain: "Solana" | "Base"
  description: string
  launchDate: string
  link: string
}

// Sample project data
const FEATURED_PROJECTS: Project[] = [
  {
    name: "Stake Pool",
    type: "Staking",
    chain: "Solana",
    description: "Staking protocol with 8% APR and no early withdrawal",
    launchDate: "January 2024",
    link: "/token/stake-pool"
  },
  {
    name: "DEX Token",
    type: "DEX",
    chain: "Solana",
    description: "Governance token for decentralized exchange on Solana",
    launchDate: "November 2023",
    link: "/token/dex-token"
  },
  {
    name: "NFT Marketplace",
    type: "NFT",
    chain: "Solana",
    description: "Token for NFT marketplace with reduced fees for holders",
    launchDate: "January 2024",
    link: "/token/nft-marketplace"
  },
  {
    name: "Governance DAO",
    type: "DAO",
    chain: "Solana",
    description: "Governance token for Solana-based DAO with voting mechanisms",
    launchDate: "February 2024",
    link: "/token/governance-dao"
  }
]

export function FeaturedProjectsSection() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  return (
    <section className="py-16 mt-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">🔥 Featured Projects</h2>
            <p className="text-gray-400">Built and deployed with SynthFi</p>
          </div>
          <Button 
            variant="ghost" 
            className="mt-4 md:mt-0 text-purple-500 hover:text-purple-400 hover:bg-purple-900/20"
          >
            View All
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PROJECTS.map((project) => (
            <div 
              key={project.name}
              className="bg-[#0f172a] rounded-lg border border-zinc-800 p-6 transition-all duration-300 hover:border-purple-600/50 hover:shadow-[0_0_15px_rgba(147,51,234,0.15)]"
              onMouseEnter={() => setHoveredProject(project.name)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{project.name}</h3>
                  <Badge className="bg-purple-900/50 text-purple-300 border-purple-700 hover:bg-purple-900/70">
                    {project.type}
                  </Badge>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
                  project.chain === "Solana" 
                    ? "bg-green-900/30 text-green-400" 
                    : "bg-blue-900/30 text-blue-400"
                }`}>
                  {project.chain === "Solana" ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 128 128"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <path
                        d="M64 0C28.7 0 0 28.7 0 64C0 99.3 28.7 128 64 128C99.3 128 128 99.3 128 64C128 28.7 99.3 0 64 0Z"
                        fill="#4BDFB3"
                        fillOpacity="0.5"
                      />
                      <path
                        d="M108.9 59.7C108.1 58.1 106.6 57 104.9 56.7C103.9 56.5 102.8 56.5 101.8 56.5H97.2C96.4 56.5 95.7 55.8 95.7 55V42.4C95.7 40.5 94.5 38.8 92.7 38.1C91.9 37.8 91 37.7 90.1 37.7C88.8 37.7 87.6 38.1 86.6 38.8L53.5 62.2C52.5 62.9 51.3 63.2 50.1 63.2C48.8 63.2 47.6 62.8 46.6 62.2L40.1 57.6C39.1 56.9 37.9 56.5 36.6 56.5C35.4 56.5 34.2 56.9 33.2 57.6L28.5 60.9C27.2 61.8 26.4 63.3 26.4 64.9C26.4 66.5 27.2 68 28.5 68.9L33.2 72.2C34.2 72.9 35.4 73.3 36.6 73.3C37.9 73.3 39.1 72.9 40.1 72.2L46.6 67.6C47.6 66.9 48.8 66.5 50.1 66.5C51.3 66.5 52.5 66.9 53.5 67.6L86.6 90.9C87.6 91.6 88.8 92 90.1 92C91 92 91.9 91.9 92.7 91.6C94.5 90.9 95.7 89.2 95.7 87.3V74.7C95.7 73.9 96.4 73.2 97.2 73.2H101.8C102.8 73.2 103.9 73.2 104.9 73C106.6 72.7 108.1 71.6 108.9 70C109.5 68.8 109.5 67.4 109.5 66.1V63.6C109.5 62.3 109.5 60.9 108.9 59.7Z"
                        fill="#4BDFB3"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1 text-blue-400"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  )}
                  {project.chain}
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-6">{project.description}</p>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Launched: {project.launchDate}
                </div>
                <Link href={project.link}>
                  <Button 
                    size="sm" 
                    className={`bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 ${
                      hoveredProject === project.name ? 'scale-105' : ''
                    }`}
                  >
                    View
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
