import * as React from "react"
import { cn } from "@/utils/cn"
import { MoonIcon, SunIcon } from "lucide-react"
import { ThemeToggle, THEME_CHANGE_EVENT } from "./theme-toggle"

interface ModernHeaderProps {
  title: string
  subtitle?: string
  logo?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  color?: 'yellow' | 'green' | 'purple'
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  title,
  subtitle,
  logo,
  actions,
  className,
  color = 'yellow',
}) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }
    return 'light'
  })
  
  // Listen for theme changes
  React.useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent
      setTheme(customEvent.detail.theme)
    }
    
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange)
    
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange)
    }
  }, [])

  // Get background color based on the color prop
  const getBackgroundColor = () => {
    switch (color) {
      case 'green':
        return 'bg-green-500 dark:bg-green-600'
      case 'purple':
        return 'bg-purple-500 dark:bg-purple-600'
      case 'yellow':
      default:
        return 'bg-[hsl(var(--vibrant-yellow))]'
    }
  }

  return (
    <header 
      className={cn(
        "flex items-center justify-between border-b p-4 md:px-6",
        "bg-gradient-to-r from-[hsl(var(--vibrant-light-purple))] to-[hsl(var(--vibrant-light-purple)/0.8)]",
        "dark:from-[hsl(var(--vibrant-black))] dark:to-[hsl(var(--vibrant-black)/0.9)]",
        "shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {logo && (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full shadow-md", getBackgroundColor())}>
            {logo}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {actions}
      </div>
    </header>
  )
} 