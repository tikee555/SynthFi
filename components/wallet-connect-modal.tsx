"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { connect, isConnecting, isConnected, switchWallet: contextSwitchWallet } = useWallet()
  // Local state to show "Connecting to X..." text, distinct from global isConnecting
  const [attemptingWallet, setAttemptingWallet] = useState<"metamask" | "phantom" | null>(null)

  const handleConnectWallet = async (type: "metamask" | "phantom") => {
    setAttemptingWallet(type) // Indicate which wallet is being attempted for UI feedback
    try {
      if (isConnected) {
        // If already connected to a different wallet, or same and want to force re-connect (though switchWallet handles same type)
        await contextSwitchWallet(type)
      } else {
        await connect(type)
      }
      // If connect/switchWallet is successful, it will set isConnected=true.
      // We can close the modal if the global isConnected state becomes true after the attempt.
      // The check for isConnected after await might be slightly delayed due to state updates.
      // A more robust way might be for connect/switchWallet to return a success boolean.
      // For now, let's assume if it doesn't throw, it's on its way to connecting.
      // The global isConnected state will eventually update and SynthFiHeader will change.
      onClose() // Close modal after initiating connection/switch.
    } catch (error) {
      // Errors from connect/switchWallet are caught here.
      // Their internal finally blocks should have reset `isConnecting`.
      // The modal remains open, buttons should be re-enabled by `isConnecting` becoming false.
      console.error(`Error in handleConnectWallet for ${type}:`, error)
      // Toast for this error is likely handled within connect/switchWallet.
    } finally {
      setAttemptingWallet(null) // Reset the specific wallet being attempted for UI feedback
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#0f172a] border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-32 bg-[#1e293b] hover:bg-[#334155] border-zinc-700"
            onClick={() => handleConnectWallet("phantom")}
            disabled={isConnecting} // Disabled if ANY connection is in progress
          >
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <img src="/icons/phantom-icon.png" alt="Phantom" className="w-10 h-10" />
            </div>
            <span>Phantom</span>
            {isConnecting && attemptingWallet === "phantom" && (
              <div className="mt-2 text-xs text-purple-400">Connecting...</div>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-32 bg-[#1e293b] hover:bg-[#334155] border-zinc-700"
            onClick={() => handleConnectWallet("metamask")}
            disabled={isConnecting} // Disabled if ANY connection is in progress
          >
            <div className="w-12 h-12 mb-2 flex items-center justify-center">
              <img src="/icons/metamask-icon.svg" alt="MetaMask" className="w-10 h-10" />
            </div>
            <span>MetaMask</span>
            {isConnecting && attemptingWallet === "metamask" && (
              <div className="mt-2 text-xs text-blue-400">Connecting...</div>
            )}
          </Button>
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          By connecting a wallet, you agree to SynthFi's Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  )
}
