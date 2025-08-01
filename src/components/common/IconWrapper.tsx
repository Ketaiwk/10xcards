import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface IconWrapperProps {
  icon: LucideIcon
  className?: string
}

export function IconWrapper({ icon: Icon, className }: IconWrapperProps) {
  return <Icon className={cn("h-5 w-5", className)} />
}
