import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  // Base styles
  "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(({ className, size, ...props }, ref) => (
  <div ref={ref} className={cn(spinnerVariants({ size }), className)} {...props}>
    <span className="sr-only">Loading...</span>
  </div>
));
Spinner.displayName = "Spinner";

export { Spinner };
export type { SpinnerProps };
