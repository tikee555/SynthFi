// Ensuring this file is re-processed - Version 5
"use client"
import Link from "next/link"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { TokenSearch } from "@/components/token-search"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { ProfileModal } from "@/components/profile-modal"
import { UserCircle, Copy, LogOut, Briefcase, User, Settings, ChevronRight, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// CRITICAL: This must be a NAMED export
export function SynthFiHeader() {
  const { isConnected, walletAddress, disconnect, walletType, currentChain } = useWallet()
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const { toast } = useToast()

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      toast({
        title: "Address Copied",
        description: walletAddress,
        duration: 3000,
      })
    }
  }

  const getBlockExplorerLink = () => {
    if (!walletAddress) return "#"
    if (currentChain === "solana") {
      return `https://solscan.io/account/${walletAddress}`
    }
    if (currentChain === "base") {
      return `https://basescan.org/address/${walletAddress}`
    }
    return "#"
  }

  const openProfileModal = () => {
    setIsProfileModalOpen(true)
    setIsUserMenuOpen(false)
  }

  return (
    <>
      <header className="bg-black border-b border-zinc-900 py-4 relative z-40">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/images/synthfi-logo.png" alt="SynthFi" className="h-8 mr-2" />
          </Link>

          <div className="flex items-center space-x-1">
            <TokenSearch />
            <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-zinc-800 px-3">
              <Link href="/explore">Explore</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-zinc-800 px-3">
              <Link href="/compare">Compare</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-zinc-800 px-3">
              <Link href="/portfolio">Portfolio</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-zinc-800 px-3">
              <Link href="/watchlist">Watchlist</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-zinc-800 px-3">
              <Link href="/templates">Templates</Link>
            </Button>
            <div className="pl-2">
              {isConnected && walletAddress ? (
                <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 rounded-full h-9 w-9 hover:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-offset-1 focus-visible:ring-offset-black"
                    >
                      <div className="relative">
                        <UserCircle className="h-9 w-9 text-gray-400 group-hover:text-gray-200" />
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-black" />
                      </div>
                      <span className="sr-only">Open user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#18181b] border-zinc-700 text-white w-72 shadow-xl" align="end">
                    <div className="px-3 py-2.5">
                      <p className="text-xs text-gray-400 mb-0.5">Connected as</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono truncate" title={walletAddress}>
                          {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyAddress}
                          className="h-7 px-1.5 text-gray-400 hover:text-white hover:bg-zinc-700"
                        >
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Copy
                        </Button>
                      </div>
                      {walletType && (
                        <div className="mt-1">
                          <span
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded-full font-medium",
                              walletType === "metamask"
                                ? "bg-orange-500/20 text-orange-300"
                                : "bg-purple-500/20 text-purple-300",
                            )}
                          >
                            {walletType} {currentChain && `(${currentChain})`}
                          </span>
                          <a
                            href={getBlockExplorerLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-xs text-gray-400 hover:text-purple-400 hover:underline inline-flex items-center"
                          >
                            View on Explorer <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      )}
                    </div>
                    <DropdownMenuSeparator className="bg-zinc-700" />
                    <DropdownMenuItem
                      onSelect={openProfileModal}
                      className="hover:bg-zinc-700 cursor-pointer group w-full flex items-center justify-between px-3 py-2.5 text-sm"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2.5 text-gray-400 group-hover:text-white" /> My Profile
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-gray-300" />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="hover:bg-zinc-700 cursor-pointer group">
                      <Link href="/portfolio" className="w-full flex items-center justify-between px-3 py-2.5 text-sm">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2.5 text-gray-400 group-hover:text-white" /> My Portfolio
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-gray-300" />
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-zinc-700 cursor-pointer group px-3 py-2.5 text-sm flex items-center justify-between"
                      disabled // Assuming this is intentionally disabled
                    >
                      <div className="flex items-center text-gray-500">
                        {" "}
                        {/* Adjusted for disabled state */}
                        <Settings className="h-4 w-4 mr-2.5" /> Account Settings
                      </div>
                      <span className="text-xs text-gray-600">Soon</span> {/* Adjusted for disabled state */}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-700" />
                    <DropdownMenuItem
                      onSelect={() => {
                        setIsWalletModalOpen(true)
                        setIsUserMenuOpen(false)
                      }}
                      className="hover:bg-zinc-700 cursor-pointer px-3 py-2.5 text-sm text-gray-300 hover:text-white"
                    >
                      Switch Wallet
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        disconnect()
                        setIsUserMenuOpen(false)
                      }}
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer group px-3 py-2.5 text-sm"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2.5 text-red-400 group-hover:text-red-300" /> Disconnect
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setIsWalletModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      {isWalletModalOpen && (
        <WalletConnectModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
      )}
      {isProfileModalOpen && walletAddress && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          walletAddress={walletAddress}
        />
      )}
    </>
  )
}

export default SynthFiHeader
