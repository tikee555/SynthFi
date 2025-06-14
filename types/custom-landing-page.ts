// Defines the structured data for AI-generated landing pages

export interface CustomLandingPageSocialLinks {
  twitter?: string
  telegram?: string
  website?: string
}

export type BackgroundStyleType =
  | "dark"
  | "gradient1"
  | "gradient2"
  | "image"
  | "neon"
  | "comic"
  | "cyberpunk"
  | "light"

export const backgroundStyleOptions: { value: BackgroundStyleType; label: string }[] = [
  { value: "dark", label: "Dark Theme" },
  { value: "light", label: "Light Theme" },
  { value: "gradient1", label: "Purple Haze Gradient" },
  { value: "gradient2", label: "Synthwave Sunset Gradient" },
  { value: "neon", label: "Neon Glow (Dark/Green)" },
  { value: "comic", label: "Comic Book Style" },
  { value: "cyberpunk", label: "Cyberpunk City" },
  { value: "image", label: "Custom Image URL" },
]

// --- Section Data Interfaces ---
export interface HeroSectionData {
  title: string
  subtitle: string
  logoUrl?: string
  ctaButton?: {
    text: string
    link: string
  }
  backgroundImageUrl?: string // For hero-specific background
  animation?: "pulse" | "gradientShift" | "none"
  themeOverride?: BackgroundStyleType // e.g. if hero is synthwave but page is dark
}

export interface FeatureItem {
  title: string
  description: string
  iconQuery?: string // e.g., "shield lock security" for placeholder icon
  iconName?: string // Lucide icon name for auto-injection
}

export interface FeatureGridSectionData {
  title?: string // Optional title for the features section itself
  features: FeatureItem[]
  columns?: 2 | 3 | 4
}

export interface TextBlockSectionData {
  title: string
  content: string // Markdown or plain text content
  alignment?: "left" | "center" | "right"
}

export interface CallToActionSectionData {
  title: string
  description?: string
  buttonText: string
  buttonLink: string
}

export interface FooterSectionData {
  text?: string // e.g., "© 2025 Project Name"
  socialLinks?: CustomLandingPageSocialLinks // Re-use existing type
}

// --- Union Type for Section Data ---
export type SectionSpecificData =
  | HeroSectionData
  | FeatureGridSectionData
  | TextBlockSectionData
  | CallToActionSectionData
  | FooterSectionData

// --- Landing Page Section Definition ---
export type LandingPageSectionType =
  | "hero"
  | "featureGrid"
  | "textBlock" // For About, Technology, etc.
  | "cta"
  | "footer"

export interface LandingPageSection {
  id: string
  type: LandingPageSectionType
  data: SectionSpecificData
}

// --- Main Configuration ---
export interface CustomLandingPageConfig {
  tokenId: string
  projectTitle: string // Used for metadata, default logo, fallback text
  shortDescription: string // Used for metadata
  logoUrl?: string // Default/overall project logo
  socialLinks: CustomLandingPageSocialLinks // Overall social links, can be used by footer
  backgroundStyle: BackgroundStyleType // Overall page theme
  backgroundImageUrl?: string // Overall page background image
  layoutPreset: "ai-generated" // This config is specifically for AI
  customSections: LandingPageSection[] // Array of structured section data
  aiPrompt?: string
  tokenSymbol?: string
  aiGeneratedLogoUrl?: string // Stores the specific logo URL suggested/generated by AI for the project
}
