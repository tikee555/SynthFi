// This file should contain AITemplate, TemplateLaunchConfig, and RemixLaunchConfig
export type IconName = keyof typeof import("lucide-react")
export type TemplateCategory = "DeFi" | "NFT" | "DAO" | "Tokenomics" | "Utility" | "Gaming" | "Social" | "Other"
export type TemplateSortOption = "mostUsed" | "mostVoted" | "newest" | "official"

export interface AITemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  author?: string
  prompt: string
  aiInstruction?: string
  tags?: string[]
  icon?: IconName
  useCount?: number
  voteCount?: number
  voters?: string[] // Added to store wallet addresses of voters
  createdAt?: string
  updatedAt?: string
  version?: string
  isOfficial?: boolean
  chainCompatibility?: string[]
  generatedCode?: string
  logicBreakdown?: string
  aiIntegrationOptions?: string
  supportsAI?: boolean
  defaultProjectName?: string
  defaultTokenName?: string
  defaultTokenSymbol?: string
  defaultDecimals?: number
  estimatedCost?: string
  submittedBy?: string
  isStaffPick?: boolean
}

export interface TemplateLaunchConfig {
  templateId: string
  originalTemplateData: AITemplate
  projectName: string
  tokenName: string
  tokenSymbol: string
  tokenDecimals: number
  enableAI: boolean
  customAIInstruction?: string
  basePrompt: string
  customizedPrompt: string
}

// For passing data from Remix page to Launchpad
export interface RemixLaunchConfig {
  originalPrompt: string
  customizedPrompt: string
  projectName?: string
  tokenName?: string
  tokenSymbol?: string
  tokenDecimals?: number
  selectedChain: string
  enableAI: boolean
  aiInstruction?: string
}
