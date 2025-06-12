// This file is reverted to a basic placeholder as its previous_blocks version was "left out for brevity".
// Please restore your original version of this file if it was more complex.
import type { AITemplate } from "@/components/template-card" // Assuming AITemplate is defined here

export const initialMockTemplates: AITemplate[] = [
  {
    id: "basic-token",
    name: "Basic SPL Token",
    description: "A standard Solana Program Library token with a fixed supply.",
    prompt: "Create a token named 'My Basic Token' (MBT) with a total supply of 1,000,000.",
    category: "Token",
    author: "SynthFi Official",
    isOfficial: true,
    chainCompatibility: ["Solana"],
    useCount: 120,
    voteCount: 45,
    createdAt: "2023-01-15T10:00:00Z",
    icon: "Coins" as any, // Placeholder for Lucide icon name
  },
  {
    id: "staking-pool-simple",
    name: "Simple Staking Pool",
    description: "A basic staking pool where users can stake one token to earn rewards in another.",
    prompt: "Create a staking pool where users stake TokenA to earn TokenB. Set APR to 8%. No lockup period.",
    aiInstruction:
      "Generate standard Anchor staking and reward distribution logic. Ensure accounts are properly sized.",
    category: "DeFi",
    author: "Community Contributor",
    chainCompatibility: ["Solana"],
    useCount: 75,
    voteCount: 22,
    createdAt: "2023-02-20T14:30:00Z",
    icon: "Landmark" as any,
  },
]
