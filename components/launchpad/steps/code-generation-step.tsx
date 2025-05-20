"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Code, Layout, MessageSquare, Shield, Coins } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TokenomicsSummary } from "@/components/tokenomics-summary"

interface CodeGenerationStepProps {
  initialCode?: string
  onComplete: (programCode: string, frontendCode: string, securityIssues: string[]) => void
}

export function CodeGenerationStep({ initialCode = "", onComplete }: CodeGenerationStepProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("program")
  const [generatedCode, setGeneratedCode] = useState({
    program: initialCode,
    frontend: "",
    explanation: "",
  })
  const [securityIssues, setSecurityIssues] = useState<string[]>([])
  const [isFixing, setIsFixing] = useState(false)
  const [showTokenomics, setShowTokenomics] = useState(false)

  // If initial code is provided, analyze it for security issues
  useEffect(() => {
    if (initialCode) {
      // Simulate security analysis
      setTimeout(() => {
        setSecurityIssues([
          "Missing withdraw() function: No way for users to withdraw their funds",
          "Missing has_one constraint in token transfers: Authority is not verified to be the owner of the 'from' account",
          "Unchecked arithmetic: Token subtraction doesn't use checked_sub, risking overflow",
        ])

        // Check if the code is token-related
        setShowTokenomics(initialCode.includes("mint_authority") || initialCode.includes("total_supply"))

        // Generate placeholder frontend and explanation
        setGeneratedCode({
          program: initialCode,
          frontend: `// Generated React Frontend
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

const App = () => {
  const { connected, publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  
  const initialize = async () => {
    // Implementation details
  };
  
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">SynthFi Generated DApp</h1>
        <div className="mt-4">
          <WalletMultiButton />
        </div>
      </header>
      
      <main>
        {connected ? (
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h2 className="text-xl font-semibold mb-2">Initialize Program</h2>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={initialize}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Initialize'}
              </button>
            </div>
          </div>
        ) : (
          <p>Please connect your wallet to continue</p>
        )}
      </main>
    </div>
  );
};

export default App;`,
          explanation: `This program was imported from the AI code generator. 

The main components are:
1. A program state that stores the authority and initialization status
2. An initialize function that sets up the program
3. Token transfer functionality

The frontend provides a simple interface to interact with this program, allowing users to connect their wallet and initialize the program.`,
        })
      }, 1000)
    }
  }, [initialCode])

  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate code generation with security issues
    setTimeout(() => {
      // Check if minting should be enabled based on the prompt
      const mintingKeywords = ["rebase", "governance mint", "inflationary", "minting"]
      const shouldEnableMinting = mintingKeywords.some((keyword) => prompt.toLowerCase().includes(keyword))
      const isTokenRelated =
        prompt.toLowerCase().includes("token") ||
        prompt.toLowerCase().includes("vesting") ||
        prompt.toLowerCase().includes("mint") ||
        prompt.toLowerCase().includes("staking")

      // Generate program code with new default behavior for tokens
      let programCode = `// Generated Solana Program for: ${prompt}
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
        programCode += `        
        // Mint authority is enabled based on prompt requirements
        program.mint_authority = Some(ctx.accounts.authority.key());
`
      } else {
        programCode += `        
        // Mint authority is revoked by default for security
        program.mint_authority = None;
`
      }

      // Complete the code
      programCode += `        
        // Additional setup based on prompt
        Ok(())
    }

    // Missing withdraw function
    
    pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        // Missing has_one constraint in token transfers
        let transfer_instruction = Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        
        // Unchecked arithmetic
        let new_balance = ctx.accounts.from.amount - amount;
        
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                transfer_instruction,
            ),
            amount,
        )?;
        
        Ok(())
    }
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

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
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

      const frontendCode = `// Generated React Frontend
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

const App = () => {
  const { connected, publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  
  const initialize = async () => {
    // Implementation details
  };
  
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">SynthFi Generated DApp</h1>
        <div className="mt-4">
          <WalletMultiButton />
        </div>
      </header>
      
      <main>
        {connected ? (
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <h2 className="text-xl font-semibold mb-2">Initialize Program</h2>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={initialize}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Initialize'}
              </button>
            </div>
          </div>
        ) : (
          <p>Please connect your wallet to continue</p>
        )}
      </main>
    </div>
  );
};

export default App;`

      const explanation = `This program implements a basic token transfer functionality based on your prompt. 

The main components are:
1. A program state that stores the authority and initialization status
2. An initialize function that sets up the program
3. A transfer_tokens function that allows moving tokens between accounts

The frontend provides a simple interface to interact with this program, allowing users to connect their wallet and initialize the program.`

      const issues = [
        "Missing withdraw() function: No way for users to withdraw their funds",
        "Missing has_one constraint in token transfers: Authority is not verified to be the owner of the 'from' account",
        "Unchecked arithmetic: Token subtraction doesn't use checked_sub, risking overflow",
      ]

      setGeneratedCode({
        program: programCode,
        frontend: frontendCode,
        explanation: explanation,
      })
      setSecurityIssues(issues)
      setShowTokenomics(isTokenRelated)
      setIsGenerating(false)
    }, 3000)
  }

  const handleFixIssues = () => {
    // Show fixing state
    setIsFixing(true)

    // Simulate fixing the code
    setTimeout(() => {
      const fixedCode = generatedCode.program
        .replace(
          "// Missing withdraw function",
          `
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        // Allow users to withdraw their funds
        let transfer_instruction = Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.user_token.to_account_info(),
            authority: ctx.accounts.program_state.to_account_info(),
        };
        
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                transfer_instruction,
                &[&[
                    b"state",
                    &[ctx.accounts.program_state.bump],
                ]],
            ),
            amount,
        )?;
        
        Ok(())
    }`,
        )
        .replace("// Missing has_one constraint in token transfers", "// Properly constrained token transfers")
        .replace(
          "#[account(mut)]\n    pub from: Account<'info, TokenAccount>,",
          "#[account(mut, has_one = authority)]\n    pub from: Account<'info, TokenAccount>,",
        )
        .replace(
          "// Unchecked arithmetic\n        let new_balance = ctx.accounts.from.amount - amount;",
          "// Safe arithmetic\n        let new_balance = ctx.accounts.from.amount.checked_sub(amount).ok_or(ProgramError::InsufficientFunds)?;",
        )

      setGeneratedCode({
        ...generatedCode,
        program: fixedCode,
      })
      setSecurityIssues([])
      setIsFixing(false)
    }, 1500)
  }

  const handleFixTokenomics = (fixedCode: string) => {
    setGeneratedCode({
      ...generatedCode,
      program: fixedCode,
    })
  }

  const handleComplete = () => {
    onComplete(generatedCode.program, generatedCode.frontend, securityIssues)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Step 1: AI Code Generation and Audit</h2>

      {!generatedCode.program ? (
        <div className="space-y-4">
          <Textarea
            placeholder="Describe your Solana program in natural language..."
            className="min-h-[150px] bg-gray-900 border-gray-700 text-white"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? "Generating Code..." : "Generate Code"}
          </Button>
        </div>
      ) : (
        <>
          <Tabs defaultValue="program" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-900 border-gray-700">
              <TabsTrigger value="program" className="data-[state=active]:bg-purple-900">
                <Code className="mr-2 h-4 w-4" /> Program Code
              </TabsTrigger>
              <TabsTrigger value="frontend" className="data-[state=active]:bg-purple-900">
                <Layout className="mr-2 h-4 w-4" /> Frontend Code
              </TabsTrigger>
              <TabsTrigger value="explanation" className="data-[state=active]:bg-purple-900">
                <MessageSquare className="mr-2 h-4 w-4" /> Explanation
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-purple-900">
                <Shield className="mr-2 h-4 w-4" /> Security Review
              </TabsTrigger>
              {showTokenomics && (
                <TabsTrigger value="tokenomics" className="data-[state=active]:bg-purple-900">
                  <Coins className="mr-2 h-4 w-4" /> Tokenomics
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="program" className="mt-4">
              <pre className="bg-gray-900 p-4 rounded overflow-auto max-h-[400px] text-sm">
                <code className="text-gray-300">{generatedCode.program}</code>
              </pre>
            </TabsContent>

            <TabsContent value="frontend" className="mt-4">
              <pre className="bg-gray-900 p-4 rounded overflow-auto max-h-[400px] text-sm">
                <code className="text-gray-300">{generatedCode.frontend}</code>
              </pre>
            </TabsContent>

            <TabsContent value="explanation" className="mt-4">
              <div className="bg-gray-900 p-4 rounded max-h-[400px] overflow-auto">
                <p className="text-gray-300 whitespace-pre-line">{generatedCode.explanation}</p>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <div className="bg-gray-900 p-4 rounded max-h-[400px] overflow-auto">
                {securityIssues.length > 0 ? (
                  <div className="space-y-4">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Security Issues Detected</AlertTitle>
                      <AlertDescription>The following issues were found in your code:</AlertDescription>
                    </Alert>

                    <ul className="list-disc pl-5 space-y-2">
                      {securityIssues.map((issue, index) => (
                        <li key={index} className="text-red-400">
                          {issue}
                        </li>
                      ))}
                    </ul>

                    <Button onClick={handleFixIssues} className="bg-green-600 hover:bg-green-700" disabled={isFixing}>
                      {isFixing ? "Fixing Issues..." : "Fix Critical Issues"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <span>No security issues detected. Your code is ready for deployment.</span>
                  </div>
                )}
              </div>
            </TabsContent>

            {showTokenomics && (
              <TabsContent value="tokenomics" className="mt-4">
                <TokenomicsSummary
                  code={generatedCode.program}
                  prompt={prompt || "token"}
                  onFixTokenomics={handleFixTokenomics}
                />
              </TabsContent>
            )}
          </Tabs>

          {/* Always display security issues below the main content */}
          {securityIssues.length > 0 && activeTab !== "security" && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-md">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <h3 className="text-lg font-semibold text-red-400">Security Issues Detected</h3>
              </div>

              <ul className="list-disc pl-5 space-y-1 mb-4">
                {securityIssues.map((issue, index) => (
                  <li key={index} className="text-red-300 text-sm">
                    {issue}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => {
                  setActiveTab("security")
                }}
                variant="outline"
                className="mr-2 border-red-700 text-red-300 hover:bg-red-900/30"
              >
                View Details
              </Button>

              <Button onClick={handleFixIssues} className="bg-green-600 hover:bg-green-700" disabled={isFixing}>
                {isFixing ? "Fixing Issues..." : "Fix Critical Issues"}
              </Button>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleComplete}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={securityIssues.length > 0}
            >
              {securityIssues.length > 0 ? "Fix Issues Before Continuing" : "Continue to Deployment"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
