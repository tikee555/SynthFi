"use client"

interface LogicTabProps {
  logic: {
    purpose: string
    instructions: Array<{
      name: string
      description: string
    }>
    accessControl: string
  } | null
}

export function LogicTab({ logic }: LogicTabProps) {
  // Add null check and fallback
  if (!logic) {
    return (
      <div className="space-y-6 h-full overflow-auto">
        <div className="bg-[#0d111c] rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Logic Breakdown</h3>
          <p className="text-gray-300">No logic data available. Generate code first to see the breakdown.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 h-full overflow-auto">
      <div className="bg-[#0d111c] rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Program Purpose</h3>
        <p className="text-gray-300">{logic.purpose || "No purpose specified"}</p>
      </div>

      <div className="bg-[#0d111c] rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Instructions</h3>
        {logic.instructions && logic.instructions.length > 0 ? (
          <ul className="space-y-4">
            {logic.instructions.map((instruction, index) => (
              <li key={index} className="border-l-2 border-purple-600 pl-4">
                <h4 className="font-medium text-white">{instruction.name || "Unnamed Instruction"}</h4>
                <p className="text-gray-300 mt-1">{instruction.description || "No description available"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">No instructions available</p>
        )}
      </div>

      <div className="bg-[#0d111c] rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Access Control</h3>
        <p className="text-gray-300">{logic.accessControl || "No access control specified"}</p>
      </div>
    </div>
  )
}
