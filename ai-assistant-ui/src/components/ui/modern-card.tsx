import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "./card"
import { cn } from "@/utils/cn"

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean
  glassEffect?: boolean
  hoverEffect?: boolean
  fadeIn?: boolean
}

export const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, gradient = false, glassEffect = false, hoverEffect = true, fadeIn = false, ...props }, ref) => {
    const baseClasses = cn(
      className,
      "border-0",
      gradient && "bg-gradient-to-br from-primary-100 to-primary-200 dark:from-secondary dark:to-background",
      glassEffect && "glass-effect",
      hoverEffect && "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
      fadeIn && "opacity-0 animate-in fade-in duration-500"
    )

    return <Card ref={ref} className={baseClasses} {...props} />
  }
)
ModernCard.displayName = "ModernCard"

export const ModernCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader
    ref={ref}
    className={cn("px-6 py-5 font-medium", className)}
    {...props}
  />
))
ModernCardHeader.displayName = "ModernCardHeader"

export const ModernCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    className={cn("px-6 py-4", className)}
    {...props}
  />
))
ModernCardContent.displayName = "ModernCardContent"

export const ModernCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardFooter
    ref={ref}
    className={cn("px-6 py-5 flex justify-between items-center", className)}
    {...props}
  />
))
ModernCardFooter.displayName = "ModernCardFooter" 