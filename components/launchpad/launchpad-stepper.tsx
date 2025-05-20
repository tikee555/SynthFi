"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card } from "@/components/ui/card"
import { CodeGenerationStep } from "@/components/launchpad/steps/code-generation-step"
import { DeploymentStep } from "@/components/launchpad/steps/deployment-step"
import { LiquidityStep } from "@/components/launchpad/steps/liquidity-step"
import { FinalizeStep } from "@/components/launchpad/steps/finalize-step"
import { CheckCircle2, Circle } from "lucide-react"

interface LaunchpadStepperProps {
  initialCode?: string
}

export function LaunchpadStepper({ initialCode = "" }: LaunchpadStepperProps) {
  const { connected } = useWallet()
  const [currentStep, setCurrentStep] = useState(1)
  const [programCode, setProgramCode] = useState(initialCode)
  const [frontendCode, setFrontendCode] = useState("")
  const [securityIssues, setSecurityIssues] = useState<string[]>([])
  const [deploymentData, setDeploymentData] = useState<{
    programId: string
    signature: string
  } | null>(null)
  const [liquidityData, setLiquidityData] = useState<{
    poolAddress: string
    lpTokenAmount: string
    transactionId: string
  } | null>(null)

  // If initial code is provided, we can skip to step 2 if it's valid
  useEffect(() => {
    if (initialCode && currentStep === 1) {
      setProgramCode(initialCode)
      // We'll still show step 1 but with the code pre-filled
    }
  }, [initialCode, currentStep])

  const steps = [
    { id: 1, name: "Contract Validated", completed: currentStep > 1 },
    { id: 2, name: "Deployed to Solana", completed: currentStep > 2 },
    { id: 3, name: "Liquidity Added", completed: currentStep > 3 },
    { id: 4, name: "Launch Complete", completed: currentStep > 4 },
  ]

  const handleCodeGenerated = (program: string, frontend: string, issues: string[]) => {
    setProgramCode(program)
    setFrontendCode(frontend)
    setSecurityIssues(issues)
  }

  const handleDeploymentComplete = (data: { programId: string; signature: string }) => {
    setDeploymentData(data)
    setCurrentStep(3)
  }

  const handleLiquidityAdded = (data: { poolAddress: string; lpTokenAmount: string; transactionId: string }) => {
    setLiquidityData(data)
    setCurrentStep(4)
  }

  const handleLaunchComplete = () => {
    setCurrentStep(5)
  }

  return (
    <div className="space-y-8">
      {/* Timeline UI */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-700 -translate-y-1/2"></div>
        <ol className="relative grid grid-cols-4 w-full">
          {steps.map((step) => (
            <li key={step.id} className="relative flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full z-10 ${
                  step.completed ? "bg-purple-600" : "bg-gray-800 border border-gray-700"
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <span className={`mt-2 text-xs text-center ${step.completed ? "text-purple-400" : "text-gray-500"}`}>
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Steps Content */}
      <Card className="bg-gray-800 border-gray-700">
        {currentStep === 1 && (
          <CodeGenerationStep
            initialCode={initialCode}
            onComplete={(program, frontend, issues) => {
              handleCodeGenerated(program, frontend, issues)
              setCurrentStep(2)
            }}
          />
        )}

        {currentStep === 2 && (
          <DeploymentStep
            programCode={programCode}
            securityIssues={securityIssues}
            onComplete={handleDeploymentComplete}
            walletConnected={connected}
          />
        )}

        {currentStep === 3 && deploymentData && (
          <LiquidityStep
            programId={deploymentData.programId}
            onComplete={handleLiquidityAdded}
            walletConnected={connected}
          />
        )}

        {currentStep === 4 && deploymentData && liquidityData && (
          <FinalizeStep
            programId={deploymentData.programId}
            poolAddress={liquidityData.poolAddress}
            lpTokenAmount={liquidityData.lpTokenAmount}
            onComplete={handleLaunchComplete}
          />
        )}
      </Card>
    </div>
  )
}
