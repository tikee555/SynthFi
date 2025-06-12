import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/contexts/wallet-context"
import { Toaster } from "@/components/ui/toaster"
// SynthFiHeader is a NAMED import
import { SynthFiHeader } from "@/components/synthfi-header"
// SynthFiFooter is a NAMED import
import { SynthFiFooter } from "@/components/synthfi-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SynthFi - AI-Powered Solana Smart Contract Generation",
  description:
    "Describe your DeFi idea in plain English and generate production-ready Solana smart contracts instantly with SynthFi.",
  icons: {
    icon: "/images/synthfi-logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gradient-to-br from-[#00000A] to-[#0A0014] text-gray-100 flex flex-col min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <WalletProvider>
            <SynthFiHeader />
            <main className="flex-grow">{children}</main>
            <SynthFiFooter />
            <Toaster />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
