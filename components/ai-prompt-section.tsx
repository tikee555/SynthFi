"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowRight, Download, Rocket, CheckCircle, Lightbulb, FileText, Coins } from "lucide-react"
import { motion } from "framer-motion"
import { useCodeStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TokenomicsSummary } from "@/components/tokenomics-summary"

export function AiPromptSection() {
  const router = useRouter()
  const { setGeneratedCode } = useCodeStore()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [localGeneratedCode, setLocalGeneratedCode] = useState("")
  const [activeTab, setActiveTab] = useState("code")
  const [logicBreakdown, setLogicBreakdown] = useState<{
    summary: string
    keyFunctions: string[]
    accessRules: string[]
    constraints: string[]
    timeLocks: string[]
    mathLogic: string[]
  } | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showTokenomics, setShowTokenomics] = useState(false)

  const examplePrompts = [
    "Create a staking pool with 8% APR",
    "Token with 1-year vesting and NFT whitelist",
    "Airdrop claim gated by SOL balance",
  ]

  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setActiveTab("code")

    // Simulate code generation
    setTimeout(() => {
      // Generate code with new default behavior for tokens
      const sampleCode = generateCode(prompt)
      setLocalGeneratedCode(sampleCode)

      // Generate logic breakdown based on the prompt
      const breakdown = generateLogicBreakdown(prompt)
      setLogicBreakdown(breakdown)

      // Generate suggestions based on the prompt
      const generatedSuggestions = generateSuggestions(prompt)
      setSuggestions(generatedSuggestions)

      // Determine if we should show tokenomics (for token-related prompts)
      const isTokenRelated =
        prompt.toLowerCase().includes("token") ||
        prompt.toLowerCase().includes("vesting") ||
        prompt.toLowerCase().includes("mint") ||
        prompt.toLowerCase().includes("staking")

      setShowTokenomics(isTokenRelated)

      setIsGenerating(false)
    }, 2000)
  }

  const generateCode = (prompt: string) => {
    // Check if minting should be enabled based on the prompt
    const mintingKeywords = ["rebase", "governance mint", "inflationary", "minting"]
    const shouldEnableMinting = mintingKeywords.some((keyword) => prompt.toLowerCase().includes(keyword))

    // Base code template
    let code = `// Generated Solana Program for: ${prompt}
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod synthfi_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, params: InitializeParams) -> Result<()> {
        // Program initialization logic
        let program = &mut ctx.accounts.program_state;
        program.authority = ctx.accounts.authority.key();
        program.initialized = true;
        
        // Set fixed supply cap
        program.total_supply = 1_000_000 * 10u64.pow(program.decimals as u32);
`

    // Add mint authority based on prompt
    if (shouldEnableMinting) {
      code += `        
        // Mint authority is enabled based on prompt requirements
        program.mint_authority = Some(ctx.accounts.authority.key());
`
    } else {
      code += `        
        // Mint authority is revoked by default for security
        program.mint_authority = None;
`
    }

    // Complete the code
    code += `        
        // Additional setup based on prompt
        Ok(())
    }

    // Additional functions based on prompt requirements
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init,
        payer = authority,
        space = 8 + ProgramState::LEN
    )]
    pub program_state: Account<'info, ProgramState>,
    
    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct InitializeParams {
    // Parameters based on prompt
}

#[account]
pub struct ProgramState {
    pub authority: Pubkey,
    pub initialized: bool,
    pub total_supply: u64,
    pub decimals: u8,
    pub mint_authority: Option<Pubkey>,
    // Additional fields based on prompt
}

impl ProgramState {
    pub const LEN: usize = 32 + 1 + 8 + 1 + 33 + 64; // Approximate size
}`

    return code
  }

  const generateLogicBreakdown = (prompt: string) => {
    // Check if minting should be enabled based on the prompt
    const mintingKeywords = ["rebase", "governance mint", "inflationary", "minting"]
    const shouldEnableMinting = mintingKeywords.some((keyword) => prompt.toLowerCase().includes(keyword))

    // This would be replaced with actual AI-generated content
    // For now, we'll simulate different breakdowns based on the prompt

    if (prompt.toLowerCase().includes("staking")) {
      return {
        summary:
          "This contract implements a staking pool where users can deposit tokens to earn rewards over time. The reward rate is set at 8% APR, calculated and distributed on a per-block basis.",
        keyFunctions: [
          "initialize() - Sets up the staking pool with initial parameters",
          "stake() - Allows users to deposit tokens into the pool",
          "unstake() - Allows users to withdraw tokens and claim rewards",
          "claimRewards() - Allows users to claim rewards without unstaking",
        ],
        accessRules: [
          "Only the authority can update pool parameters",
          "Any user can stake tokens",
          "Only stakers can unstake their own deposits",
        ],
        constraints: [
          "Minimum stake amount: 1 token",
          "Maximum pool capacity: Unlimited",
          shouldEnableMinting ? "Minting: Enabled" : "Minting: Disabled (fixed supply)",
        ],
        timeLocks: ["No lockup period for staked tokens"],
        mathLogic: [
          "APR = 8%",
          "Per-block reward = (staked_amount * APR) / (365 * 24 * 60 * 5)",
          "Rewards accrue every block (~400ms on Solana)",
        ],
      }
    } else if (prompt.toLowerCase().includes("vesting")) {
      return {
        summary:
          "This contract implements a token vesting schedule with a 1-year linear release period. Access to the tokens is gated by NFT ownership, requiring users to hold a specific NFT to claim their vested tokens.",
        keyFunctions: [
          "initialize() - Sets up the vesting contract with beneficiaries",
          "claim() - Allows beneficiaries to claim vested tokens",
          "updateBeneficiary() - Allows changing the beneficiary address",
        ],
        accessRules: [
          "Only the authority can initialize the vesting contract",
          "Only NFT holders can claim vested tokens",
          "Only the authority can update beneficiaries",
        ],
        constraints: [
          "NFT must be from the specified collection",
          "Beneficiary must match the NFT owner",
          shouldEnableMinting ? "Minting: Enabled" : "Minting: Disabled (fixed supply)",
        ],
        timeLocks: ["1-year linear vesting period", "No cliff period"],
        mathLogic: [
          "Vested amount = total_amount * (current_time - start_time) / vesting_duration",
          "Claimable amount = vested_amount - already_claimed",
        ],
      }
    } else if (prompt.toLowerCase().includes("airdrop")) {
      return {
        summary:
          "This contract implements an airdrop claim mechanism where users can claim tokens if they meet a minimum SOL balance requirement. The contract verifies the user's SOL balance before allowing them to claim their allocated tokens.",
        keyFunctions: [
          "initialize() - Sets up the airdrop with token allocations",
          "claim() - Allows eligible users to claim their tokens",
          "updateAllocations() - Allows updating token allocations",
        ],
        accessRules: [
          "Only the authority can initialize and update the airdrop",
          "Only users with sufficient SOL balance can claim tokens",
          "Each address can only claim once",
        ],
        constraints: [
          "Minimum SOL balance required to claim",
          "Claim period has a start and end time",
          shouldEnableMinting ? "Minting: Enabled" : "Minting: Disabled (fixed supply)",
        ],
        timeLocks: ["Airdrop claim window", "No lockup after claiming"],
        mathLogic: ["Simple balance check: user_sol_balance >= minimum_required", "No complex calculations"],
      }
    } else {
      // Default breakdown for other types of contracts
      return {
        summary:
          "This contract implements a basic Solana program with initialization and state management. It establishes an authority that can control the program and maintains a program state to track its status.",
        keyFunctions: [
          "initialize() - Sets up the program with initial parameters",
          "Additional functions would be based on specific requirements",
        ],
        accessRules: ["Only the authority can initialize the program", "Authority has control over program functions"],
        constraints: [
          "Basic validation of inputs",
          "Standard account validation",
          shouldEnableMinting ? "Minting: Enabled" : "Minting: Disabled (fixed supply)",
        ],
        timeLocks: ["No time locks implemented"],
        mathLogic: ["No complex calculations"],
      }
    }
  }

  const generateSuggestions = (prompt: string) => {
    // Check if minting should be enabled based on the prompt
    const mintingKeywords = ["rebase", "governance mint", "inflationary", "minting"]
    const shouldEnableMinting = mintingKeywords.some((keyword) => prompt.toLowerCase().includes(keyword))

    // This would be replaced with actual AI-generated content
    // For now, we'll simulate different suggestions based on the prompt

    let suggestions = []

    if (prompt.toLowerCase().includes("staking")) {
      suggestions = [
        "Consider adding a pause mechanism for emergency situations",
        "Implement slashing conditions for malicious behavior",
        "Add a time lock for unstaking to prevent flash loan attacks",
        "Include a fee mechanism to sustain the protocol",
        "Add compound interest option for auto-reinvesting rewards",
      ]
    } else if (prompt.toLowerCase().includes("vesting")) {
      suggestions = [
        "Consider adding a cliff period before vesting begins",
        "Implement a revocation mechanism for non-compliant beneficiaries",
        "Add support for transferring vesting positions",
        "Include a governance mechanism for parameter updates",
        "Consider adding multiple vesting schedules for different token allocations",
      ]
    } else if (prompt.toLowerCase().includes("airdrop")) {
      suggestions = [
        "Consider adding a Merkle proof verification for gas efficiency",
        "Implement a referral bonus system",
        "Add tiered claiming based on SOL balance amounts",
        "Include a deadline for claiming to create urgency",
        "Consider adding a community voting mechanism for future airdrops",
      ]
    } else {
      // Default suggestions for other types of contracts
      suggestions = [
        "Consider adding a pause authority for emergency situations",
        "Implement comprehensive error handling with custom error codes",
        "Add detailed event logging for off-chain tracking",
        "Include a governance mechanism for parameter updates",
        "Consider adding a timelock for sensitive operations",
      ]
    }

    // Add suggestion about minting if it's enabled
    if (shouldEnableMinting) {
      suggestions.unshift(
        "Consider implementing a cap on minting or a time-based schedule to prevent unlimited inflation",
      )
    }

    return suggestions
  }

  const handleFixTokenomics = (fixedCode: string) => {
    setLocalGeneratedCode(fixedCode)
  }

  const handleSendToLaunchpad = () => {
    // Store the generated code in the global store
    setGeneratedCode(localGeneratedCode)

    // Navigate to the launchpad page
    router.push("/launchpad")
  }

  const handleDownload = () => {
    // Create a blob from the code
    const blob = new Blob([localGeneratedCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = "synthfi-program.rs"
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
          Create Solana Apps with Natural Language
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-4">
            <Textarea
              placeholder="Describe your Solana program in natural language..."
              className="min-h-[200px] bg-gray-900 border-gray-700 text-white"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((examplePrompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => setPrompt(examplePrompt)}
                >
                  {examplePrompt}
                </Button>
              ))}
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? "Generating..." : "Generate Code"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Right Panel - Output */}
          <Card className="bg-gray-900 border-gray-700 p-4 relative overflow-hidden">
            {localGeneratedCode ? (
              <>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                  <TabsList className="bg-gray-800 border-gray-700">
                    <TabsTrigger value="code" className="data-[state=active]:bg-purple-900">
                      <FileText className="mr-2 h-4 w-4" /> Code
                    </TabsTrigger>
                    <TabsTrigger value="logic" className="data-[state=active]:bg-purple-900">
                      <CheckCircle className="mr-2 h-4 w-4" /> Logic Breakdown
                    </TabsTrigger>
                    <TabsTrigger value="suggestions" className="data-[state=active]:bg-purple-900">
                      <Lightbulb className="mr-2 h-4 w-4" /> Suggestions
                    </TabsTrigger>
                    {showTokenomics && (
                      <TabsTrigger value="tokenomics" className="data-[state=active]:bg-purple-900">
                        <Coins className="mr-2 h-4 w-4" /> Tokenomics
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="code" className="mt-2">
                    <pre className="text-sm text-gray-300 overflow-auto max-h-[400px] p-4 bg-black rounded">
                      <code>{localGeneratedCode}</code>
                    </pre>
                  </TabsContent>

                  <TabsContent value="logic" className="mt-2">
                    {logicBreakdown && (
                      <div className="text-sm text-gray-300 overflow-auto max-h-[400px] p-4 bg-black rounded space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-purple-400 mb-2">Summary</h3>
                          <p>{logicBreakdown.summary}</p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-purple-400 mb-2">Key Functions</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {logicBreakdown.keyFunctions.map((func, index) => (
                              <li key={index}>{func}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-purple-400 mb-2">Access Rules</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {logicBreakdown.accessRules.map((rule, index) => (
                              <li key={index}>{rule}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-purple-400 mb-2">Constraints</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {logicBreakdown.constraints.map((constraint, index) => (
                              <li key={index}>{constraint}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-purple-400 mb-2">Time Locks</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {logicBreakdown.timeLocks.map((lock, index) => (
                              <li key={index}>{lock}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-purple-400 mb-2">Math Logic</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {logicBreakdown.mathLogic.map((logic, index) => (
                              <li key={index}>{logic}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="suggestions" className="mt-2">
                    <div className="text-sm text-gray-300 overflow-auto max-h-[400px] p-4 bg-black rounded">
                      <h3 className="text-lg font-semibold text-purple-400 mb-4">Suggested Improvements</h3>
                      <ul className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  {showTokenomics && (
                    <TabsContent value="tokenomics" className="mt-2">
                      <TokenomicsSummary
                        code={localGeneratedCode}
                        prompt={prompt}
                        onFixTokenomics={handleFixTokenomics}
                      />
                    </TabsContent>
                  )}
                </Tabs>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" /> Download DApp Code
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSendToLaunchpad}>
                    <Rocket className="mr-2 h-4 w-4" /> Send to Launchpad
                  </Button>
                </div>
              </>
            ) : isGenerating ? (
              <div className="flex flex-col items-center justify-center h-[400px]">
                <div className="relative w-16 h-16">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                        delay: i * 0.2,
                      }}
                      style={{
                        scale: 1 - i * 0.2,
                        opacity: 1 - i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <p className="mt-4 text-gray-400">Generating your Solana program...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <p>Enter a prompt to generate your Solana program</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}
