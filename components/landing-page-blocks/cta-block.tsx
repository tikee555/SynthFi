import type React from "react"
import type { CallToActionSectionData, BackgroundStyleType } from "@/types/custom-landing-page"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CallToActionBlockProps {
  data: CallToActionSectionData
  theme: BackgroundStyleType
}

export const CallToActionBlock: React.FC<CallToActionBlockProps> = ({ data, theme }) => {
  const { title, description, buttonText, buttonLink } = data

  let sectionClasses = "py-16 md:py-24 px-4 text-center"
  let titleClasses = "text-3xl md:text-4xl font-bold mb-4"
  let descriptionClasses = "text-lg md:text-xl max-w-xl mx-auto mb-8"

  if (theme === "light") {
    sectionClasses += " bg-slate-100 text-slate-900"
    titleClasses += " text-slate-900"
    descriptionClasses += " text-slate-700"
  } else {
    sectionClasses += " bg-gray-900 text-white"
    titleClasses += " text-white"
    descriptionClasses += " text-gray-300"
  }

  return (
    <section className={sectionClasses}>
      <div className="container mx-auto">
        <h2 className={titleClasses}>{title}</h2>
        {description && <p className={descriptionClasses}>{description}</p>}
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
      </div>
    </section>
  )
}
