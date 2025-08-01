import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends Omit<React.ComponentProps<"input">, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, helperText, error, size = 'md', ...props }, ref) => {
    const inputId = React.useId();
    
    const sizeStyles = {
      sm: 'h-8',
      md: 'h-10',
      lg: 'h-12'
    };

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          data-slot="input"
          className={cn(
            // Base styles
            "w-full min-w-0 bg-white border border-gray-300 rounded-none px-3",
            "text-base text-gray-900 placeholder:text-gray-500",
            
            // Size variants
            sizeStyles[size],
            
            // Interactive states
            "hover:border-gray-400",
            "focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none",
            
            // Error state
            error && "border-red-500 focus:border-red-500 focus:ring-red-100",
            
            // Disabled state
            "disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",
            
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={helperText || error ? `${inputId}-description` : undefined}
          {...props}
        />
        {(helperText || error) && (
          <p 
            id={`${inputId}-description`}
            className={cn(
              "text-sm",
              error ? "text-red-500" : "text-gray-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
