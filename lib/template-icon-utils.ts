import * as Icons from "lucide-react"
import type { IconName } from "@/components/templates/template-types"
import type { LucideIcon } from "lucide-react"

// Default icon if a specific one isn't found or provided
const DEFAULT_ICON_NAME: IconName = "Package"

export function getIconComponent(iconName?: IconName): LucideIcon {
  if (iconName && Icons[iconName]) {
    return Icons[iconName] as LucideIcon
  }
  return Icons[DEFAULT_ICON_NAME] as LucideIcon
}
