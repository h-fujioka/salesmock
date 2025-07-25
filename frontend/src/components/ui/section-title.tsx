import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import * as React from "react"

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title: string
  className?: string
}

export function SectionTitle({
  icon: Icon,
  title,
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {Icon && <Icon className="w-5 h-5 text-gray-700 flex-shrink-0" />}
      <h3 className="text-lg font-semibold text-gray-700 leading-none">{title}</h3>
    </div>
  )
} 