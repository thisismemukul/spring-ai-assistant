import * as React from "react"
import { cn } from "@/utils/cn"

export interface ModernInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  buttonIcon?: React.ReactNode
  onButtonClick?: () => void
  buttonText?: string
}

export const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({ className, type, icon, buttonIcon, onButtonClick, buttonText, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        {icon && (
          <div className="absolute left-3 flex h-full items-center text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border-0 bg-[hsl(var(--vibrant-light-purple))] px-4 py-3 text-foreground shadow-sm transition-colors",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--vibrant-blue))]",
            icon && "pl-10",
            (buttonIcon || buttonText) && "pr-20",
            className
          )}
          ref={ref}
          {...props}
        />
        {(buttonIcon || buttonText) && (
          <button
            type="button"
            onClick={onButtonClick}
            className="absolute right-2 flex h-8 items-center justify-center rounded-lg bg-[hsl(var(--vibrant-yellow))] px-3 text-sm font-medium text-[hsl(var(--vibrant-black))] shadow-sm transition-all hover:brightness-105 active:scale-95"
          >
            <div className="flex items-center gap-1">
              {buttonText && <span>{buttonText}</span>}
              {buttonIcon && buttonIcon}
            </div>
          </button>
        )}
      </div>
    )
  }
)

ModernInput.displayName = "ModernInput" 