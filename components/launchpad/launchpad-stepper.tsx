interface LaunchpadStepperProps {
  currentStep: number
  enableAI?: boolean
}

export function LaunchpadStepper({ currentStep, enableAI = false }: LaunchpadStepperProps) {
  // Remove AI Configuration step since it's now handled on the homepage
  const steps = [
    { id: 1, name: "Review & Audit" },
    { id: 2, name: "Token Details" },
    { id: 3, name: "Deploy Contract" },
    { id: 4, name: "Add Liquidity" },
    { id: 5, name: "Launch Summary" },
  ]

  const totalSteps = steps.length - 1

  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center relative z-10 ${
              currentStep >= step.id ? "text-white" : "text-gray-500"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep >= step.id ? "bg-purple-600" : "bg-zinc-800"
              }`}
            >
              {currentStep > step.id ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <div className="text-sm font-medium">{step.name}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-zinc-800">
        <div
          className="h-full bg-purple-600 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}
