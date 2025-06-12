// lib/ai-feedback-engine.ts

export type AIFeedbackAction = {
  type: "append" | "replace"
  value: string
}

export type AIFeedbackSegment = {
  text: string
  action?: AIFeedbackAction
}

export type AIPromptFeedbackType = {
  type: "suggestion" | "success"
  message: string | AIFeedbackSegment[]
} | null

export const generateAIInstructionFeedback = (currentPrompt: string): AIPromptFeedbackType => {
  const lowerPrompt = currentPrompt.toLowerCase().trim()

  if (!lowerPrompt) return null

  if (lowerPrompt.length < 20 && !lowerPrompt.includes(" ")) {
    return {
      type: "suggestion",
      message: [
        { text: "This is very brief. Try to describe the AI's role. For example: " },
        {
          text: "'AI to analyze transactions'",
          action: { type: "append", value: " AI to analyze transaction patterns for anomalies" },
        },
        { text: " or " },
        {
          text: "'AI to predict prices'",
          action: { type: "append", value: " AI to predict token prices based on market data" },
        },
        { text: "." },
      ],
    }
  }

  const genericPhrases = [
    "add ai",
    "use ai",
    "ai for contract",
    "ai for results",
    "enhance with ai",
    "ai to help",
    "make it better with ai",
    "ai integration",
    "ai feature",
    "integrate ai",
    "enhance capabilities",
    "ai to enhance capabilities",
  ]
  const actionVerbs = [
    "predict",
    "analyze",
    "monitor",
    "adjust",
    "integrate",
    "automate",
    "optimize",
    "detect",
    "manage",
    "control",
    "identify",
    "recommend",
    "generate",
    "learn",
    "suggest",
    "forecast",
  ]

  const isVeryGeneric = genericPhrases.some((phrase) => lowerPrompt.includes(phrase)) && lowerPrompt.length < 70
  const hasSpecificActionVerb = actionVerbs.some((verb) => lowerPrompt.includes(verb))

  if (isVeryGeneric && !hasSpecificActionVerb) {
    return {
      type: "suggestion",
      message: [
        { text: "This is a bit vague. Try specifying what the AI should do. For example, AI to: " },
        { text: "predict outcomes", action: { type: "append", value: " predict [specific outcomes]" } },
        { text: ", " },
        { text: "analyze data", action: { type: "append", value: " analyze [specific data]" } },
        { text: ", or " },
        { text: "automate tasks", action: { type: "append", value: " automate [specific tasks]" } },
        { text: "." },
      ],
    }
  }

  if (!hasSpecificActionVerb && lowerPrompt.length > 20) {
    return {
      type: "suggestion",
      message: [
        { text: "Consider using an action verb to clarify the AI's function. Such as: " },
        ...actionVerbs
          .slice(0, 3)
          .flatMap((verb, index, arr) => [
            { text: `'${verb}'`, action: { type: "append", value: ` ${verb} ` } },
            { text: index < arr.length - 1 ? ", " : "" },
          ])
          .slice(0, -1), // remove last empty text
        { text: " or " },
        { text: `'optimize'`, action: { type: "append", value: ` optimize ` } },
        { text: "." },
      ],
    }
  }

  if (lowerPrompt.includes("enhance the capabilities") && !hasSpecificActionVerb) {
    return {
      type: "suggestion",
      message: [
        { text: "To 'enhance capabilities', what specific capability should AI improve? E.g., " },
        {
          text: "improve security by detecting threats",
          action: { type: "append", value: " improve security by detecting potential threats" },
        },
        { text: " or " },
        {
          text: "optimize resource usage",
          action: { type: "append", value: " optimize resource usage based on [criteria]" },
        },
        { text: "." },
      ],
    }
  }

  if (
    (lowerPrompt.includes("market") || lowerPrompt.includes("price")) &&
    !lowerPrompt.includes("oracle") &&
    !lowerPrompt.includes("feed") &&
    !lowerPrompt.includes("data source")
  ) {
    return {
      type: "suggestion",
      message: [
        { text: "When mentioning market data or prices, consider specifying the " },
        { text: "data source", action: { type: "append", value: " using a [specify oracle/data source]" } },
        { text: " (e.g., 'using a price oracle')." },
      ],
    }
  }
  if (
    lowerPrompt.includes("user behavior") &&
    !lowerPrompt.includes("data") &&
    !lowerPrompt.includes("track") &&
    !lowerPrompt.includes("monitor")
  ) {
    return {
      type: "suggestion",
      message: [
        { text: "For 'user behavior' analysis, how should the AI " },
        {
          text: "access or track this data",
          action: { type: "append", value: " by tracking [specific on-chain/off-chain data]" },
        },
        { text: "?" },
      ],
    }
  }

  if (hasSpecificActionVerb && lowerPrompt.length > 25 && lowerPrompt.length < 75) {
    const verb = actionVerbs.find((v) => lowerPrompt.includes(v)) || "perform its function"
    return {
      type: "suggestion",
      message: [
        { text: `Good use of '${verb}'! Can you add more details? For example, specify the ` },
        { text: "data inputs", action: { type: "append", value: ` using [specific data inputs] ` } },
        { text: ", " },
        { text: "expected outputs", action: { type: "append", value: ` to produce [expected outputs] ` } },
        { text: ", or the " },
        { text: "context", action: { type: "append", value: ` within the context of [specific scenario] ` } },
        { text: "?" },
      ],
    }
  }

  if (lowerPrompt.length >= 75 && hasSpecificActionVerb) {
    return { type: "success", message: "AI instruction looks reasonably specific and actionable." }
  }

  return {
    type: "suggestion",
    message: [
      { text: "Consider adding more specific details to ensure the AI understands the task. For example, what " },
      {
        text: "problem should it solve",
        action: { type: "append", value: " solve the problem of [problem description]" },
      },
      { text: " or what " },
      { text: "value should it add", action: { type: "append", value: " add value by [value proposition]" } },
      { text: "?" },
    ],
  }
}

// New function to generate contract explanation
export async function generateContractExplanation(code: string): Promise<string> {
  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

  let summary = "This Anchor program appears to be a "
  const functions: string[] = []
  const safetyConsiderations = [
    "Ensure all arithmetic operations are checked for overflow/underflow.",
    "Validate all account inputs thoroughly, especially signer privileges and account ownership.",
    "Consider access control for sensitive functions.",
    "Be mindful of reentrancy attacks if calling external programs.",
    "Test thoroughly on devnet and testnet before deploying to mainnet.",
  ]

  if (code.includes("initialize_mint") && code.includes("spl_token")) {
    summary += "token creation contract. It likely initializes a new SPL token mint."
  } else if (code.includes("VestingSchedule") && code.includes("release")) {
    summary += "token vesting contract. It manages the release of tokens over a defined schedule."
  } else if (code.includes("stake") && code.includes("unstake") && (code.includes("reward") || code.includes("pool"))) {
    summary += "staking contract. Users can likely stake tokens to earn rewards."
  } else if (code.includes("#[program]")) {
    summary += "generic Solana smart contract using the Anchor framework."
  } else {
    summary = "This does not appear to be a standard Anchor program. The explanation might be limited."
  }

  // Basic function extraction (very naive, for mock purposes)
  const functionRegex = /pub fn (\w+)\s*\(/g
  let match
  while ((match = functionRegex.exec(code)) !== null) {
    functions.push(match[1])
  }

  let explanation = `## AI Code Explanation\n\n`
  explanation += `### Summary of Contract Purpose:\n${summary}\n\n`

  if (functions.length > 0) {
    explanation += `### Function-Level Explanations (Detected Functions):\n`
    functions.forEach((fn) => {
      explanation += `- **${fn}**: `
      if (fn.startsWith("initialize") || fn.startsWith("init_")) {
        explanation += `Likely responsible for setting up initial state or accounts for the contract or a specific feature.`
      } else if (fn.includes("mint")) {
        explanation += `Probably handles the creation of new tokens.`
      } else if (fn.includes("transfer")) {
        explanation += `Likely facilitates the movement of tokens or assets between accounts.`
      } else if (fn.includes("stake")) {
        explanation += `Allows users to deposit tokens into the contract, usually for earning rewards.`
      } else if (fn.includes("unstake") || fn.includes("withdraw")) {
        explanation += `Enables users to retrieve their deposited tokens.`
      } else if (fn.includes("claim") || fn.includes("harvest")) {
        explanation += `Allows users to collect accrued rewards or benefits.`
      } else if (fn.includes("vest") || fn.includes("release")) {
        explanation += `Manages the distribution of tokens according to a vesting schedule.`
      } else {
        explanation += `A custom function. Its specific purpose would require deeper analysis of its implementation.`
      }
      explanation += `\n`
    })
    explanation += `\n`
  } else {
    explanation += `### Function-Level Explanations:\nNo public functions were easily identifiable with basic parsing. A more detailed analysis is needed.\n\n`
  }

  explanation += `### Safety Considerations & Best Practices:\n`
  safetyConsiderations.forEach((consideration) => {
    explanation += `- ${consideration}\n`
  })
  explanation += `\n**Note:** This is an automated explanation and may not capture all nuances. Always perform a thorough manual audit for production contracts.`

  return explanation
}
