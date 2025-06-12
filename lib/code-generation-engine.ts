// Contains generateSampleCode, parseNumber, parseDurationToSeconds,
// generateLogicBreakdownForDisplay, generateSuggestionsForDisplay, generateTokenomicsForDisplay

const JS_SECONDS_IN_DAY: number = 24 * 60 * 60
const JS_SECONDS_IN_YEAR: number = 365 * JS_SECONDS_IN_DAY
// Added for more granular time constants if needed by parsing
const JS_SECONDS_IN_MONTH: number = 30 * JS_SECONDS_IN_DAY // Approximation

export function parseNumber(text: string | null | undefined, defaultValue: number): number {
  if (!text) return defaultValue
  const parsed = Number.parseFloat(text.replace(/[^0-9.,]/g, "").replace(",", "."))
  return isNaN(parsed) ? defaultValue : parsed
}

export function parseDurationToSeconds(text: string | null | undefined, defaultValueSeconds: number): number {
  if (!text) return defaultValueSeconds
  const lowerText = text.toLowerCase()
  const valueMatch = lowerText.match(/(\d+\.?\d*)/)
  if (!valueMatch) return defaultValueSeconds

  const value = Number.parseFloat(valueMatch[1])
  if (isNaN(value)) return defaultValueSeconds

  if (lowerText.includes("sec")) return value
  if (lowerText.includes("min")) return value * 60
  if (lowerText.includes("hour")) return value * 60 * 60
  if (lowerText.includes("day")) return value * JS_SECONDS_IN_DAY
  if (lowerText.includes("month")) return value * JS_SECONDS_IN_MONTH
  if (lowerText.includes("year")) return value * JS_SECONDS_IN_YEAR
  return value // Assume seconds if no unit
}

export function generateSampleCode(
  promptString: string,
  enableAIVal = false,
  selectedChainVal = "solana",
  aiInstructionVal?: string,
): string {
  const lowerPrompt = promptString.toLowerCase()
  let programName = "my_program" // Default program name
  const programNameMatch = lowerPrompt.match(/(?:program|contract|pool)\s*(?:named|called)?\s*([\w_]+)/i)
  if (programNameMatch && programNameMatch[1]) {
    programName = programNameMatch[1].trim().replace(/\s+/g, "_").toLowerCase()
  }

  if (selectedChainVal === "solana") {
    let imports = `use anchor_lang::prelude::*;\n`
    const baseIdName = programName
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 10)
      .toUpperCase()
    const uniqueSuffix = Date.now().toString().slice(-5)
    const placeholderProgramId = `${baseIdName}${uniqueSuffix}`.padEnd(10, "X") + "1111111111111111111111" // More unique placeholder
    let declareId = `declare_id!("${placeholderProgramId}"); // IMPORTANT: Replace with your Program ID after deployment!\n`

    let programMod = `#[program]\npub mod ${programName} {\n    use super::*;\n`
    let instructions = ""
    let accountsStructs = ""
    let stateStructs = ""
    const errorEnum = `
#[error_code]
pub enum ${programName.charAt(0).toUpperCase() + programName.slice(1)}Error {
    #[msg("Default error message.")]
    DefaultError,
    #[msg("Unauthorized action.")]
    Unauthorized,
    #[msg("Invalid amount provided.")]
    InvalidAmount,
    #[msg("Calculation overflow.")]
    Overflow,
    // Add more specific errors as needed by features
}
`

    const isTokenPrompt = lowerPrompt.includes("token") || lowerPrompt.includes("coin")
    const isVestingPrompt = lowerPrompt.includes("vesting")
    const isStakingPrompt = lowerPrompt.includes("staking")

    if (isVestingPrompt) {
      programName = "token_vesting_program" // Override for vesting
      // --- Full Vesting Code Generation (from previous successful iteration) ---
      const parsedTokenNameMatch = lowerPrompt.match(
        /(?:token named|name for token|token is called)\s*([\w\s]+?)(?:\s|\(|with symbol|$)/i,
      )
      const parsedTokenName = parsedTokenNameMatch ? parsedTokenNameMatch[1].trim() : "MyVestingToken"
      const parsedSymbolMatch = lowerPrompt.match(/(?:symbol|ticker)\s*([A-Z]{2,5})/i)
      const parsedTokenSymbol = parsedSymbolMatch ? parsedSymbolMatch[1] : "MVT"
      const parsedSupplyMatch = lowerPrompt.match(/(?:total supply of|supply of|amount of)\s*([\d,]+)/i)
      const parsedTotalSupply = parsedSupplyMatch
        ? Number.parseInt(parsedSupplyMatch[1].replace(/,/g, ""), 10)
        : 1_000_000
      const parsedTokenDecimals = Number.parseInt(lowerPrompt.match(/(\d+)\s+decimals/)?.[1] || "9", 10)
      const parsedVestingDurationMatch = lowerPrompt.match(
        /(\d+\s*-?\s*(?:day|month|year)s?)\s*(?:vesting|for vesting)/i,
      )
      const parsedVestingDurationSeconds = parsedVestingDurationMatch
        ? parseDurationToSeconds(parsedVestingDurationMatch[1], JS_SECONDS_IN_YEAR)
        : JS_SECONDS_IN_YEAR
      const parsedCliffDurationMatch = lowerPrompt.match(/(\d+\s*-?\s*(?:day|month|year)s?)\s*cliff/i)
      const parsedCliffDurationSeconds = parsedCliffDurationMatch
        ? parseDurationToSeconds(parsedCliffDurationMatch[1], JS_SECONDS_IN_MONTH)
        : JS_SECONDS_IN_MONTH
      const parsedIsLinearUnlocking = lowerPrompt.includes("linear unlocking")

      // Update declare_id with a more specific name for vesting
      const vestingBaseIdName = programName
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 10)
        .toUpperCase()
      const vestingUniqueSuffix = Date.now().toString().slice(-4) // slightly different suffix
      const vestingPlaceholderProgramId =
        `${vestingBaseIdName}${vestingUniqueSuffix}`.padEnd(10, "V") + "1111111111111111111111"
      declareId = `declare_id!("${vestingPlaceholderProgramId}"); // IMPORTANT: Replace with your Program ID!\n`

      const fullVestingRustCode = `
use anchor_lang::prelude::*;
use anchor_spl::{token::{self, Mint, Token, TokenAccount, Transfer}, associated_token::AssociatedToken};
use std::convert::TryInto;

// SynthFi Generated Program: ${programName}
// Prompt: "${promptString}"
// Token Details: Name: ${parsedTokenName}, Symbol: ${parsedTokenSymbol}, (Supply from prompt: ${parsedTotalSupply}, Decimals: ${parsedTokenDecimals})
// Vesting: Duration: ${parsedVestingDurationSeconds}s, Cliff: ${parsedCliffDurationSeconds}s, Linear: ${parsedIsLinearUnlocking}
// AI Instruction: ${aiInstructionVal || "N/A"}
// Timestamp: ${new Date().toISOString()}
${declareId}
#[program]
pub mod ${programName} {
    use super::*;

    pub fn initialize_vesting(
        ctx: Context<InitializeVesting>,
        beneficiary_key: Pubkey,
        total_vesting_amount: u64,
        vesting_start_timestamp: i64,
        vesting_duration_override: Option<i64>,
        cliff_duration_override: Option<i64>
    ) -> Result<()> {
        msg!("Initializing vesting for beneficiary: {}", beneficiary_key);
        let schedule = &mut ctx.accounts.vesting_schedule;
        
        schedule.initializer = *ctx.accounts.initializer.key;
        schedule.beneficiary = beneficiary_key;
        schedule.mint = ctx.accounts.token_mint.key();
        schedule.vesting_vault = ctx.accounts.vesting_vault.key();
        schedule.total_vesting_amount = total_vesting_amount;
        schedule.vesting_start_timestamp = vesting_start_timestamp;
        schedule.vesting_duration_seconds = vesting_duration_override.unwrap_or(${parsedVestingDurationSeconds});
        schedule.cliff_duration_seconds = cliff_duration_override.unwrap_or(${parsedCliffDurationSeconds});
        schedule.amount_claimed = 0;
        schedule.is_linear = ${parsedIsLinearUnlocking};
        schedule.bump_schedule = *ctx.bumps.get("vesting_schedule").ok_or(${programName.charAt(0).toUpperCase() + programName.slice(1)}Error::DefaultError)?;
        schedule.bump_vault = *ctx.bumps.get("vesting_vault").ok_or(${programName.charAt(0).toUpperCase() + programName.slice(1)}Error::DefaultError)?;

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.initializer_token_account.to_account_info(),
                    to: ctx.accounts.vesting_vault.to_account_info(),
                    authority: ctx.accounts.initializer.to_account_info(),
                }
            ),
            total_vesting_amount
        )?;
        msg!("Vesting initialized. Vault: {}", schedule.vesting_vault);
        Ok(())
    }

    pub fn claim_tokens(ctx: Context<ClaimTokens>) -> Result<()> {
        let clock = Clock::get()?;
        let current_ts = clock.unix_timestamp;
        let schedule = &mut ctx.accounts.vesting_schedule;

        require_keys_eq!(schedule.beneficiary, ctx.accounts.beneficiary.key(), ${programName.charAt(0).toUpperCase() + programName.slice(1)}Error::Unauthorized);
        require!(current_ts >= schedule.vesting_start_timestamp, ${programName.charAt(0).toUpperCase() + programName.slice(1)}Error::DefaultError); // VestingNotStarted
        
        let time_elapsed = current_ts.saturating_sub(schedule.vesting_start_timestamp);
        require!(time_elapsed >= schedule.cliff_duration_seconds, ${programName.charAt(0).toUpperCase() + programName.slice(1)}Error::DefaultError); // CliffNotReached

        let vested_now = if schedule.is_linear {
            if time_elapsed >= schedule.vesting_duration_seconds {
                schedule.total_vesting_amount
            } else {
                (schedule.total_vesting_amount as u128)
                    .checked_mul(time_elapsed as u128).ok_or(${programName.charAt(0).toUpperCase() + programName.slice(1)}Error::Overflow)?
                    .checked_div(schedule.vesting_duration_seconds as u128).ok_or(${programName.charAt(0).toUpperCase() + programName.slice(1)}Error::Overflow)?
                    .try_into().map_err(|_| ${programName.charAt(0).toUpperCase() + programName.slice(1)}Error::Overflow)?
            }
        } else { // All at end after cliff (if not linear)
            if time_elapsed >= schedule.vesting_duration_seconds { schedule.total_vesting_amount } else { 0 }
        };

        let claimable = vested_now.saturating_sub(schedule.amount_claimed);
        require!(claimable > 0, ${programName.charAt(0).toUpperCase() + programName.slice(1)}Error::DefaultError); // NoTokensToClaim

        let vault_seeds = &[
            b"vesting_vault".as_ref(),
            schedule.key().as_ref(),
            &[schedule.bump_vault],
        ];
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vesting_vault.to_account_info(),
                    to: ctx.accounts.beneficiary_token_account.to_account_info(),
                    authority: ctx.accounts.vesting_vault.to_account_info(), // Vault PDA is authority
                },
                &[&vault_seeds[..]]
            ),
            claimable
        )?;
        schedule.amount_claimed = schedule.amount_claimed.checked_add(claimable).ok_or(${programName.charAt(0).toUpperCase() + programName.slice(1)}Error::Overflow)?;
        msg!("Claimed {} tokens.", claimable);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(beneficiary_key: Pubkey)]
pub struct InitializeVesting<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    #[account(
        init_if_needed, payer = initializer,
        mint::decimals = ${parsedTokenDecimals}, mint::authority = initializer,
    )]
    pub token_mint: Account<'info, Mint>,
    #[account(
        init, payer = initializer,
        seeds = [b"vesting_schedule".as_ref(), initializer.key().as_ref(), beneficiary_key.as_ref()], bump,
        space = 8 + VestingSchedule::LEN
    )]
    pub vesting_schedule: Account<'info, VestingSchedule>,
    #[account(
        init, payer = initializer,
        token::mint = token_mint, token::authority = vesting_vault, // PDA is authority
        seeds = [b"vesting_vault".as_ref(), vesting_schedule.key().as_ref()], bump,
    )]
    pub vesting_vault: Account<'info, TokenAccount>, // PDA token account
    #[account(mut, associated_token::mint = token_mint, associated_token::authority = initializer)]
    pub initializer_token_account: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ClaimTokens<'info> {
    #[account(mut)]
    pub beneficiary: Signer<'info>,
    #[account(mut, 
        seeds = [b"vesting_schedule".as_ref(), vesting_schedule.initializer.as_ref(), beneficiary.key().as_ref()], 
        bump = vesting_schedule.bump_schedule,
        has_one = beneficiary, has_one = mint
    )]
    pub vesting_schedule: Account<'info, VestingSchedule>,
    #[account(mut, 
        seeds = [b"vesting_vault".as_ref(), vesting_schedule.key().as_ref()], 
        bump = vesting_schedule.bump_vault,
        token::mint = mint
    )]
    pub vesting_vault: Account<'info, TokenAccount>,
    #[account(init_if_needed, payer = beneficiary,
        associated_token::mint = mint, associated_token::authority = beneficiary
    )]
    pub beneficiary_token_account: Account<'info, TokenAccount>,
    pub mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[account]
pub struct VestingSchedule {
    pub initializer: Pubkey, pub beneficiary: Pubkey, pub mint: Pubkey, pub vesting_vault: Pubkey,
    pub total_vesting_amount: u64, pub vesting_start_timestamp: i64,
    pub vesting_duration_seconds: i64, pub cliff_duration_seconds: i64,
    pub amount_claimed: u64, pub is_linear: bool,
    pub bump_schedule: u8, pub bump_vault: u8,
}
impl VestingSchedule { const LEN: usize = 32*4 + 8*4 + 1 + 1 + 2*1 + 8; } // Added padding

${errorEnum.replace("DefaultError,", `DefaultError,\n    #[msg("Vesting not started.")]\n    VestingNotStarted,\n    #[msg("Cliff not reached.")]\n    CliffNotReached,\n    #[msg("No tokens to claim.")]\n    NoTokensToClaim,`)}
`
      return fullVestingRustCode // Return the complete vesting code
    } else if (isTokenPrompt && !isStakingPrompt) {
      // Simple Token Creation (no complex vesting/staking)
      programName =
        lowerPrompt
          .match(/token\s*(?:named|called)?\s*([\w_]+)/i)?.[1]
          ?.trim()
          ?.replace(/\s+/g, "_")
          ?.toLowerCase() || "my_token"
      imports += `use anchor_spl::{token::{self, Mint, Token, TokenAccount, MintTo}, associated_token::AssociatedToken};\n`

      const tokenName = lowerPrompt.match(/(?:token|named)\s+([A-Za-z0-9_]+)/)?.[1] || "MyToken"
      const tokenSymbol = lowerPrompt.match(/symbol\s+([A-Z]+)/)?.[1] || "MYT"
      const supply = lowerPrompt.match(/supply\s+of\s+([\d,]+)/)?.[1]?.replace(/,/g, "_") || "1_000_000"
      const decimals = Number.parseInt(lowerPrompt.match(/(\d+)\s+decimals/)?.[1] || "9", 10)

      instructions += `
    pub fn initialize_token_mint(ctx: Context<InitializeTokenMint>, _decimals: u8, initial_supply: u64) -> Result<()> {
        msg!("Initializing new SPL Token Mint: {}", ctx.accounts.mint.key());
        msg!("Mint Authority: {}", ctx.accounts.payer.key());
        // Mint initial supply to payer's associated token account
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.payer_token_account.to_account_info(),
                    authority: ctx.accounts.payer.to_account_info(),
                }
            ),
            initial_supply
        )?;
        msg!("Minted {} tokens to {}", initial_supply, ctx.accounts.payer_token_account.key());
        Ok(())
    }
`
      accountsStructs += `
#[derive(Accounts)]
#[instruction(_decimals: u8)] // Make decimals an instruction arg for flexibility
pub struct InitializeTokenMint<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        mint::decimals = _decimals,
        mint::authority = payer, // Payer is mint authority
        mint::freeze_authority = payer, // Payer is freeze authority
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init_if_needed, // Create ATA for payer if it doesn't exist
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer
    )]
    pub payer_token_account: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
`
    } else if (isStakingPrompt) {
      programName =
        lowerPrompt
          .match(/staking\s*(?:pool|program)?\s*(?:named|called)?\s*([\w_]+)/i)?.[1]
          ?.trim()
          ?.replace(/\s+/g, "_")
          ?.toLowerCase() || "my_staking_pool"
      imports += `use anchor_spl::{token::{self, Mint, Token, TokenAccount, Transfer, MintTo}, associated_token::AssociatedToken};\n`

      const stakeMintName = lowerPrompt.match(/stake\s(?:token\s)?([\w_]+)/i)?.[1] || "STAKE_MINT"
      const rewardMintName = lowerPrompt.match(/reward\s(?:token\s)?([\w_]+)/i)?.[1] || "REWARD_MINT"
      const apr = lowerPrompt.match(/(\d+\.?\d*)\s*%\s*apr/i)?.[1] || "10" // Default 10% APR

      instructions += `
    pub fn initialize_staking_pool(ctx: Context<InitializeStakingPool>, reward_rate_per_second: u64, lockup_duration_seconds: i64) -> Result<()> {
        let pool_config = &mut ctx.accounts.pool_config;
        pool_config.admin = *ctx.accounts.admin.key;
        pool_config.stake_token_mint = ctx.accounts.stake_token_mint.key();
        pool_config.reward_token_mint = ctx.accounts.reward_token_mint.key();
        pool_config.reward_vault = ctx.accounts.reward_vault.key();
        pool_config.reward_rate_per_second = reward_rate_per_second; // Example: calculate based on APR and total possible stake
        pool_config.lockup_duration_seconds = lockup_duration_seconds;
        pool_config.total_staked_amount = 0;
        pool_config.last_update_timestamp = Clock::get()?.unix_timestamp;
        pool_config.bump_pool = *ctx.bumps.get("pool_config").ok_or(${programName.charAt(0).toUpperCase() + programName.slice(1)}Error::DefaultError)?;
        pool_config.bump_vault = *ctx.bumps.get("reward_vault").ok_or(${programName.charAt(0).toUpperCase() + programName.slice(1)}Error::DefaultError)?;

        msg!("Staking pool initialized. Stake: {}, Reward: {}", pool_config.stake_token_mint, pool_config.reward_token_mint);
        Ok(())
    }

    // Placeholder for stake_tokens instruction
    pub fn stake_tokens(ctx: Context<StakeTokens>, amount: u64) -> Result<()> {
        // TODO: Implement staking logic
        // 1. Update pool_config.total_staked_amount
        // 2. Transfer stake_tokens from user to a pool vault (or just track in UserStakeInfo)
        // 3. Create/Update UserStakeInfo for the user
        // 4. Handle reward accumulation logic updates
        msg!("User {} staked {} tokens.", ctx.accounts.user.key(), amount);
        Ok(())
    }

    // Placeholder for unstake_tokens instruction
    pub fn unstake_tokens(ctx: Context<UnstakeTokens>, amount: u64) -> Result<()> {
        // TODO: Implement unstaking logic
        // 1. Check lockup_duration_seconds
        // 2. Calculate and distribute pending rewards
        // 3. Transfer stake_tokens back to user
        // 4. Update UserStakeInfo and pool_config
        msg!("User {} unstaked {} tokens.", ctx.accounts.user.key(), amount);
        Ok(())
    }

    // Placeholder for claim_rewards instruction
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        // TODO: Implement reward claiming logic
        // 1. Calculate rewards owed based on UserStakeInfo and pool_config.reward_rate_per_second
        // 2. Transfer rewards from reward_vault to user
        // 3. Update UserStakeInfo (last_claimed_time, rewards_owed)
        msg!("User {} claimed rewards.", ctx.accounts.user.key());
        Ok(())
    }
`
      accountsStructs += `
#[derive(Accounts)]
pub struct InitializeStakingPool<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init, payer = admin,
        seeds = [b"pool_config_v1".as_ref(), stake_token_mint.key().as_ref(), reward_token_mint.key().as_ref()], bump,
        space = 8 + PoolConfig::LEN
    )]
    pub pool_config: Account<'info, PoolConfig>,
    pub stake_token_mint: Account<'info, Mint>, // Mint for the token to be staked
    pub reward_token_mint: Account<'info, Mint>, // Mint for the reward token
    #[account(
        init, payer = admin,
        token::mint = reward_token_mint,
        token::authority = pool_config, // PDA is authority over the vault
        seeds = [b"reward_vault_v1".as_ref(), pool_config.key().as_ref()], bump,
    )]
    pub reward_vault: Account<'info, TokenAccount>, // PDA to hold reward tokens
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut, associated_token::mint = pool_config.stake_token_mint, associated_token::authority = user)]
    pub user_stake_token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"pool_config_v1".as_ref(), pool_config.stake_token_mint.as_ref(), pool_config.reward_token_mint.as_ref()], bump = pool_config.bump_pool)]
    pub pool_config: Account<'info, PoolConfig>,
    // Optional: A PDA to hold staked tokens, or manage in UserStakeInfo
    // #[account(init_if_needed, payer = user, token::mint = pool_config.stake_token_mint, token::authority = pool_config, seeds = [b"stake_vault_v1", pool_config.key().as_ref()], bump)]
    // pub pool_stake_vault: Account<'info, TokenAccount>,
    #[account(init_if_needed, payer = user, space = 8 + UserStakeInfo::LEN, seeds = [b"user_stake_v1".as_ref(), user.key().as_ref(), pool_config.key().as_ref()], bump)]
    pub user_stake_info: Account<'info, UserStakeInfo>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}
// Define UnstakeTokens and ClaimRewards Accounts similarly
#[derive(Accounts)] pub struct UnstakeTokens<'info> { /* ... */ pub user: Signer<'info>, /* ... */ }
#[derive(Accounts)] pub struct ClaimRewards<'info> { /* ... */ pub user: Signer<'info>, /* ... */ }
`
      stateStructs += `
#[account]
pub struct PoolConfig {
    pub admin: Pubkey,
    pub stake_token_mint: Pubkey,
    pub reward_token_mint: Pubkey,
    pub reward_vault: Pubkey,
    pub reward_rate_per_second: u64,
    pub lockup_duration_seconds: i64,
    pub total_staked_amount: u64,
    pub last_update_timestamp: i64,
    pub bump_pool: u8,
    pub bump_vault: u8,
}
impl PoolConfig { const LEN: usize = 32*4 + 8*4 + 1*2 + 8; } // Added padding

#[account]
pub struct UserStakeInfo {
    pub user: Pubkey, // Staker's public key
    pub pool_config: Pubkey, // Reference to the pool
    pub amount_staked: u64,
    pub stake_timestamp: i64,
    pub last_claimed_timestamp: i64,
    // pub rewards_debt: u64, // For more complex reward calculations
    pub bump: u8,
}
impl UserStakeInfo { const LEN: usize = 32*2 + 8*3 + 1 + 8; } // Added padding
`
    } else {
      // Default basic program if no specific features detected
      programName = "my_generic_solana_program"
      instructions += `
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.my_account.data = data;
        msg!("Generic program initialized with data: {}!", data);
        Ok(())
    }
`
      accountsStructs += `
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)] // 8 for discriminator, 8 for u64
    pub my_account: Account<'info, MyAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
`
      stateStructs += `
#[account]
pub struct MyAccount {
    pub data: u64,
}
`
    }

    programMod += instructions
    programMod += "}\n" // Close #[program] mod

    let finalRustCode =
      imports + "\n" + declareId + "\n" + programMod + "\n" + accountsStructs + "\n" + stateStructs + "\n" + errorEnum

    if (enableAIVal && aiInstructionVal) {
      finalRustCode = `
// AI Enhanced Code for Solana
// AI Instruction: ${aiInstructionVal}
// Original Prompt: ${promptString}
// --- Base Generated Code ---
${finalRustCode}

// --- AI Enhancements (Conceptual) ---
// TODO: Integrate AI suggestions based on the instruction.
// This might involve adding new instructions, modifying existing ones,
// or adding checks and balances based on the AI's understanding of the utility.
// For example, if AI instruction is "add role-based access control",
// the AI might suggest adding admin checks to certain instructions or new state for roles.
`
    }
    return finalRustCode
  } else {
    // Non-Solana chains (e.g., EVM - basic placeholder)
    const contractSuffix = selectedChainVal === "base" ? "Base" : selectedChainVal === "ethereum" ? "Eth" : "Contract"
    const tokenName = lowerPrompt.match(/token\s+named\s+(\w+)/)?.[1] || "MyToken"
    const tokenSymbol = lowerPrompt.match(/symbol\s+(\w+)/)?.[1] || "MYT"
    const totalSupply = lowerPrompt.match(/supply\s+of\s+([\d,]+)/)?.[1]?.replace(/,/g, "") || "1000000"
    const decimals = lowerPrompt.match(/(\d+)\s+decimals/)?.[1] || "18"

    let baseCode = `// Chain: ${selectedChainVal}
// Code for: ${promptString}
// Program Name: ${programName}
// Generation Timestamp: ${new Date().toISOString()}
`

    if (selectedChainVal === "base" || selectedChainVal === "ethereum") {
      baseCode += `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${tokenName}${contractSuffix} is ERC20, Ownable {
    constructor() ERC20("${tokenName}", "${tokenSymbol}") Ownable(msg.sender) {
        _mint(msg.sender, ${totalSupply} * (10 ** ${decimals}));
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Add other ${selectedChainVal}-specific logic here based on prompt
}
`
    } else {
      baseCode += `
// Basic structure for ${selectedChainVal}
// Further implementation needed based on specific chain features.
pub fn main() { 
    println!("Hello from ${programName} on ${selectedChainVal}");
    println!("Prompt: ${promptString}");
}
`
    }

    if (enableAIVal && aiInstructionVal) {
      return `
// AI Enhanced Code for ${selectedChainVal}
// AI Instruction: ${aiInstructionVal}
// Original Prompt: ${promptString}
// --- Base Generated Code ---
${baseCode}
// --- AI Enhancements (Conceptual) ---
// TODO: Integrate AI suggestions.
`
    }
    return baseCode
  }
}

// generateLogicBreakdownForDisplay, generateSuggestionsForDisplay, generateTokenomicsForDisplay, PromptScoring
// remain unchanged from the previous version as they were not the source of this specific bug.
// For brevity, I'm omitting them here, but they should be the same as in the previous correct version.

export function generateLogicBreakdownForDisplay(
  prompt: string,
  enableAI: boolean,
  chain: string,
  aiInstruction?: string,
): any {
  // Return type 'any' for brevity, should be structured object
  const lowerPrompt = prompt.toLowerCase()
  const features: string[] = []
  const purpose = `This program, based on '${prompt}'${enableAI ? ` with AI enhancements for '${aiInstruction}'` : ""}, aims to implement:`

  if (lowerPrompt.includes("token") || lowerPrompt.includes("coin")) features.push("Token Creation/Management")
  if (lowerPrompt.includes("vesting")) features.push("Token Vesting Schedule")
  if (lowerPrompt.includes("staking")) features.push("Staking Pool Logic")
  if (features.length === 0) features.push("General Smart Contract Logic")

  const components = [
    {
      name: "Initialization",
      description: "Sets up the initial state of the program, potentially creating mints or configuring parameters.",
    },
  ]
  if (lowerPrompt.includes("vesting")) {
    components.push({ name: "InitializeVesting", description: "Creates a new vesting schedule for a beneficiary." })
    components.push({
      name: "ClaimTokens (Vesting)",
      description: "Allows a beneficiary to claim their vested tokens.",
    })
  }
  if (lowerPrompt.includes("token") && !lowerPrompt.includes("vesting") && !lowerPrompt.includes("staking")) {
    components.push({
      name: "InitializeTokenMint",
      description: "Creates a new SPL token mint and mints initial supply.",
    })
  }
  if (lowerPrompt.includes("staking")) {
    components.push({ name: "InitializeStakingPool", description: "Sets up the parameters for a new staking pool." })
    components.push({ name: "StakeTokens", description: "Allows users to deposit tokens into the staking pool." })
    components.push({
      name: "UnstakeTokens",
      description: "Allows users to withdraw their staked tokens and accrued rewards.",
    })
    components.push({ name: "ClaimRewards (Staking)", description: "Allows users to claim rewards without unstaking." })
  }

  return {
    purpose: `${purpose} ${features.join(", ")}.`,
    fileName: chain === "solana" ? "lib.rs" : "main.contract",
    framework: chain === "solana" ? "Anchor (Solana)" : chain,
    components: components,
    notes:
      "This is an auto-generated interpretation. Review all generated code, especially security aspects and PDA derivations, before deployment. Replace placeholder Program IDs.",
    aiNotes:
      enableAI && aiInstruction
        ? `AI will attempt to integrate '${aiInstruction}' by potentially adding new functions or modifying existing logic.`
        : "AI integration not active or no specific utility described.",
  }
}

export function generateSuggestionsForDisplay(
  prompt: string,
  enableAI: boolean,
  chain: string,
  aiInstruction?: string,
): any[] {
  // Return type 'any[]' for brevity
  const suggestions = []
  const lowerPrompt = prompt.toLowerCase()

  if (chain === "solana") {
    suggestions.push({
      title: "Replace Placeholder Program ID",
      description: "After building and deploying the program, update the `declare_id!` macro with your new Program ID.",
      severity: "critical",
    })
    suggestions.push({
      title: "PDA Seed Review",
      description:
        "Carefully review all PDA (Program Derived Address) seeds and bump usage for correctness and security, especially for vaults and state accounts.",
      severity: "warning",
    })
    suggestions.push({
      title: "Account Space Allocation",
      description:
        "Ensure `space = 8 + YourStruct::LEN` is correctly calculated for all initialized accounts to prevent runtime errors. Add some padding for future upgrades.",
      severity: "warning",
    })
  }

  if (lowerPrompt.includes("token") && !lowerPrompt.includes("decimals")) {
    suggestions.push({
      title: "Specify Token Decimals",
      description:
        "Clearly state the number of decimals for your token (e.g., '9 decimals for an SPL token'). This is vital for its representation.",
      severity: "warning",
    })
  }

  if (lowerPrompt.includes("staking") && !lowerPrompt.includes("reward calculation")) {
    suggestions.push({
      title: "Detail Reward Calculation for Staking",
      description:
        "Specify how staking rewards should be calculated (e.g., fixed rate per second, dynamic based on total staked, etc.) for more accurate code.",
      severity: "info",
    })
  }
  if (lowerPrompt.includes("vesting") && !lowerPrompt.includes("transferability")) {
    suggestions.push({
      title: "Vested Token Transferability",
      description:
        "Consider if vested tokens (or the vesting schedule itself) should be transferable before full vesting.",
      severity: "info",
    })
  }

  if (enableAI && aiInstruction) {
    suggestions.push({
      title: "AI Utility Specifics",
      description: `For the AI utility '${aiInstruction}', ensure the prompt clearly defines triggers, expected inputs/outputs, and any state changes the AI should manage.`,
      severity: "info",
    })
  } else if (enableAI && !aiInstruction) {
    suggestions.push({
      title: "Describe AI Utility",
      description:
        "AI integration is enabled. Use the 'AI Protocol Integration' section to describe the specific utility you want the AI to implement.",
      severity: "warning",
    })
  }

  if (suggestions.length === 0) {
    suggestions.push({
      title: "General Security Audit",
      description:
        "Always perform a thorough security audit on any smart contract before deploying to a live environment with real assets.",
      severity: "critical",
    })
  }
  return suggestions
}

export interface TokenomicsRule {
  id: string
  text: string
  type: "rule" | "warning"
}
export interface TokenomicsWarning {
  id: string
  text: string
  severity: "critical" | "warning" | "info"
}
export interface TokenomicsData {
  name: string
  symbol: string
  totalSupply: string
  decimals?: string // Added decimals
  mintAuthorityRevoked: boolean
  rules: TokenomicsRule[]
  warnings: TokenomicsWarning[]
  governance: string
  [key: string]: any
}

export function generateTokenomicsForDisplay(
  prompt: string,
  enableAI: boolean,
  chain: string,
  aiInstruction?: string,
): TokenomicsData {
  const lowerPrompt = prompt.toLowerCase()
  const rules: TokenomicsRule[] = []
  const warnings: TokenomicsWarning[] = []

  const nameMatch = lowerPrompt.match(/(?:token|named)\s+([A-Za-z0-9_]+)/)
  const symbolMatch = lowerPrompt.match(/symbol\s+([A-Z]{1,5})/)
  const supplyMatch = lowerPrompt.match(/supply\s+of\s+([\d,]+)/)
  const decimalsMatch = lowerPrompt.match(/(\d+)\s+decimals/)

  const tokenName = nameMatch ? nameMatch[1] : "Not Specified"
  const tokenSymbol = symbolMatch ? symbolMatch[1] : "N/S"
  const totalSupply = supplyMatch ? supplyMatch[1] : "Not Specified"
  const tokenDecimals = decimalsMatch ? decimalsMatch[1] : chain === "solana" ? "9" : "18" // Default based on chain

  rules.push({ id: "name", text: `Token Name: ${tokenName}`, type: "rule" })
  rules.push({ id: "symbol", text: `Token Symbol: ${tokenSymbol}`, type: "rule" })
  rules.push({ id: "supply", text: `Total Supply: ${totalSupply} (Decimals: ${tokenDecimals})`, type: "rule" })

  if (tokenName === "Not Specified" && lowerPrompt.includes("token"))
    warnings.push({ id: "no-name", text: "Token name not clearly specified.", severity: "warning" })
  if (tokenSymbol === "N/S" && lowerPrompt.includes("token"))
    warnings.push({ id: "no-symbol", text: "Token symbol not clearly specified.", severity: "warning" })
  if (totalSupply === "Not Specified" && lowerPrompt.includes("token"))
    warnings.push({ id: "no-supply", text: "Total supply not specified.", severity: "critical" })
  if (!decimalsMatch && lowerPrompt.includes("token"))
    warnings.push({
      id: "no-decimals",
      text: `Token decimals not specified, defaulting to ${tokenDecimals}.`,
      severity: "info",
    })

  const mintAuthorityRevoked =
    lowerPrompt.includes("mint authority revoked") ||
    lowerPrompt.includes("fixed supply") ||
    lowerPrompt.includes("no minting")
  rules.push({
    id: "mint-auth",
    text: `Mint Authority: ${mintAuthorityRevoked ? "Revoked (Fixed Supply)" : "Active (Can Mint More)"}`,
    type: "rule",
  })

  if (lowerPrompt.includes("burn on transfer"))
    rules.push({ id: "burn-transfer", text: "Burn on Transfer: Enabled", type: "rule" })

  let governance = "Standard (Admin Key / Owner Controlled)"
  if (lowerPrompt.includes("dao token") || lowerPrompt.includes("governance token"))
    governance = "DAO / Governance Token"
  else if (lowerPrompt.includes("multisig control")) governance = "Multisig Controlled"
  rules.push({ id: "gov-type", text: `Governance Model: ${governance}`, type: "rule" })

  if (enableAI && aiInstruction) {
    rules.push({ id: "ai-utility", text: `AI Utility: '${aiInstruction}' to be integrated.`, type: "rule" })
    warnings.push({
      id: "ai-impact",
      text: "AI integration will influence contract logic and potentially tokenomics.",
      severity: "info",
    })
  }

  return {
    name: tokenName,
    symbol: tokenSymbol,
    totalSupply: totalSupply,
    decimals: tokenDecimals,
    mintAuthorityRevoked: mintAuthorityRevoked,
    rules: rules,
    warnings: warnings,
    governance: governance,
  }
}

export class PromptScoring {
  clarity: number
  risk: "Low" | "Medium" | "High"
  complexity: "Beginner" | "Intermediate" | "Advanced"
  detectedFeatures: string[]

  constructor(clarity: number, riskScore: number, complexityScore: number, detectedFeatures: string[] = []) {
    this.clarity = Math.max(0, Math.min(10, clarity))
    const riskMap = ["Low", "Medium", "High"] as const
    this.risk = riskMap[Math.max(0, Math.min(2, riskScore))]
    const complexityMap = ["Beginner", "Intermediate", "Advanced"] as const
    this.complexity = complexityMap[Math.max(0, Math.min(2, complexityScore))]
    this.detectedFeatures = detectedFeatures
  }
}
