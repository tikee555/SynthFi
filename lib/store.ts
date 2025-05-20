import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CodeStore {
  generatedCode: string
  setGeneratedCode: (code: string) => void
  clearGeneratedCode: () => void
}

export const useCodeStore = create<CodeStore>()(
  persist(
    (set) => ({
      generatedCode: "",
      setGeneratedCode: (code) => set({ generatedCode: code }),
      clearGeneratedCode: () => set({ generatedCode: "" }),
    }),
    {
      name: "synthfi-code-storage",
    },
  ),
)
