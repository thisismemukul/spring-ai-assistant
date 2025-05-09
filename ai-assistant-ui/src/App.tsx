import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Chat from './pages/Chat'
import Recipe from './pages/Recipe'
import DietPlan from './pages/DietPlan'
import ExercisePlan from './pages/ExercisePlan'
import HomePage from './pages/HomePage'
import { BackgroundGradient } from './components/ui/background-gradient'
import { ApiDebug } from './components/ui/api-debug'

// Theme initialization
function initializeTheme() {
  const root = document.documentElement
  const savedTheme = localStorage.getItem('theme')
  const systemThemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  // First, remove any existing theme classes
  root.classList.remove('light', 'dark')
  
  // Then apply the appropriate theme
  if (savedTheme === 'dark' || (!savedTheme && systemThemeDark)) {
    root.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    root.classList.add('light')
    localStorage.setItem('theme', 'light')
  }
}

function App() {
  useEffect(() => {
    // Initialize theme on component mount
    initializeTheme()
    
    // Add listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      // Only update if no user preference is saved
      if (!localStorage.getItem('theme')) {
        initializeTheme()
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <BackgroundGradient containerClassName="min-h-screen w-full">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/recipe" element={<Recipe />} />
        <Route path="/diet-plan" element={<DietPlan />} />
        <Route path="/exercise-plan" element={<ExercisePlan />} />
      </Routes>
      
      {/* API Debug Component */}
      {process.env.NODE_ENV === 'development' && <ApiDebug />}
    </BackgroundGradient>
  )
}

export default App 