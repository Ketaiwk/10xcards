import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface NavigationItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  active?: boolean
  icon?: React.ReactNode
  hasSubmenu?: boolean
}

const NavigationItem = React.forwardRef<HTMLAnchorElement, NavigationItemProps>(
  ({ className, active, icon, hasSubmenu, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        // Base styles
        "flex items-center gap-2 px-4 h-12 text-gray-600 text-sm font-medium",
        "transition-colors",
        "hover:bg-gray-100",
        
        // Active state
        active && [
          "text-blue-600",
          "border-l-4 border-blue-600",
          "bg-blue-50 hover:bg-blue-50"
        ],
        
        className
      )}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{children}</span>
      {hasSubmenu && <ChevronDown className="w-4 h-4 ml-auto" />}
    </a>
  )
)
NavigationItem.displayName = "NavigationItem"

interface NavigationGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

const NavigationGroup = React.forwardRef<HTMLDivElement, NavigationGroupProps>(
  ({ className, title, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("py-2", className)}
      {...props}
    >
      {title && (
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
          {title}
        </div>
      )}
      {children}
    </div>
  )
)
NavigationGroup.displayName = "NavigationGroup"

const Navigation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn(
      // Base styles
      "w-64 bg-white border-r border-gray-300",
      "flex flex-col",
      className
    )}
    {...props}
  />
))
Navigation.displayName = "Navigation"

export { Navigation, NavigationGroup, NavigationItem }
