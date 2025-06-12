export interface RemixableBuild {
  id: string // Unique ID (e.g., type-timestamp-random)
  timestamp: number
  type: "direct_prompt" | "template_based"
  originalPrompt: string // The base prompt used (from template or direct input)
  customizedPrompt: string // The final prompt after user customizations (can be same as originalPrompt)
  projectName?: string
  tokenName?: string
  tokenSymbol?: string
  tokenDecimals?: number
  selectedChain: string
  enableAI: boolean
  aiInstruction?: string
  // Store a snippet or title for quick display
  displayTitle: string
}

const HISTORY_KEY = "synthfi_remix_history"
const MAX_HISTORY_ITEMS = 10

export const getRecentBuilds = (): RemixableBuild[] => {
  if (typeof window === "undefined") return []
  try {
    const storedHistory = localStorage.getItem(HISTORY_KEY)
    return storedHistory ? JSON.parse(storedHistory) : []
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return []
  }
}

export const addBuildToHistory = (
  build: Omit<RemixableBuild, "id" | "timestamp" | "displayTitle"> & { id?: string },
): void => {
  if (typeof window === "undefined") return
  try {
    const history = getRecentBuilds()

    const displayTitle =
      build.projectName ||
      build.tokenName ||
      build.customizedPrompt.substring(0, 50) + (build.customizedPrompt.length > 50 ? "..." : "")

    const newBuild: RemixableBuild = {
      ...build,
      id: build.id || `${build.type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      displayTitle,
    }

    // Add to the beginning and ensure no duplicates by customizedPrompt (simple check)
    const updatedHistory = [
      newBuild,
      ...history.filter((item) => item.customizedPrompt !== newBuild.customizedPrompt),
    ].slice(0, MAX_HISTORY_ITEMS)

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error("Error writing to localStorage:", error)
  }
}

export const getBuildById = (id: string): RemixableBuild | undefined => {
  const history = getRecentBuilds()
  return history.find((build) => build.id === id)
}
