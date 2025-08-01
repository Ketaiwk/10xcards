import * as React from "react"
import { cn } from "@/lib/utils"

interface ListProps extends React.OlHTMLAttributes<HTMLOListElement> {
  variant?: "ordered" | "unordered"
  spacing?: "compact" | "normal" | "relaxed"
  dividers?: boolean
}

const List = React.forwardRef<HTMLOListElement, ListProps>(
  ({ className, variant = "unordered", spacing = "normal", dividers = false, children, ...props }, ref) => {
    const Component = variant === "ordered" ? "ol" : "ul"
    
    const spacingStyles = {
      compact: "space-y-1",
      normal: "space-y-2",
      relaxed: "space-y-3"
    }
    
    return (
      <Component
        ref={ref}
        className={cn(
          // Base styles
          spacingStyles[spacing],
          variant === "ordered" && "list-decimal",
          variant === "unordered" && "list-disc",
          "pl-5",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null
          
          return (
            <li
              className={cn(
                dividers && index !== 0 && "border-t border-gray-200 pt-2"
              )}
            >
              {child}
            </li>
          )
        })}
      </Component>
    )
  }
)
List.displayName = "List"

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, icon, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "flex items-start gap-3",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="mt-1 flex-shrink-0">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </li>
  )
)
ListItem.displayName = "ListItem"

export { List, ListItem }
export type { ListProps, ListItemProps }
