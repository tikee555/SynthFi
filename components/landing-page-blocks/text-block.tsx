import type React from "react"
import type { TextBlockSectionData, BackgroundStyleType } from "@/types/custom-landing-page"
import ReactMarkdown from "react-markdown"

interface TextBlockProps {
  data: TextBlockSectionData
  theme: BackgroundStyleType
}

export const TextBlock: React.FC<TextBlockProps> = ({ data, theme }) => {
  const { title, content, alignment = "left" } = data

  let sectionClasses = "py-16 md:py-24 px-4"
  let titleClasses = "text-3xl md:text-4xl font-bold mb-8"
  let contentClasses = "prose lg:prose-xl max-w-none" // Using Tailwind Prose for markdown

  if (theme === "light") {
    sectionClasses += " bg-slate-50 text-slate-800"
    titleClasses += " text-slate-900"
    contentClasses += " prose-slate"
  } else {
    sectionClasses += " bg-gray-800 text-white"
    titleClasses += " text-white"
    contentClasses += " prose-invert"
  }

  const textAlignClass =
    {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[alignment] || "text-left"

  titleClasses += ` ${textAlignClass}`

  return (
    <section className={sectionClasses}>
      <div className="container mx-auto max-w-3xl">
        <h2 className={titleClasses}>{title}</h2>
        <div className={`${contentClasses} ${textAlignClass}`}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </section>
  )
}
