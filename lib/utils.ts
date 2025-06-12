import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value)
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  } else {
    return `$${value.toFixed(2)}`
  }
}

export function shortenAddress(address: string): string {
  if (!address) return ""
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
}

export function formatDateDistance(date: string): string {
  const now = new Date()
  const pastDate = new Date(date)
  const diffTime = Math.abs(now.getTime() - pastDate.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "Today"
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} months ago`
  } else {
    return `${Math.floor(diffDays / 365)} years ago`
  }
}

export function getTokenImage(categoryOrSymbol: string, symbolOrText: string, size = 100): string {
  // Determine if the first param is a category or just part of the text
  const categories: Record<string, string> = {
    DEX: "7c3aed", // purple
    STAKE: "2563eb", // blue
    LEND: "16a34a", // green
    NFT: "db2777", // pink
    GOV: "ea580c", // orange
    // Add more categories as needed
  }

  let color = "6b7280" // default gray
  let text = symbolOrText

  if (categories[categoryOrSymbol.toUpperCase()]) {
    color = categories[categoryOrSymbol.toUpperCase()]
  } else {
    // If the first param is not a known category, assume it's part of the text
    // and symbolOrText is the actual symbol/text to display
    text = `${categoryOrSymbol}${symbolOrText}`
  }

  // Ensure text is URL encoded
  const encodedText = encodeURIComponent(text)

  return `https://placehold.co/${size}x${size}/${color}/ffffff?text=${encodedText}`
}
