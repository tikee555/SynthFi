import type React from "react"
import type { FeatureGridSectionData, BackgroundStyleType } from "@/types/custom-landing-page"
import {
  CheckCircle,
  Zap,
  Shield,
  Cpu,
  Eye,
  Lock,
  Globe,
  SlidersHorizontal,
  RefreshCw,
  BrainCircuit,
  ShieldCheck,
  Network,
  Users,
  Coins,
  TrendingUp,
  Vote,
  Waves,
  BarChart3,
  Smartphone,
  Rocket,
  Sparkles,
} from "lucide-react"

interface FeatureGridBlockProps {
  data: FeatureGridSectionData
  theme: BackgroundStyleType
}

// Enhanced icon mapping for Lucide icons
const iconMap = {
  // Primary feature icons
  Cpu,
  Eye,
  Lock,
  Globe,
  SlidersHorizontal,
  RefreshCw,
  BrainCircuit,
  ShieldCheck,
  // Secondary feature icons
  Network,
  Zap,
  Users,
  Coins,
  TrendingUp,
  Vote,
  Waves,
  BarChart3,
  Smartphone,
  Rocket,
  // Fallback icons
  Sparkles,
  CheckCircle,
  Shield,
}

export const FeatureGridBlock: React.FC<FeatureGridBlockProps> = ({ data, theme }) => {
  const { title, features, columns = 3 } = data

  let sectionClasses = "py-16 md:py-24 px-4"
  let titleClasses = "text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16"
  let cardClasses = "p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
  let cardTitleClasses = "text-xl font-semibold mb-3"
  let cardDescriptionClasses = ""
  let iconClasses = "w-8 h-8 mb-4"

  if (theme === "light") {
    sectionClasses += " bg-white text-slate-800"
    titleClasses += " text-slate-900"
    cardClasses += " bg-slate-50 hover:bg-slate-100"
    cardTitleClasses += " text-slate-900"
    cardDescriptionClasses += " text-slate-700"
    iconClasses += " text-purple-600"
  } else if (theme === "neon") {
    sectionClasses += " bg-gray-900 text-green-100"
    titleClasses += " text-green-400"
    cardClasses += " bg-gray-800 border border-green-500/20 hover:border-green-400/40"
    cardTitleClasses += " text-green-300"
    cardDescriptionClasses += " text-green-100/80"
    iconClasses += " text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
  } else if (theme === "cyberpunk") {
    sectionClasses += " bg-gradient-to-b from-purple-900 to-pink-900 text-cyan-100"
    titleClasses += " text-cyan-400"
    cardClasses += " bg-gray-800/80 border border-cyan-500/30 hover:border-cyan-400/60"
    cardTitleClasses += " text-cyan-300"
    cardDescriptionClasses += " text-cyan-100/80"
    iconClasses += " text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]"
  } else {
    sectionClasses += " bg-gray-800 text-white"
    titleClasses += " text-white"
    cardClasses += " bg-gray-700 hover:bg-gray-600"
    cardTitleClasses += " text-white"
    cardDescriptionClasses += " text-gray-300"
    iconClasses += " text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]"
  }

  const gridColsClass =
    {
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
    }[columns] || "md:grid-cols-3"

  return (
    <section className={sectionClasses}>
      <div className="container mx-auto">
        {title && <h2 className={titleClasses}>{title}</h2>}
        <div className={`grid grid-cols-1 ${gridColsClass} gap-8`}>
          {features.map((feature, index) => {
            // Get the appropriate icon component
            const IconComponent =
              feature.iconName && iconMap[feature.iconName as keyof typeof iconMap]
                ? iconMap[feature.iconName as keyof typeof iconMap]
                : iconMap.Sparkles // Fallback to Sparkles

            return (
              <div key={index} className={cardClasses}>
                <div className="flex flex-col items-center text-center">
                  <IconComponent className={iconClasses} />
                  <h3 className={cardTitleClasses}>{feature.title}</h3>
                  <p className={cardDescriptionClasses}>{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
