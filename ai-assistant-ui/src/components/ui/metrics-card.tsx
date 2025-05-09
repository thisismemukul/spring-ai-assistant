import * as React from "react"
import { cn } from "@/utils/cn"
import { ArrowUpRight } from "lucide-react"

interface MetricsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  className?: string
  onClick?: () => void
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
  onClick
}) => {
  return (
    <div 
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl p-5 shadow-md transition-all",
        "bg-[hsl(var(--vibrant-light-purple))] dark:bg-[hsl(var(--vibrant-black))] border border-[hsl(var(--vibrant-blue)/0.2)]",
        onClick && "cursor-pointer hover:shadow-lg hover:-translate-y-1",
        className
      )}
      onClick={onClick}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && (
          <div className="rounded-full bg-[hsl(var(--vibrant-blue)/0.1)] p-1.5 text-[hsl(var(--vibrant-blue))]">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{value}</span>
          
          {trend && (
            <div className="mt-1 flex items-center gap-1">
              <span 
                className={cn(
                  "text-xs",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
        
        {onClick && (
          <div className="rounded-full bg-[hsl(var(--vibrant-yellow))] p-1.5 text-[hsl(var(--vibrant-black))]">
            <ArrowUpRight size={16} />
          </div>
        )}
      </div>
      
      {/* Decorative element */}
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[hsl(var(--vibrant-yellow)/0.1)]"></div>
    </div>
  )
} 