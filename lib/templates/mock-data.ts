import type { AITemplate } from "@/components/templates/template-types"

export const initialMockTemplates: AITemplate[] = [
  {
    id: "template-001",
    name: "Vesting Contract",
    description: "Create a token with a time-based vesting schedule and cliff period for team or investor allocations.",
    category: "Tokenomics",
    prompt:
      "Create a Solana smart contract for a token with a 1-year vesting period and a 3-month cliff. Total supply 1,000,000 tokens.",
    aiInstruction:
      "Generate an Anchor-based Solana program. Include structs for VestingSchedule and Beneficiary. Instructions for initialize, deposit_tokens, claim_vested_tokens. Ensure proper authority checks.",
    icon: "FileText",
    useCount: 125,
    voteCount: 88,
    voters: [],
    createdAt: "2023-10-15T10:00:00Z",
    isOfficial: true,
    chainCompatibility: ["solana"],
    supportsAI: true,
    defaultProjectName: "MyVestingToken",
    defaultTokenName: "Vested Token",
    defaultTokenSymbol: "VTK",
    defaultDecimals: 9,
  },
  {
    id: "template-002",
    name: "Basic Staking Pool",
    description: "Launch a simple staking pool where users can lock tokens to earn fixed APR rewards.",
    category: "DeFi",
    prompt:
      "Build a staking pool contract for Solana. Users stake Token X to earn Token Y. Fixed 8% APR, no early withdrawal penalty. 30-day lockup.",
    aiInstruction:
      "Focus on core staking logic: deposit, withdraw, claim_rewards. Define PoolConfig and UserStakeInfo structs. Implement reward calculation based on time staked and APR.",
    icon: "Coins",
    useCount: 210,
    voteCount: 150,
    voters: [],
    createdAt: "2023-11-01T14:30:00Z",
    isOfficial: true,
    chainCompatibility: ["solana"],
    supportsAI: true,
    defaultProjectName: "MyStakingPool",
    defaultTokenName: "Stake Pool Token",
    defaultTokenSymbol: "SPT",
    defaultDecimals: 6,
  },
  {
    id: "template-003",
    name: "Simple DAO Voting",
    description: "A basic DAO contract allowing token holders to vote on proposals. One token, one vote.",
    category: "DAO",
    prompt:
      "Create a DAO voting contract. Token holders can create proposals and vote. Quorum: 10% of total supply. Proposal duration: 7 days.",
    aiInstruction:
      "Generate structs for Proposal and Vote. Instructions for create_proposal, cast_vote, execute_proposal. Ensure proposal lifecycle management.",
    icon: "Users",
    useCount: 95,
    voteCount: 60,
    voters: [],
    createdAt: "2023-09-20T09:00:00Z",
    chainCompatibility: ["solana"],
    supportsAI: true,
  },
  {
    id: "template-004",
    name: "NFT Minting Contract",
    description: "A standard contract for minting a collection of NFTs with metadata conforming to Metaplex standards.",
    category: "NFT",
    prompt:
      "Generate an NFT minting contract for a collection of 1000 unique items. Include whitelist functionality and a mint price of 0.5 SOL.",
    aiInstruction:
      "Use Metaplex token-metadata program. Instructions for mint_nft, update_metadata_uri. Handle mint authority and collection setup.",
    icon: "Zap", // Changed from 'Image' as it's not a standard Lucide icon name
    useCount: 180,
    voteCount: 110,
    voters: [],
    createdAt: "2023-11-10T11:00:00Z",
    isOfficial: true,
    chainCompatibility: ["solana"],
    supportsAI: true,
  },
  {
    id: "template-005",
    name: "Burn-on-Transfer Token",
    description:
      "A token that automatically burns a percentage of the amount on every transfer, creating deflationary pressure.",
    category: "Tokenomics",
    prompt: "Token with 1,000,000 fixed supply, no further minting. Implement a 1% burn on every transfer.",
    aiInstruction:
      "Override the SPL token transfer instruction or use a token-2022 extension if applicable. Ensure the burn mechanism correctly reduces supply and sends tokens to a burn address.",
    icon: "ShieldCheck", // Changed from 'Flame' as it's not a standard Lucide icon name, ShieldCheck for tokenomics
    useCount: 70,
    voteCount: 45,
    voters: [],
    createdAt: "2023-08-05T16:20:00Z",
    chainCompatibility: ["solana"],
    supportsAI: true,
  },
  {
    id: "template-006",
    name: "Gaming Reward Token",
    description: "A utility token for an on-chain game, used for in-game purchases and player rewards.",
    category: "Gaming",
    prompt:
      "Design a utility token for a blockchain game. Features: earnable through gameplay, spendable on in-game items. Initial supply: 100M. Allow admin to mint more for rewards.",
    aiInstruction:
      "Standard SPL token with mint authority. Consider adding instructions for game-specific actions like 'award_tokens_to_player' or 'spend_tokens_for_item'.",
    icon: "Gamepad2",
    useCount: 60,
    voteCount: 30,
    voters: [],
    createdAt: "2024-01-05T12:00:00Z",
    chainCompatibility: ["solana"],
    supportsAI: true,
  },
  {
    id: "template-007",
    name: "Social Token with Tipping",
    description: "A token for content creators or communities, allowing for direct tipping between users.",
    category: "Social",
    prompt:
      "Create a social token that users can send to each other as tips. Implement a 'tip_user' instruction. Fixed supply: 1B tokens.",
    aiInstruction:
      "Focus on peer-to-peer transferability. The 'tip_user' instruction should handle the token transfer and potentially log the interaction.",
    icon: "MessageSquare",
    useCount: 45,
    voteCount: 22,
    voters: [],
    createdAt: "2024-01-20T18:00:00Z",
    chainCompatibility: ["solana"],
    supportsAI: false, // Example of a template not supporting AI enhancement
  },
]
