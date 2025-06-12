import type React from "react"
import type { FooterSectionData, BackgroundStyleType } from "@/types/custom-landing-page"
import Link from "next/link"
import { Twitter, Send, Globe } from "lucide-react"

interface FooterBlockProps {
  data: FooterSectionData
  theme: BackgroundStyleType
}

export const FooterBlock: React.FC<FooterBlockProps> = ({ data, theme }) => {
  const { text, socialLinks } = data

  let footerClasses = "py-8 px-4 text-center"
  let textClasses = "mb-4"
  const linkClasses = "hover:text-purple-400 transition-colors"

  if (theme === "light") {
    footerClasses += " bg-slate-200 text-slate-700 border-t border-slate-300"
    textClasses += " text-slate-600"
  } else {
    footerClasses += " bg-gray-900 text-gray-400 border-t border-gray-700"
    textClasses += " text-gray-500"
  }

  return (
    <footer className={footerClasses}>
      <div className="container mx-auto">
        {socialLinks && (socialLinks.twitter || socialLinks.telegram || socialLinks.website) && (
          <div className="flex justify-center space-x-6 mb-6">
            {socialLinks.twitter && (
              <Link href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </Link>
            )}
            {socialLinks.telegram && (
              <Link href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                <Send size={24} />
                <span className="sr-only">Telegram</span>
              </Link>
            )}
            {socialLinks.website && (
              <Link href={socialLinks.website} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                <Globe size={24} />
                <span className="sr-only">Website</span>
              </Link>
            )}
          </div>
        )}
        {text && <p className={textClasses}>{text}</p>}
        <p className={textClasses}>Powered by SynthFi</p>
      </div>
    </footer>
  )
}
