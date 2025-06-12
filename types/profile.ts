// This file defines the types used by the profile modal.
// Ensure this file exists from the previous turn or is created now.
// If you need the code for this again, let me know. For brevity, assuming it's available.
export interface DeployedProtocol {
  id: string
  title: string
  promptSnippet: string
  type: string // e.g., Staking, DAO, Vesting
  chain: "Solana" | "Base" | string // Allow other chains
  dateGenerated: string // ISO date string
  tags: string[]
  isPremium: boolean
  contractAddress?: string
  transactionHash?: string
}

export interface ProfileSettings {
  displayName: string
  bio: string
  isPublic: boolean
  // ensName?: string; // Future: for ENS
  // avatarUrl?: string; // Future: for custom avatar
}
