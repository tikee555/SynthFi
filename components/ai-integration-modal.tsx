"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from "lucide-react"

interface AIIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function AIIntegrationModal({ isOpen, onClose, onConfirm }: AIIntegrationModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      onConfirm()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#1e293b] border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 text-purple-400"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Enable AI Integration
            <Badge className="ml-2 bg-purple-900/30 text-purple-300 border-purple-700">Premium</Badge>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            You're about to enable AI integration for your smart contract
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-[#0f172a] rounded-md p-4 border border-zinc-800">
            <h4 className="font-medium mb-2">What you'll get:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-400" />
                <span>On-chain AI processing capabilities</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-400" />
                <span>Token-gated AI features for your users</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-400" />
                <span>Automated decision making based on AI analysis</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-400" />
                <span>Access to SynthFi AI infrastructure</span>
              </li>
            </ul>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800 rounded-md p-4 text-sm">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-400" />
              <div>
                <p className="font-medium text-yellow-400">Deployment Cost</p>
                <p className="text-gray-300 mt-1">
                  Enabling AI integration requires{" "}
                  <span className="text-purple-400 font-medium">$50 worth of $SYNTHFI tokens</span> at deployment time.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="border-zinc-700 hover:bg-zinc-700">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Enable AI Integration"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
