"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"
import { Connection, PublicKey, type ParsedAccountData } from "@solana/web3.js"

// ************************************************************************************
// !! RPC CONFIGURATION: LIVE vs. DEMO MODE !!
//
// To enable LIVE MODE and connect to the real Solana blockchain, you MUST provide a
// dedicated RPC URL below. Without it, the app will run in DEMO MODE with fake data.
//
// 1. Get a dedicated RPC URL from a provider like QuickNode, Helius, Alchemy, or Triton.
// 2. Replace the placeholder string below with your actual RPC URL.
//
const DEDICATED_RPC_URL = "YOUR_DEDICATED_SOLANA_RPC_URL_MUST_BE_PLACED_HERE"
//
// ************************************************************************************

const PLACEHOLDER_DEDICATED_URL = "YOUR_DEDICATED_SOLANA_RPC_URL_MUST_BE_PLACED_HERE"
// const PHANTOM_CONNECT_TIMEOUT_MS = 15000 // 15 seconds timeout for Phantom connection
const PHANTOM_CONNECT_TIMEOUT_MS = 30000 // Increased to 30 seconds timeout for Phantom connection

let rpcUrlToUse: string | undefined = undefined

if (DEDICATED_RPC_URL && DEDICATED_RPC_URL !== PLACEHOLDER_DEDICATED_URL) {
  rpcUrlToUse = DEDICATED_RPC_URL
} else if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
  rpcUrlToUse = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
}

const IS_RPC_CONFIGURED = !!rpcUrlToUse
const IS_DEMO_MODE = !IS_RPC_CONFIGURED
const solanaConnection = IS_RPC_CONFIGURED ? new Connection(rpcUrlToUse!, "confirmed") : null

if (IS_DEMO_MODE) {
  console.warn(
    "[WalletContext] DEMO MODE ACTIVATED. No dedicated Solana RPC URL was found. The application will use simulated data. To switch to Live Mode, provide a DEDICATED_RPC_URL in `contexts/wallet-context.tsx`.",
  )
} else {
  console.log("[WalletContext] Live Mode: Using dedicated RPC URL:", rpcUrlToUse)
}

type WalletType = "metamask" | "phantom" | null
type ChainType = "solana" | "base"

export const SYNTH_TOKEN_CONTRACT_ADDRESS = "D9mendaps8MaMHtLz2w8Duum3FfamPh2yWX5owKZpump"
export const SYNTHFI_DECIMALS = 6

interface WalletContextType {
  walletType: WalletType
  walletAddress: string | null
  isConnecting: boolean
  isConnected: boolean
  isDemoMode: boolean
  connect: (type: WalletType) => Promise<void>
  disconnect: () => void
  switchWallet: (type: WalletType) => Promise<void>
  isSupportedChain: (chain: ChainType) => boolean
  isEvmChain: (chain: ChainType) => boolean
  switchNetwork: (chain: ChainType) => Promise<boolean>
  currentChain: string | null
  getSynthTokenBalance: (walletAddress: string | null) => Promise<number>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletType, setWalletType] = useState<WalletType>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [currentChain, setCurrentChain] = useState<string | null>(null)

  useEffect(() => {
    if (IS_DEMO_MODE) return
    const savedWalletType = localStorage.getItem("walletType") as WalletType
    const savedWalletAddress = localStorage.getItem("walletAddress")
    const savedChain = localStorage.getItem("currentChain")
    if (savedWalletType && savedWalletAddress) {
      setWalletType(savedWalletType)
      setWalletAddress(savedWalletAddress)
      setIsConnected(true)
      if (savedChain) setCurrentChain(savedChain)
    }
  }, [])

  const connectToPhantomWithTimeout = (timeoutMs: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      console.log(
        `[WalletContext] connectToPhantomWithTimeout: Initiating Phantom connection with a ${timeoutMs / 1000}s timeout.`,
      )
      const timer = setTimeout(() => {
        console.warn(
          `[WalletContext] connectToPhantomWithTimeout: Phantom connection timed out after ${timeoutMs / 1000}s.`,
        )
        reject(new Error(`Phantom connection timed out after ${timeoutMs / 1000}s`))
      }, timeoutMs)

      if (!(window as any).phantom?.solana) {
        clearTimeout(timer)
        console.error(
          "[WalletContext] connectToPhantomWithTimeout: Phantom provider (window.phantom.solana) not found.",
        )
        reject(new Error("Phantom wallet provider not found. Please ensure Phantom is installed and enabled."))
        return
      }
      ;(window as any).phantom.solana
        .connect({ onlyIfTrusted: false })
        .then((resp: any) => {
          clearTimeout(timer)
          console.log("[WalletContext] connectToPhantomWithTimeout: Phantom connection successful.")
          resolve(resp)
        })
        .catch((err: any) => {
          clearTimeout(timer)
          console.error("[WalletContext] connectToPhantomWithTimeout: Phantom connection failed.", err)
          reject(err)
        })
    })
  }

  const connect = async (type: WalletType) => {
    console.log(`[WalletContext] connect: called with ${type}, setting isConnecting = true`)
    setIsConnecting(true)

    if (IS_DEMO_MODE) {
      console.log(`[WalletContext] connect: DEMO MODE for ${type}.`)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate delay
      const demoAddress = type === "phantom" ? "DemoWallet123abc...xyz" : "0xDemoWallet123abc...xyz"
      setWalletType(type)
      setWalletAddress(demoAddress)
      setIsConnected(true)
      setCurrentChain(type === "phantom" ? "solana" : "base")
      toast({ title: "Demo Mode", description: "Wallet connection simulated successfully." })
      console.log("[WalletContext] connect: DEMO MODE, setting isConnecting = false")
      setIsConnecting(false)
      return
    }

    // Live Mode Logic
    try {
      let address = ""
      let chainId = null
      if (type === "metamask") {
        // This is a simplified simulation. Real MetaMask integration is more complex.
        // For a real implementation, you'd use window.ethereum.request, etc.
        address = "0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        chainId = "base"
        // Simulate a short delay for MetaMask
        await new Promise((resolve) => setTimeout(resolve, 500))
      } else if (type === "phantom") {
        if ((window as any).phantom?.solana?.isPhantom) {
          try {
            console.log("[WalletContext] connect: Attempting Phantom connection with timeout.")
            const resp = await connectToPhantomWithTimeout(PHANTOM_CONNECT_TIMEOUT_MS)
            address = resp.publicKey.toString()
            console.log("[WalletContext] connect: Phantom connected, address:", address)
          } catch (err) {
            console.error("[WalletContext] connect: Phantom connection error (or timeout):", err)
            toast({ title: "Phantom Connection Failed", description: (err as Error).message, variant: "destructive" })
            // setIsConnecting(false) will be handled by the outer finally block
            return // Exit after failure
          }
        } else {
          toast({
            title: "Phantom Not Found",
            description: "Please install the Phantom wallet extension.",
            variant: "destructive",
          })
          // setIsConnecting(false) will be handled by the outer finally block
          return // Exit if Phantom not found
        }
        chainId = "solana"
      }

      // If we successfully got an address (or it's metamask simulation)
      if (address) {
        setWalletType(type)
        setWalletAddress(address)
        setIsConnected(true)
        setCurrentChain(chainId)
        localStorage.setItem("walletType", type as string)
        localStorage.setItem("walletAddress", address)
        localStorage.setItem("currentChain", chainId as string)
        // toast({ title: "Wallet Connected", description: `Successfully connected to ${type}.` });
      } else if (type === "phantom") {
        // This case should ideally be caught by earlier returns if address is not obtained
        console.warn(
          "[WalletContext] connect: Phantom connection attempt finished but no address obtained, this might indicate an issue.",
        )
      }
    } catch (error) {
      // This catch is for unexpected errors during the connection process itself,
      // not specific wallet provider errors if they were caught and returned from above.
      console.error("[WalletContext] connect: General error during connection process:", error)
      toast({ title: "Wallet Connection Error", description: (error as Error).message, variant: "destructive" })
    } finally {
      console.log("[WalletContext] connect: FINALLY block, setting isConnecting = false")
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    console.log("[WalletContext] disconnect: called")
    if (!IS_DEMO_MODE && walletType === "phantom" && (window as any).phantom?.solana?.isConnected) {
      ;(window as any).phantom.solana.disconnect()
    }
    setWalletType(null)
    setWalletAddress(null)
    setIsConnected(false)
    setCurrentChain(null)
    localStorage.removeItem("walletType")
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("currentChain")
    toast({
      title: "Wallet Disconnected",
      description: "You have successfully disconnected your wallet.",
      duration: 3000,
    })
    // Ensure isConnecting is false on disconnect as well
    if (isConnecting) {
      console.log("[WalletContext] disconnect: setting isConnecting = false")
      setIsConnecting(false)
    }
  }

  const switchWallet = async (newWalletType: WalletType) => {
    if (newWalletType === walletType && isConnected) return // Already connected with this type
    console.log(`[WalletContext] switchWallet: to ${newWalletType}`)
    // Disconnect first, which also handles resetting isConnecting
    disconnect()
    // Small delay to allow state to propagate if needed, and UI to update
    await new Promise((resolve) => setTimeout(resolve, 150))
    if (newWalletType) {
      await connect(newWalletType)
    }
  }

  const isEvmChain = (chain: ChainType): boolean => chain === "base"
  const isSupportedChain = (chain: ChainType): boolean => {
    if (!walletType) return true
    if (walletType === "metamask") return chain === "base"
    if (walletType === "phantom") return chain === "solana"
    return false
  }

  const switchNetwork = async (chain: ChainType): Promise<boolean> => {
    if (!isEvmChain(chain) || walletType !== "metamask") {
      setCurrentChain(chain)
      localStorage.setItem("currentChain", chain)
      return true
    }
    // Real EVM switch logic would go here using window.ethereum.request
    // For now, just updating state
    setCurrentChain(chain)
    localStorage.setItem("currentChain", chain)
    toast({ title: "Network Changed", description: `Switched to ${chain}` })
    return true
  }

  const getSynthTokenBalance = async (ownerAddressString: string | null): Promise<number> => {
    if (IS_DEMO_MODE) {
      console.log("[WalletContext] DEMO MODE: Returning mock SYNTHFI balance.")
      return 123456 * Math.pow(10, SYNTHFI_DECIMALS)
    }

    if (!IS_RPC_CONFIGURED || !solanaConnection) {
      console.warn("getSynthTokenBalance: Aborted. Solana RPC is not configured.")
      return 0
    }
    if (!ownerAddressString || walletType !== "phantom") {
      return 0
    }

    try {
      const ownerPublicKey = new PublicKey(ownerAddressString)
      const tokenMintPublicKey = new PublicKey(SYNTH_TOKEN_CONTRACT_ADDRESS)
      const tokenAccounts = await solanaConnection.getParsedTokenAccountsByOwner(ownerPublicKey, {
        mint: tokenMintPublicKey,
      })
      if (tokenAccounts.value.length === 0) {
        return 0
      }
      const accountInfo = tokenAccounts.value[0].account.data.parsed as ParsedAccountData
      return Number(accountInfo.info.tokenAmount.amount)
    } catch (error: any) {
      console.error(`Error fetching SYNTHFI token balance for ${ownerAddressString} using RPC ${rpcUrlToUse}:`, error)
      toast({
        title: "Balance Fetch Error",
        description: `Could not fetch SYNTHFI balance. RPC Error: ${error.message}.`,
        variant: "destructive",
        duration: 10000,
      })
      return 0
    }
  }

  return (
    <WalletContext.Provider
      value={{
        walletType,
        walletAddress,
        isConnecting,
        isConnected,
        isDemoMode: IS_DEMO_MODE,
        connect,
        disconnect,
        switchWallet,
        isSupportedChain,
        isEvmChain,
        switchNetwork,
        currentChain,
        getSynthTokenBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
