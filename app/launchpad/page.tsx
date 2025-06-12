"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
// Corrected: Use named import for SynthFiHeader
import { SynthFiHeader } from "@/components/synthfi-header"
import { SynthFiFooter } from "@/components/synthfi-footer"
import { LaunchpadStepper } from "@/components/launchpad/launchpad-stepper"
import { ReviewAuditStep } from "@/components/launchpad/review-audit-step"
import { TokenDetailsStep } from "@/components/launchpad/token-details-step"
import { DeployContractStep } from "@/components/launchpad/deploy-contract-step"
import { AddLiquidityStep } from "@/components/launchpad/add-liquidity-step"
import { LaunchSummaryStep } from "@/components/launchpad/launch-summary-step"
import type { TemplateLaunchConfig, RemixLaunchConfig } from "@/components/templates/template-types"

const BASE_INITIAL_CONTRACT_DATA = {
  name: "",
  symbol: "",
  description: "",
  image: "",
  website: "",
  twitter: "",
  telegram: "",
  documentation: "",
  contractId: "",
  poolAddress: "",
  hasIssues: true,
  issues: ["Missing withdraw function", "Unchecked math operations", "Unlimited mint authority"],
  totalSupply: "Unlimited",
  mintAuthorityRevoked: false,
  aiIntegration: false,
  aiDescription: "",
  aiCost: 0,
  aiTemplate: "",
  tokenDecimals: 9,
}

export default function LaunchpadPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [prompt, setPrompt] = useState("Create a custom token")
  const [aiPrompt, setAiPrompt] = useState("")
  const [enableAI, setEnableAI] = useState(false)
  const [aiTemplate, setAiTemplate] = useState("")
  const [contractData, setContractData] = useState({ ...BASE_INITIAL_CONTRACT_DATA })
  const [walletConnected, setWalletConnected] = useState(false)

  const searchParamsString = searchParams?.toString()

  useEffect(() => {
    let determinedPrompt = "Create a custom token"
    let determinedAiPrompt = ""
    let determinedEnableAI = false
    let determinedAiTemplate = ""
    let determinedContractData = { ...BASE_INITIAL_CONTRACT_DATA }

    const fromTemplateConfig = searchParams?.get("fromTemplateConfig") === "true"
    const fromRemixConfig = searchParams?.get("fromRemix") === "true"
    let templateConfig: TemplateLaunchConfig | null = null
    let remixConfig: RemixLaunchConfig | null = null

    if (fromTemplateConfig) {
      try {
        const storedConfig = localStorage.getItem("synthfi_template_launch_config")
        if (storedConfig) {
          templateConfig = JSON.parse(storedConfig) as TemplateLaunchConfig
          localStorage.removeItem("synthfi_template_launch_config")
        }
      } catch (e) {
        console.error("Failed to load template config from localStorage:", e)
      }
    } else if (fromRemixConfig) {
      try {
        const storedConfig = localStorage.getItem("synthfi_remix_launch_config")
        if (storedConfig) {
          remixConfig = JSON.parse(storedConfig) as RemixLaunchConfig
          localStorage.removeItem("synthfi_remix_launch_config")
        }
      } catch (e) {
        console.error("Failed to load remix config from localStorage:", e)
      }
    }

    if (templateConfig) {
      determinedPrompt = templateConfig.customizedPrompt
      determinedEnableAI = templateConfig.enableAI
      if (templateConfig.enableAI) {
        determinedAiPrompt = templateConfig.customAIInstruction || ""
      }
      determinedAiTemplate = templateConfig.templateId

      determinedContractData = {
        ...BASE_INITIAL_CONTRACT_DATA,
        name: templateConfig.tokenName || templateConfig.originalTemplateData.defaultTokenName || "",
        symbol: templateConfig.tokenSymbol || templateConfig.originalTemplateData.defaultTokenSymbol || "",
        description: templateConfig.originalTemplateData.description || "",
        aiIntegration: templateConfig.enableAI,
        aiDescription: templateConfig.enableAI
          ? templateConfig.customAIInstruction || templateConfig.originalTemplateData.aiInstruction || ""
          : "",
        aiCost: templateConfig.enableAI ? 50 : 0,
        aiTemplate: templateConfig.templateId,
        tokenDecimals:
          templateConfig.tokenDecimals !== undefined
            ? templateConfig.tokenDecimals
            : templateConfig.originalTemplateData.defaultDecimals !== undefined
              ? templateConfig.originalTemplateData.defaultDecimals
              : BASE_INITIAL_CONTRACT_DATA.tokenDecimals,
        hasIssues: true,
        issues: [...BASE_INITIAL_CONTRACT_DATA.issues],
      }
      if (determinedPrompt.toLowerCase().includes("staking")) {
        determinedContractData.issues = ["Missing withdraw function", "No emergency withdrawal"]
      } else if (determinedPrompt.toLowerCase().includes("vesting")) {
        determinedContractData.issues = []
        determinedContractData.hasIssues = false
      }
    } else if (remixConfig) {
      determinedPrompt = remixConfig.customizedPrompt
      determinedEnableAI = remixConfig.enableAI
      if (remixConfig.enableAI) {
        determinedAiPrompt = remixConfig.aiInstruction || ""
      }
      determinedAiTemplate = ""

      determinedContractData = {
        ...BASE_INITIAL_CONTRACT_DATA,
        name: remixConfig.projectName || "",
        symbol: remixConfig.tokenSymbol || "",
        description:
          remixConfig.originalTemplateData?.description ||
          `Remixed from: ${remixConfig.originalPrompt.substring(0, 50)}...`,
        aiIntegration: remixConfig.enableAI,
        aiDescription: remixConfig.enableAI ? remixConfig.aiInstruction || "" : "",
        aiCost: remixConfig.enableAI ? 50 : 0,
        aiTemplate: "",
        tokenDecimals:
          remixConfig.tokenDecimals !== undefined
            ? remixConfig.tokenDecimals
            : BASE_INITIAL_CONTRACT_DATA.tokenDecimals,
        hasIssues: true,
        issues: [...BASE_INITIAL_CONTRACT_DATA.issues],
      }
      if (determinedPrompt.toLowerCase().includes("staking")) {
        determinedContractData.issues = ["Missing withdraw function", "No emergency withdrawal"]
      } else if (determinedPrompt.toLowerCase().includes("vesting")) {
        determinedContractData.issues = []
        determinedContractData.hasIssues = false
      }
    } else {
      const promptParam = searchParams?.get("prompt")
      const aiPromptParam = searchParams?.get("aiPrompt")
      const enableAIParamQuery = searchParams?.get("enableAI") === "true"
      const aiTemplateParam = searchParams?.get("aiTemplate")

      if (promptParam) {
        determinedPrompt = promptParam
      }
      if (aiPromptParam) {
        determinedAiPrompt = aiPromptParam
        determinedEnableAI = true
      }
      if (enableAIParamQuery) {
        determinedEnableAI = enableAIParamQuery
      }
      if (aiTemplateParam) {
        determinedAiTemplate = aiTemplateParam
      }

      determinedContractData = { ...BASE_INITIAL_CONTRACT_DATA }
      if (determinedPrompt.toLowerCase().includes("staking")) {
        determinedContractData.issues = ["Missing withdraw function", "No emergency withdrawal"]
        determinedContractData.hasIssues = true
      } else if (determinedPrompt.toLowerCase().includes("vesting")) {
        determinedContractData.issues = []
        determinedContractData.hasIssues = false
      }

      if (determinedEnableAI) {
        determinedContractData = {
          ...determinedContractData,
          aiIntegration: true,
          aiDescription: determinedAiPrompt,
          aiCost: 50,
          aiTemplate: determinedAiTemplate,
        }
      }
    }

    setPrompt(determinedPrompt)
    setAiPrompt(determinedAiPrompt)
    setEnableAI(determinedEnableAI)
    setAiTemplate(determinedAiTemplate)
    setContractData(determinedContractData)
  }, [searchParamsString])

  const handleFixIssues = () => {
    setContractData((prevData) => ({
      ...prevData,
      hasIssues: false,
      issues: [],
    }))
  }

  const handleUpdateTokenDetails = (details: any) => {
    setContractData((prevData) => ({
      ...prevData,
      ...details,
    }))
    setCurrentStep(3)
  }

  const handleDeployContract = () => {
    const contractId = "Synth" + Math.random().toString(36).substring(2, 10)
    setContractData((prevData) => ({
      ...prevData,
      contractId,
    }))
    setCurrentStep(4)
  }

  const handleAddLiquidity = (amount: string, tokenAmount: string, pair: string) => {
    const poolAddress = "Pool" + Math.random().toString(36).substring(2, 10)
    setContractData((prevData) => ({
      ...prevData,
      poolAddress,
    }))

    const newlyLaunchedTokenInfo = {
      id: contractData.contractId || "temp-id-" + Date.now(),
      name: contractData.name || "Unnamed Token",
      symbol: contractData.symbol || "TKN",
      description: contractData.description || "A new token launched with SynthFi.",
      logoUrl: contractData.image || "/placeholder.svg?height=100&width=100",
      contractAddress: contractData.contractId,
      totalSupply: contractData.totalSupply,
      decimals: contractData.tokenDecimals,
      prompt: prompt,
      aiIntegration: enableAI,
      aiTemplate: aiTemplate,
      aiDescription: aiPrompt,
    }
    localStorage.setItem(`synthfi-token-${newlyLaunchedTokenInfo.id}`, JSON.stringify(newlyLaunchedTokenInfo))

    const simulatedToken = {
      id: contractData.contractId || "temp-id-" + Date.now(),
      name: contractData.name || "Unnamed Token",
      symbol: contractData.symbol || "TOKEN",
      logo: contractData.image || "/placeholder.svg?height=300&width=500",
      marketCap: (Number(amount) || 0) * (Number(tokenAmount) || 0) * 2,
      price: (Number(tokenAmount) || 0) > 0 ? (Number(amount) || 0) / (Number(tokenAmount) || 1) : 0,
      launchDate: new Date().toISOString(),
      contractAddress: contractData.contractId,
      isVerified: false,
      isTrending: false,
      category: enableAI ? "AI" : "GOV",
      description: contractData.description || "A token created with SynthFi",
      website: contractData.website,
      twitter: contractData.twitter,
      github: null,
      creatorWallet: "simulated-wallet-" + Math.random().toString(36).substring(2, 10),
      tokenomics: {
        maxSupply: contractData.totalSupply === "Unlimited" ? "Unlimited" : contractData.totalSupply,
        mintAuthorityRevoked: contractData.mintAuthorityRevoked,
        transferRules: "No burn, no pause",
        vestingInfo: "None",
        auditResult: contractData.hasIssues ? "Issues fixed before deployment" : "No issues found",
      },
      prompt: prompt,
      aiIntegration: enableAI,
      aiTemplate: aiTemplate,
      aiDescription: aiPrompt,
      simulated: true,
      liquiditySOL: amount,
      liquidityTokens: tokenAmount,
      liquidityPair: pair,
    }
    localStorage.setItem("currentSimulatedToken", JSON.stringify(simulatedToken))
    setCurrentStep(5)
  }

  const connectWallet = () => setWalletConnected(true)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <SynthFiHeader />
      <main className="flex-1 py-12">
        <div className="max-w-screen-lg mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Deploy to Launchpad</h1>
          <LaunchpadStepper currentStep={currentStep} enableAI={enableAI} />
          <div className="mt-12">
            {currentStep === 1 && (
              <ReviewAuditStep
                prompt={prompt}
                aiPrompt={aiPrompt}
                enableAI={enableAI}
                contractData={contractData}
                onFixIssues={handleFixIssues}
                onContinue={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 2 && (
              <TokenDetailsStep contractData={contractData} onContinue={handleUpdateTokenDetails} />
            )}
            {currentStep === 3 && (
              <DeployContractStep
                contractData={contractData}
                walletConnected={walletConnected}
                onConnectWallet={connectWallet}
                onDeploy={handleDeployContract}
              />
            )}
            {currentStep === 4 && <AddLiquidityStep contractData={contractData} onAddLiquidity={handleAddLiquidity} />}
            {currentStep === 5 && <LaunchSummaryStep contractData={contractData} />}
          </div>
        </div>
      </main>
      <SynthFiFooter />
    </div>
  )
}
