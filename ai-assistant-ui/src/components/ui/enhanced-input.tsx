import * as React from "react"
import { cn } from "@/utils/cn"

export interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  trailingIcon?: React.ReactNode
  label?: string
  error?: string
  glassEffect?: boolean
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, type, icon, trailingIcon, label, error, glassEffect = false, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background transition-colors duration-200",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "shadow-sm hover:shadow-md focus:shadow-md",
              icon && "pl-10",
              trailingIcon && "pr-10",
              glassEffect && "backdrop-blur-sm bg-white/30 dark:bg-black/30 border-white/30 dark:border-white/10",
              error && "border-destructive focus-visible:ring-destructive focus-visible:border-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
          {trailingIcon && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              {trailingIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)
EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput } 