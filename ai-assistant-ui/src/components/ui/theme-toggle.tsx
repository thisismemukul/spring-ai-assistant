import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/utils/cn"

interface ThemeToggleProps {
  className?: string
}

// Custom event for theme changes
export const THEME_CHANGE_EVENT = 'theme-change'

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    }
    return 'light'
  })

  // Apply theme changes to DOM
  React.useEffect(() => {
    const root = window.document.documentElement
    
    // Remove both theme classes first
    root.classList.remove('light', 'dark')
    
    // Add the current theme class
    root.classList.add(theme)
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }))
  }, [theme])
  
  // Listen for external theme changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (storedTheme && storedTheme !== theme) {
        setTheme(storedTheme)
      }
    }
    
    const handleClassChange = () => {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      if (currentTheme !== theme) {
        setTheme(currentTheme)
      }
    }
    
    // Listen for storage changes from other components
    window.addEventListener('storage', handleStorageChange)
    
    // Check for class changes every second
    const intervalId = setInterval(handleClassChange, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(intervalId)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-background transition-colors hover:bg-accent",
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="relative h-5 w-5">
        <span
          className={cn(
            "absolute inset-0 rotate-90 transform transition-all duration-300",
            theme === "light" 
              ? "rotate-0 opacity-100" 
              : "rotate-90 opacity-0"
          )}
        >
          <Sun className="h-5 w-5 transition-all" />
        </span>
        <span
          className={cn(
            "absolute inset-0 rotate-90 transform transition-all duration-300",
            theme === "dark" 
              ? "rotate-0 opacity-100" 
              : "-rotate-90 opacity-0"
          )}
        >
          <Moon className="h-5 w-5 transition-all" />
        </span>
      </div>
    </button>
  )
} 