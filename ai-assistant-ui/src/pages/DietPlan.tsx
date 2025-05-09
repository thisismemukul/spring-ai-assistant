import { useState, FormEvent, useEffect } from 'react'
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import { UtensilsIcon, CheckIcon, CalendarIcon, AlertCircleIcon, Clock3Icon, ShoppingBag, ClipboardList, Leaf, Flame, Droplets, Cookie, Utensils, ImageIcon } from 'lucide-react'
import { extractErrorMessage } from '../utils/errorHandling'
import { AppLayout } from '../components/ui/app-layout'
import { ModernHeader } from '../components/ui/modern-header'
import { ModernCard } from '../components/ui/modern-card'
import ErrorMessage from '../components/ErrorMessage'
import { MDRenderer } from '../components/MDRenderer'
import { MODELS, apiService, TitleImage } from '../services/api'

// NutrientGauge component for displaying nutritional values with bars
const NutrientGauge = ({ label, value, max, unit, color, animate = true }: { 
  label: string; 
  value: string; 
  max?: number;
  unit: string;
  color: string;
  animate?: boolean;
}) => {
  // Parse the numeric value from string like "20g", "350", "10%" or "400 per serving"
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const percentage = max ? Math.min((numericValue / max) * 100, 100) : 50;
  
  return (
    <div className="flex flex-col">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: animate ? `${percentage}%` : '0%' }}
        />
      </div>
    </div>
  );
};

// MacronutrientChart component for pie chart visualization
const MacronutrientChart = ({ 
  carbs, 
  protein, 
  fat 
}: { 
  carbs: number; 
  protein: number; 
  fat: number;
}) => {
  const total = carbs + protein + fat;
  const carbsPercent = Math.round((carbs / total) * 100) || 33;
  const proteinPercent = Math.round((protein / total) * 100) || 33;
  const fatPercent = Math.round((fat / total) * 100) || 34;
  
  // Create a conic gradient for the pie chart
  const conicGradient = `conic-gradient(
    #3b82f6 0% ${fatPercent}%, 
    #10b981 ${fatPercent}% ${fatPercent + proteinPercent}%, 
    #f59e0b ${fatPercent + proteinPercent}% 100%
  )`;
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="h-28 w-28 md:h-36 md:w-36 rounded-full"
        style={{ background: conicGradient }}
      >
        <div className="h-full w-full flex items-center justify-center">
          <div className="h-16 w-16 md:h-24 md:w-24 bg-white rounded-full flex items-center justify-center">
            <span className="text-[10px] md:text-xs font-medium text-center">
              {carbsPercent}% / {proteinPercent}% / {fatPercent}%
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full mt-2 md:mt-3 text-[10px] md:text-xs">
        <div className="flex items-center">
          <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-[#f59e0b] mr-1"></div>
          <span>Carbs</span>
        </div>
        <div className="flex items-center">
          <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-[#10b981] mr-1"></div>
          <span>Protein</span>
        </div>
        <div className="flex items-center">
          <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-[#3b82f6] mr-1"></div>
          <span>Fat</span>
        </div>
      </div>
    </div>
  );
};

// Define meal types that may come in the response
type MealType = 'BREAKFAST' | 'MID_MORNING_SNACK' | 'LUNCH' | 'AFTERNOON_SNACK' | 'DINNER';

// Nutritional information structure
interface NutritionalInfo {
  calories: string;
  totalFat: string;
  saturatedFat: string;
  polyunsaturatedFat: string;
  monounsaturatedFat: string;
  transFat: string;
  cholesterol: string;
  sodium: string;
  potassium: string;
  totalCarbohydrates: string;
  dietaryFiber: string;
  sugars: string;
  protein: string;
  vitaminA: string;
  vitaminC: string;
  calcium: string;
  [key: string]: string;
}

// Meal suggestion structure
interface MealSuggestion {
  title: string;
  ingredients: string[];
  instructions: string[];
  portionSize: string;
  nutritionalInformation: NutritionalInfo;
}

// Daily meal item
interface DailyMealItem {
  mealTypes: MealType;
  mealSuggestions: MealSuggestion;
}

// Updated Diet Plan Response structure
export interface DietPlanResponse {
  dietGoal?: string;
  foodPreferences?: string;
  dietaryRestrictions?: string;
  weeklySchedule?: string;
  dailyMealPlan?: DailyMealItem[];
  
  // Legacy fields (keeping for backward compatibility)
  title?: string;
  overview?: string;
  weeklyPlan?: {
    [key: string]: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks: string[];
    }
  };
  nutritionalOverview?: {
    calories: string;
    macros: {
      protein: string;
      carbs: string;
      fat: string;
    }
  };
  tips?: string[];
  warnings?: string[];
}

// Helper function to format meal type
const formatMealType = (mealType: MealType): string => {
  switch (mealType) {
    case 'BREAKFAST':
      return 'Breakfast';
    case 'MID_MORNING_SNACK':
      return 'Mid-Morning Snack';
    case 'LUNCH':
      return 'Lunch';
    case 'AFTERNOON_SNACK':
      return 'Afternoon Snack';
    case 'DINNER':
      return 'Dinner';
    default:
      // Type assertion to handle TypeScript's never type for exhaustive switch cases
      return (mealType as string).replace(/_/g, ' ').toLowerCase()
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }
};

export default function DietPlan() {
  const [dietGoal, setDietGoal] = useState('')
  const [foodPreferences, setFoodPreferences] = useState('')
  const [dietaryRestrictions, setDietaryRestrictions] = useState('')
  const [model, setModel] = useState(MODELS.OPEN_AI)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [dietPlan, setDietPlan] = useState<DietPlanResponse | null>(null)
  const [dietImages, setDietImages] = useState<TitleImage[] | null>(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [activeDay, setActiveDay] = useState('monday')
  const [activeMeal, setActiveMeal] = useState<MealType | null>(null)
  const [animateNutrition, setAnimateNutrition] = useState(false)
  
  // Trigger animation when diet plan loads
  useEffect(() => {
    if (dietPlan) {
      // Slight delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setAnimateNutrition(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [dietPlan])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!dietGoal.trim()) return

    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    setDietPlan(null)
    setDietImages(null)
    setAnimateNutrition(false)

    try {
      // Make API call using apiService
      const response = await apiService.createDietPlan(
        dietGoal,
        foodPreferences,
        dietaryRestrictions,
        model
      )
      
      // Transform API response to match the component's expected format if needed
      const dietPlanData = response as unknown as DietPlanResponse;
      setDietPlan(dietPlanData)
      
      // Set the first meal as active if available
      if (dietPlanData.dailyMealPlan && dietPlanData.dailyMealPlan.length > 0) {
        setActiveMeal(dietPlanData.dailyMealPlan[0].mealTypes);
      }
      
      setSuccessMessage('Diet plan generated successfully!')
    } catch (error) {
      console.error('Error generating diet plan:', error)
      // Extract user-friendly error message
      setError(extractErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const generateImages = async () => {
    if (!dietPlan) return
    
    setIsGeneratingImage(true)
    setError('')
    setSuccessMessage('')
    
    try {
      // Map frontend diet plan to the format expected by the backend
      const backendDietPlan: DietPlanResponse = {
        dietGoal: dietPlan.dietGoal || '',
        foodPreferences: dietPlan.foodPreferences || '',
        dietaryRestrictions: dietPlan.dietaryRestrictions || '',
        weeklySchedule: dietPlan.weeklySchedule || '',
        dailyMealPlan: dietPlan.dailyMealPlan || []
      };
      
      const imageResponse = await apiService.generateDietImages(backendDietPlan)
      setDietImages(imageResponse)
      setSuccessMessage('Images generated successfully!')
    } catch (error) {
      console.error('Error generating images:', error)
      setError(extractErrorMessage(error) || 'Failed to generate images. Please try again.')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Format weekday name (for legacy format)
  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <AppLayout>
      <div className="w-full max-w-6xl mx-auto px-1 sm:px-3 md:px-4">
        <ModernHeader
          title="Diet Plan Generator"
          subtitle="Create a personalized diet plan based on your goals and preferences!"
          logo={<UtensilsIcon className="h-5 w-5 text-white" />}
          color="green"
        />

        {successMessage && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError('')}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <ModernCard className="p-4 md:p-5">
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div>
                  <label htmlFor="dietGoal" className="block text-sm font-medium mb-1">
                    Diet Goal (required)
                  </label>
                  <textarea
                    id="dietGoal"
                    rows={4}
                    className="min-h-[50px] max-h-[200px] w-full resize-none rounded-xl border-0 bg-[hsl(var(--vibrant-light-purple))] p-4 text-foreground shadow-md focus:outline-none focus:ring-1 focus:ring-[hsl(var(--vibrant-blue))]"
                    placeholder="Describe your diet goals (e.g., lose weight, gain muscle, etc.)"
                    value={dietGoal}
                    onChange={(e) => setDietGoal(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="foodPreferences" className="block text-sm font-medium mb-1">
                    Food Preferences (optional)
                  </label>
                  <input
                    type="text"
                    id="foodPreferences"
                    className="h-12 w-full rounded-xl border-0 bg-[hsl(var(--vibrant-light-purple))] px-4 py-3 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--vibrant-blue))]"
                    placeholder="E.g., fruits, chicken, whole grains, or 'none'"
                    value={foodPreferences}
                    onChange={(e) => setFoodPreferences(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="dietaryRestrictions" className="block text-sm font-medium mb-1">
                    Dietary Restrictions (optional)
                  </label>
                  <input
                    type="text"
                    id="dietaryRestrictions"
                    className="h-12 w-full rounded-xl border-0 bg-[hsl(var(--vibrant-light-purple))] px-4 py-3 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--vibrant-blue))]"
                    placeholder="E.g., vegetarian, gluten-free, or 'none'"
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="dietModel" className="block text-sm font-medium mb-1">
                    AI Model
                  </label>
                  <select
                    id="dietModel"
                    className="h-12 w-full rounded-xl border-0 bg-[hsl(var(--vibrant-light-purple))] px-4 py-3 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--vibrant-blue))]"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  >
                    <option value={MODELS.OPEN_AI}>OpenAI</option>
                    <option value={MODELS.O_LLAMA_AI}>Ollama</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-12 bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md hover:shadow-lg hover:from-green-500 hover:to-green-400 active:translate-y-0.5 transition-all"
                  disabled={isLoading || !dietGoal.trim()}
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Generating...
                    </>
                  ) : (
                    'Generate Diet Plan'
                  )}
                </button>
              </form>
            </ModernCard>
          </div>
          
          <div className="md:col-span-2">
            {dietPlan && (
              <div className="space-y-6">
                <ModernCard className="p-5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <h2 className="text-xl font-bold flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                      {dietPlan.title || 'Your Personalized Diet Plan'}
                    </h2>
                    <button
                      onClick={generateImages}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md hover:shadow-lg hover:from-green-500 hover:to-green-400 active:translate-y-0.5 transition-all"
                      disabled={isGeneratingImage}
                    >
                      {isGeneratingImage ? (
                        <>
                          <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Generate Images
                        </>
                      )}
                    </button>
                  </div>
                  
                  {dietPlan.overview && (
                    <div className="mb-4 text-muted-foreground">
                      <MDRenderer content={dietPlan.overview} />
                    </div>
                  )}

                  {/* Display generated images if available */}
                  {dietImages && dietImages.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Generated Images</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {dietImages.map((image, index) => (
                          <div key={index} className="overflow-hidden rounded-lg border shadow-sm">
                            <div className="aspect-video w-full relative bg-gray-100">
                              <img 
                                src={image.imageUrl} 
                                alt={image.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-2 bg-white">
                              <h4 className="text-sm font-medium truncate">{image.title}</h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Daily meal plan */}
                  {dietPlan.dailyMealPlan && dietPlan.dailyMealPlan.length > 0 && (
                    <>
                      {/* Meal selector tabs */}
                      <div className="mb-4">
                        <div className="flex overflow-x-auto pb-2 -mx-1">
                          {dietPlan.dailyMealPlan.map((mealItem) => (
                            <button
                              key={mealItem.mealTypes}
                              onClick={() => setActiveMeal(mealItem.mealTypes)}
                              className={`mx-1 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                                activeMeal === mealItem.mealTypes
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              {formatMealType(mealItem.mealTypes)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active meal details */}
                      {activeMeal && (
                        <div className="space-y-4">
                          {dietPlan.dailyMealPlan.filter(meal => meal.mealTypes === activeMeal).map((mealItem, index) => (
                            <div key={index} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                              {/* Meal header */}
                              <div className="p-4 border-b bg-green-50">
                                <h3 className="font-medium text-lg flex items-center text-green-900">
                                  <Clock3Icon className="h-5 w-5 mr-2 text-green-600" />
                                  {mealItem.mealSuggestions.title}
                                </h3>
                                <p className="text-xs text-green-700 mt-1">Portion: {mealItem.mealSuggestions.portionSize}</p>
                              </div>
                              
                              {/* Meal content */}
                              <div className="p-4">
                                {/* Ingredients section with improved styling */}
                                <div className="mb-6">
                                  <h4 className="font-medium mb-3 text-sm flex items-center">
                                    <ShoppingBag className="h-4 w-4 mr-2 text-green-600" />
                                    Ingredients
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {mealItem.mealSuggestions.ingredients.map((ingredient, idx) => (
                                      <div key={idx} className="flex items-center py-1.5 px-2 rounded-md bg-green-50 border border-green-100">
                                        <div className="h-3 w-3 mr-2 rounded-full bg-green-200 flex-shrink-0"></div>
                                        <span className="text-sm">{ingredient}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Instructions section with improved styling */}
                                <div className="mb-6">
                                  <h4 className="font-medium mb-3 text-sm flex items-center">
                                    <ClipboardList className="h-4 w-4 mr-2 text-green-600" />
                                    Instructions
                                  </h4>
                                  <div className="space-y-3">
                                    {mealItem.mealSuggestions.instructions.map((instruction, idx) => (
                                      <div key={idx} className="flex items-start">
                                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-100 text-green-800 text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                                          {idx + 1}
                                        </div>
                                        <p className="text-sm">{instruction}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Nutritional Information section with improved styling */}
                                <div>
                                  <h4 className="font-medium mb-3 text-sm flex items-center">
                                    <Utensils className="h-4 w-4 mr-2 text-gray-600" />
                                    Nutritional Information
                                  </h4>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    {/* Left column with macronutrients and pie chart */}
                                    <div className="space-y-4 md:space-y-5">
                                      {/* Calories highlight */}
                                      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 rounded-lg border border-amber-200 flex items-center shadow-sm">
                                        <div className="p-2 bg-amber-200 rounded-full mr-3">
                                          <Flame className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                          <div className="text-xs text-amber-700 font-medium">Calories</div>
                                          <div className="text-xl font-bold text-amber-900">
                                            {mealItem.mealSuggestions.nutritionalInformation.calories}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Macronutrient Chart */}
                                      <div className="bg-white p-3 rounded-lg border shadow-sm">
                                        <h4 className="text-xs font-medium mb-2 text-center">Macronutrients Distribution</h4>
                                        <div className="flex justify-center">
                                          <div className="w-[80%] max-w-[250px]">
                                            <MacronutrientChart 
                                              carbs={parseInt(mealItem.mealSuggestions.nutritionalInformation.totalCarbohydrates?.replace(/[^0-9.]/g, '')) || 0}
                                              protein={parseInt(mealItem.mealSuggestions.nutritionalInformation.protein?.replace(/[^0-9.]/g, '')) || 0}
                                              fat={parseInt(mealItem.mealSuggestions.nutritionalInformation.totalFat?.replace(/[^0-9.]/g, '')) || 0}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Key macronutrients */}
                                      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
                                        <h4 className="text-sm font-medium mb-2">Macronutrients</h4>
                                        <NutrientGauge 
                                          label="Carbohydrates" 
                                          value={mealItem.mealSuggestions.nutritionalInformation.totalCarbohydrates || '0g'}
                                          max={50} 
                                          unit="g"
                                          color="bg-[#f59e0b]" 
                                          animate={animateNutrition}
                                        />
                                        <NutrientGauge 
                                          label="Protein" 
                                          value={mealItem.mealSuggestions.nutritionalInformation.protein || '0g'}
                                          max={50} 
                                          unit="g"
                                          color="bg-[#10b981]" 
                                          animate={animateNutrition}
                                        />
                                        <NutrientGauge 
                                          label="Total Fat" 
                                          value={mealItem.mealSuggestions.nutritionalInformation.totalFat || '0g'}
                                          max={65} 
                                          unit="g"
                                          color="bg-[#3b82f6]" 
                                          animate={animateNutrition}
                                        />
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                          <div className="text-xs">
                                            <span className="text-muted-foreground">Saturated: </span>
                                            <span className="font-medium">
                                              {mealItem.mealSuggestions.nutritionalInformation.saturatedFat || '0g'}
                                            </span>
                                          </div>
                                          <div className="text-xs">
                                            <span className="text-muted-foreground">Trans: </span>
                                            <span className="font-medium">
                                              {mealItem.mealSuggestions.nutritionalInformation.transFat || '0g'}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Right column with other nutrients */}
                                    <div className="space-y-4 md:space-y-5">
                                      {/* Cholesterol and Sodium */}
                                      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
                                        <h4 className="text-sm font-medium mb-2 flex items-center">
                                          <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                                          Cholesterol & Sodium
                                        </h4>
                                        <NutrientGauge 
                                          label="Cholesterol" 
                                          value={mealItem.mealSuggestions.nutritionalInformation.cholesterol || '0mg'}
                                          max={300} 
                                          unit="mg"
                                          color="bg-rose-400" 
                                          animate={animateNutrition}
                                        />
                                        <NutrientGauge 
                                          label="Sodium" 
                                          value={mealItem.mealSuggestions.nutritionalInformation.sodium || '0mg'}
                                          max={2300} 
                                          unit="mg"
                                          color="bg-orange-400" 
                                          animate={animateNutrition}
                                        />
                                        <NutrientGauge 
                                          label="Potassium" 
                                          value={mealItem.mealSuggestions.nutritionalInformation.potassium || '0mg'}
                                          max={4700} 
                                          unit="mg"
                                          color="bg-green-400" 
                                          animate={animateNutrition}
                                        />
                                      </div>
                                      
                                      {/* Carb details */}
                                      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
                                        <h4 className="text-sm font-medium mb-2 flex items-center">
                                          <Cookie className="h-4 w-4 mr-1 text-amber-500" />
                                          Carbohydrate Details
                                        </h4>
                                        <div className="flex justify-between items-center">
                                          <div className="text-sm">Dietary Fiber</div>
                                          <div className="text-sm font-medium">
                                            {mealItem.mealSuggestions.nutritionalInformation.dietaryFiber || '0g'}
                                          </div>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                                          <div 
                                            className="h-full bg-amber-300 transition-all duration-1000 ease-out" 
                                            style={{ width: animateNutrition ? `${Math.min(parseInt(mealItem.mealSuggestions.nutritionalInformation.dietaryFiber?.replace(/[^0-9.]/g, '') || '0') / 0.25 || 50, 100)}%` : '0%' }}
                                          ></div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <div className="text-sm">Sugars</div>
                                          <div className="text-sm font-medium">
                                            {mealItem.mealSuggestions.nutritionalInformation.sugars || '0g'}
                                          </div>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-red-300 transition-all duration-1000 ease-out" 
                                            style={{ width: animateNutrition ? `${Math.min(parseInt(mealItem.mealSuggestions.nutritionalInformation.sugars?.replace(/[^0-9.]/g, '') || '0') / 0.25 || 20, 100)}%` : '0%' }}
                                          ></div>
                                        </div>
                                      </div>
                                      
                                      {/* Vitamins and Minerals */}
                                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200 shadow-sm">
                                        <h4 className="text-sm font-medium mb-3 flex items-center">
                                          <Leaf className="h-4 w-4 mr-1 text-emerald-500" />
                                          Vitamins & Minerals
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                          <div className="bg-white/80 p-2 rounded border border-emerald-100">
                                            <div className="text-xs text-emerald-700">Vitamin A</div>
                                            <div className="text-lg font-bold text-emerald-900">
                                              {mealItem.mealSuggestions.nutritionalInformation.vitaminA || '0%'}
                                            </div>
                                          </div>
                                          <div className="bg-white/80 p-2 rounded border border-emerald-100">
                                            <div className="text-xs text-emerald-700">Vitamin C</div>
                                            <div className="text-lg font-bold text-emerald-900">
                                              {mealItem.mealSuggestions.nutritionalInformation.vitaminC || '0%'}
                                            </div>
                                          </div>
                                          <div className="bg-white/80 p-2 rounded border border-emerald-100">
                                            <div className="text-xs text-emerald-700">Calcium</div>
                                            <div className="text-lg font-bold text-emerald-900">
                                              {mealItem.mealSuggestions.nutritionalInformation.calcium || '0mg'}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Legacy weekly plan - keep for backward compatibility */}
                  {!dietPlan.dailyMealPlan && dietPlan.weeklyPlan && (
                    <>
                      {/* Day selector tabs */}
                      <div className="mb-4">
                        <div className="flex overflow-x-auto pb-2 -mx-1">
                          {Object.keys(dietPlan.weeklyPlan).map((day) => (
                            <button
                              key={day}
                              onClick={() => setActiveDay(day)}
                              className={`mx-1 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                                activeDay === day
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              {formatDay(day)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active day meal plan */}
                      {dietPlan.weeklyPlan[activeDay] && (
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <h4 className="font-medium mb-2 flex items-center text-sm">
                              <Clock3Icon className="h-4 w-4 mr-2 text-primary/70" />
                              Breakfast
                            </h4>
                            <MDRenderer content={dietPlan.weeklyPlan[activeDay].breakfast} />
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <h4 className="font-medium mb-2 flex items-center text-sm">
                              <Clock3Icon className="h-4 w-4 mr-2 text-primary/70" />
                              Lunch
                            </h4>
                            <MDRenderer content={dietPlan.weeklyPlan[activeDay].lunch} />
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <h4 className="font-medium mb-2 flex items-center text-sm">
                              <Clock3Icon className="h-4 w-4 mr-2 text-primary/70" />
                              Dinner
                            </h4>
                            <MDRenderer content={dietPlan.weeklyPlan[activeDay].dinner} />
                          </div>
                          
                          {dietPlan.weeklyPlan[activeDay].snacks && dietPlan.weeklyPlan[activeDay].snacks.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border shadow-sm">
                              <h4 className="font-medium mb-2 flex items-center text-sm">
                                <Clock3Icon className="h-4 w-4 mr-2 text-primary/70" />
                                Snacks
                              </h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {dietPlan.weeklyPlan[activeDay].snacks.map((snack, idx) => (
                                  <li key={idx}>{snack}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </ModernCard>

                {/* Tips and warnings - legacy support */}
                {dietPlan.tips && dietPlan.tips.length > 0 && (
                  <ModernCard className="p-5">
                    <h3 className="font-medium mb-3 text-lg flex items-center">
                      <CheckIcon className="h-5 w-5 mr-2 text-primary" />
                      Tips for Success
                    </h3>
                    <ul className="space-y-2">
                      {dietPlan.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-2 mt-0.5 flex-shrink-0 text-xs">
                            {idx + 1}
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </ModernCard>
                )}

                {dietPlan.warnings && dietPlan.warnings.length > 0 && (
                  <ModernCard className="p-5 border-yellow-200">
                    <h3 className="font-medium mb-3 text-lg flex items-center text-yellow-700">
                      <AlertCircleIcon className="h-5 w-5 mr-2 text-yellow-500" />
                      Important Notes
                    </h3>
                    <ul className="space-y-2">
                      {dietPlan.warnings.map((warning, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="h-5 w-5 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 mr-2 mt-0.5 flex-shrink-0 text-xs">
                            !
                          </span>
                          <span className="text-yellow-700">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </ModernCard>
                )}
              </div>
            )}
            
            {!isLoading && !dietPlan && !error && (
              <ModernCard className="flex items-center justify-center p-12">
                <div className="text-center text-muted-foreground">
                  <UtensilsIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="mb-2 font-medium">Your diet plan will appear here</p>
                  <p className="text-sm">Fill out the form and click "Generate Diet Plan"</p>
                </div>
              </ModernCard>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 