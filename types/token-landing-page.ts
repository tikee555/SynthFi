export interface LandingPageSocialLinks {
  twitter?: string
  discord?: string
  website?: string
  telegram?: string
  github?: string
}

export type LandingPageTheme = "dark-purple" | "synthwave" | "minimal-dark" | "light-sky"

export interface LandingPageConfig {
  tokenId: string // Matches the token's unique ID/contractAddress
  tokenName: string
  tokenSymbol: string
  logoUrl?: string // URL or use auto-generated
  tagline: string
  fullDescription: string // Supports markdown
  roadmap?: string // Simple text area, supports markdown
  socialLinks: LandingPageSocialLinks
  teamSection?: string // Simple text area, supports markdown
  theme: LandingPageTheme
  mediaGalleryUrls?: string[] // Array of image URLs
  // Future: custom colors, fonts, etc.
}
