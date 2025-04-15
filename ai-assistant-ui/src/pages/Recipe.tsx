import { useState, FormEvent, useEffect } from 'react'
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import { extractErrorMessage } from '../utils/errorHandling'
import ErrorMessage from '../components/ErrorMessage'
import { apiService, RecipeResponse, RecipeImagesResponse, MODELS, ImageItem } from '../services/api'
import { AppLayout } from '../components/ui/app-layout'
import { ModernCard } from '../components/ui/modern-card'
import { ModernHeader } from '../components/ui/modern-header'
import { UtensilsIcon, Flame, Droplets, Utensils, Leaf, Cookie, ShoppingBag, ClipboardList, Lightbulb, ChefHat, CheckCircle } from 'lucide-react'

// Helper function to safely access nutritional information
const getNutrientValue = (
  recipe: RecipeResponse, 
  key: string
): string => {
  // Check nutritionalInfo object first
  if (recipe.nutritionalInfo && typeof recipe.nutritionalInfo === 'object' && key in recipe.nutritionalInfo) {
    return recipe.nutritionalInfo[key];
  }
  
  // Then check nutritionalInformation object
  if (recipe.nutritionalInformation && key in recipe.nutritionalInformation) {
    return recipe.nutritionalInformation[key];
  }
  
  // Default fallback
  return '0';
};

// Helper component for nutritional value display
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

// Component for macronutrient pie chart
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

export default function Recipe() {
  const [ingredients, setIngredients] = useState('')
  const [cuisine, setCuisine] = useState('any')
  const [dietaryRestrictions, setDietaryRestrictions] = useState('')
  const [model, setModel] = useState(MODELS.OPEN_AI)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null)
  const [recipeImages, setRecipeImages] = useState<RecipeImagesResponse | null>(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [animateNutrition, setAnimateNutrition] = useState(false)
  
  // Trigger animation when recipe loads
  useEffect(() => {
    if (recipe) {
      // Slight delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setAnimateNutrition(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [recipe])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!ingredients.trim()) return

    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    setRecipe(null)
    setRecipeImages(null)
    setAnimateNutrition(false)

    try {
      // Use our API service
      const recipeData = await apiService.createRecipe(
        ingredients, 
        cuisine, 
        dietaryRestrictions, 
        model
      )
      
      setRecipe(recipeData)
      setSuccessMessage('Recipe generated successfully!')
    } catch (error) {
      console.error('Error generating recipe:', error)
      setError(extractErrorMessage(error) || 'Failed to generate recipe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateImage = async () => {
    if (!recipe) return
    
    setIsGeneratingImage(true)
    setError('')
    setSuccessMessage('')
    
    try {
      // Use our API service for image generation
      const imageResponse = await apiService.generateRecipeImages(recipe)
      setRecipeImages(imageResponse)
      setSuccessMessage('Images generated successfully!')
    } catch (error) {
      console.error('Error generating image:', error)
      setError(extractErrorMessage(error) || 'Failed to generate images. Please try again.')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return (
    <AppLayout>
      <div className="w-full max-w-6xl mx-auto px-1 sm:px-3 md:px-4">
        <ModernHeader
          title="Recipe Generator"
          subtitle="Enter ingredients and preferences to generate a delicious recipe!"
          logo={<UtensilsIcon className="h-5 w-5 text-white" />}
          color="yellow"
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
                  <label htmlFor="ingredients" className="block text-sm font-medium mb-1">
                    Ingredients (required)
                  </label>
                  <textarea
                    id="ingredients"
                    rows={4}
                    className="min-h-[50px] max-h-[200px] w-full resize-none rounded-xl border-0 bg-[hsl(var(--vibrant-light-purple))] p-4 text-foreground shadow-md focus:outline-none focus:ring-1 focus:ring-[hsl(var(--vibrant-blue))]"
                    placeholder="Enter ingredients separated by commas"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cuisine" className="block text-sm font-medium mb-1">
                    Cuisine (optional)
                  </label>
                  <input
                    type="text"
                    id="cuisine"
                    className="h-12 w-full rounded-xl border-0 bg-[hsl(var(--vibrant-light-purple))] px-4 py-3 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--vibrant-blue))]"
                    placeholder="E.g., Italian, Mexican, Chinese, or 'none'"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
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
                  <label htmlFor="recipeModel" className="block text-sm font-medium mb-1">
                    AI Model
                  </label>
                  <select
                    id="recipeModel"
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
                  className="modern-button w-full"
                  disabled={isLoading || !ingredients.trim()}
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" />
                      Generating...
                    </>
                  ) : (
                    'Generate Recipe'
                  )}
                </button>
              </form>
            </ModernCard>
          </div>
          
          <div className="md:col-span-2">
            {recipe && (
              <ModernCard className="p-4 md:p-5">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <h2 className="text-xl font-bold">{recipe.title}</h2>
                  <button
                    onClick={generateImage}
                    className="modern-button w-full sm:w-auto"
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? (
                      <>
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" />
                        Generating...
                      </>
                    ) : (
                      'Generate Images'
                    )}
                  </button>
                </div>
                
                {/* Title Image */}
                {recipeImages?.titleImage && (
                  <div className="mb-5">
                    <div className="rounded-lg overflow-hidden shadow-md relative">
                      <img 
                        src={`data:image/png;base64,${recipeImages.titleImage.image}`} 
                        alt={recipeImages.titleImage.title} 
                        className="w-full h-[200px] sm:h-[250px] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                        <h3 className="text-lg md:text-xl font-bold drop-shadow-md">{recipeImages.titleImage.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <div className="bg-amber-500/90 rounded-full px-2 py-1 text-xs font-medium shadow-sm flex items-center">
                            <Flame className="h-3 w-3 mr-1" />
                            {recipe.nutritionalInfo && typeof recipe.nutritionalInfo === 'object' && (
                              <span>
                                {getNutrientValue(recipe, 'calories')} calories
                              </span>
                            )}
                          </div>
                          <div className="bg-blue-500/90 rounded-full px-2 py-1 text-xs font-medium shadow-sm flex items-center">
                            <Utensils className="h-3 w-3 mr-1" />
                            <span>{recipe.ingredients.length} ingredients</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Use the nutritionalInfo or nutritionalInformation field, whichever is available */}
                {(recipe.nutritionalInfo || recipe.nutritionalInformation) && 
                  (typeof recipe.nutritionalInfo === 'object' || typeof recipe.nutritionalInformation === 'object') && (
                  <div className="mb-5">
                    <h3 className="font-medium mb-3 md:mb-4 text-base md:text-lg flex items-center">
                      <Utensils className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Nutritional Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Left column with macronutrients and pie chart */}
                      <div className="space-y-4 md:space-y-6">
                        {/* Calories highlight */}
                        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 md:p-4 rounded-lg border border-amber-200 flex items-center shadow-sm">
                          <div className="p-2 md:p-3 bg-amber-200 rounded-full mr-3 md:mr-4">
                            <Flame className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
                          </div>
                          <div>
                            <div className="text-xs md:text-sm text-amber-700 font-medium">Calories</div>
                            <div className="text-xl md:text-2xl font-bold text-amber-900">
                              {getNutrientValue(recipe, 'calories')}
                            </div>
                          </div>
                        </div>
                        
                        {/* Macronutrient Chart - smaller on mobile */}
                        <div className="bg-white p-3 md:p-4 rounded-lg border shadow-sm">
                          <h4 className="text-xs md:text-sm font-medium mb-2 md:mb-3 text-center">Macronutrients Distribution</h4>
                          <div className="flex justify-center">
                            <div className="w-[80%] md:w-full max-w-[250px]">
                              <MacronutrientChart 
                                carbs={parseInt(getNutrientValue(recipe, 'totalCarbohydrates').replace(/[^0-9.]/g, '')) || 0}
                                protein={parseInt(getNutrientValue(recipe, 'protein').replace(/[^0-9.]/g, '')) || 0}
                                fat={parseInt(getNutrientValue(recipe, 'totalFat').replace(/[^0-9.]/g, '')) || 0}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Key macronutrients */}
                        <div className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
                          <h4 className="text-sm font-medium mb-3">Macronutrients</h4>
                          <NutrientGauge 
                            label="Carbohydrates" 
                            value={getNutrientValue(recipe, 'totalCarbohydrates')}
                            max={50} 
                            unit="g"
                            color="bg-[#f59e0b]" 
                            animate={animateNutrition}
                          />
                          <NutrientGauge 
                            label="Protein" 
                            value={getNutrientValue(recipe, 'protein')}
                            max={50} 
                            unit="g"
                            color="bg-[#10b981]" 
                            animate={animateNutrition}
                          />
                          <NutrientGauge 
                            label="Total Fat" 
                            value={getNutrientValue(recipe, 'totalFat')}
                            max={65} 
                            unit="g"
                            color="bg-[#3b82f6]" 
                            animate={animateNutrition}
                          />
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            <div className="text-xs">
                              <span className="text-muted-foreground">Saturated: </span>
                              <span className="font-medium">
                                {getNutrientValue(recipe, 'saturatedFat')}
                              </span>
                            </div>
                            <div className="text-xs">
                              <span className="text-muted-foreground">Trans: </span>
                              <span className="font-medium">
                                {getNutrientValue(recipe, 'transFat')}
                              </span>
                            </div>
                            <div className="text-xs">
                              <span className="text-muted-foreground">Mono: </span>
                              <span className="font-medium">
                                {getNutrientValue(recipe, 'monounsaturatedFat')}
                              </span>
                            </div>
                            <div className="text-xs">
                              <span className="text-muted-foreground">Poly: </span>
                              <span className="font-medium">
                                {getNutrientValue(recipe, 'polyunsaturatedFat')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right column with other nutrients */}
                      <div className="space-y-4 md:space-y-6">
                        {/* Cholesterol and Sodium */}
                        <div className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
                          <h4 className="text-sm font-medium mb-3 flex items-center">
                            <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                            Cholesterol & Sodium
                          </h4>
                          <NutrientGauge 
                            label="Cholesterol" 
                            value={getNutrientValue(recipe, 'cholesterol')}
                            max={300} 
                            unit="mg"
                            color="bg-rose-400" 
                            animate={animateNutrition}
                          />
                          <NutrientGauge 
                            label="Sodium" 
                            value={getNutrientValue(recipe, 'sodium')}
                            max={2300} 
                            unit="mg"
                            color="bg-orange-400" 
                            animate={animateNutrition}
                          />
                          <NutrientGauge 
                            label="Potassium" 
                            value={getNutrientValue(recipe, 'potassium')}
                            max={4700} 
                            unit="mg"
                            color="bg-green-400" 
                            animate={animateNutrition}
                          />
                        </div>
                        
                        {/* Carb details */}
                        <div className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
                          <h4 className="text-sm font-medium mb-3 flex items-center">
                            <Cookie className="h-4 w-4 mr-1 text-amber-500" />
                            Carbohydrate Details
                          </h4>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">Dietary Fiber</div>
                            <div className="text-sm font-medium">
                              {getNutrientValue(recipe, 'dietaryFiber')}
                            </div>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div 
                              className="h-full bg-amber-300 transition-all duration-1000 ease-out" 
                              style={{ width: animateNutrition ? `${Math.min(parseInt(getNutrientValue(recipe, 'dietaryFiber').replace(/[^0-9.]/g, '')) / 0.25 || 50, 100)}%` : '0%' }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm">Sugars</div>
                            <div className="text-sm font-medium">
                              {getNutrientValue(recipe, 'sugars')}
                            </div>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-300 transition-all duration-1000 ease-out" 
                              style={{ width: animateNutrition ? `${Math.min(parseInt(getNutrientValue(recipe, 'sugars').replace(/[^0-9.]/g, '')) / 0.25 || 20, 100)}%` : '0%' }}
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
                                {getNutrientValue(recipe, 'vitaminA')}
                              </div>
                            </div>
                            <div className="bg-white/80 p-2 rounded border border-emerald-100">
                              <div className="text-xs text-emerald-700">Vitamin C</div>
                              <div className="text-lg font-bold text-emerald-900">
                                {getNutrientValue(recipe, 'vitaminC')}
                              </div>
                            </div>
                            <div className="bg-white/80 p-2 rounded border border-emerald-100">
                              <div className="text-xs text-emerald-700">Calcium</div>
                              <div className="text-lg font-bold text-emerald-900">
                                {getNutrientValue(recipe, 'calcium')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {recipe.nutritionalInfo && typeof recipe.nutritionalInfo === 'string' && (
                  <div className="mb-5">
                    <h3 className="font-medium mb-2 text-base md:text-lg">Nutritional Information:</h3>
                    <p className="text-muted-foreground text-sm">{recipe.nutritionalInfo}</p>
                  </div>
                )}
                
                <div className="mb-5">
                  <h3 className="font-medium mb-3 md:mb-4 text-base md:text-lg flex items-center">
                    <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Ingredients
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                    {recipe.ingredients.map((ingredient, index) => {
                      const matchingImage = recipeImages?.ingredientsImages?.find(img => 
                        img.title.toLowerCase().includes(ingredient.toLowerCase().split(',')[0].trim())
                      );
                      
                      return (
                        <div key={index} className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-row h-14 md:h-16">
                          {matchingImage ? (
                            <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 relative">
                              <img 
                                src={`data:image/png;base64,${matchingImage.image}`} 
                                alt={matchingImage.title} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                            </div>
                          ) : (
                            <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 bg-gradient-to-r from-amber-50 to-amber-100 flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-amber-300" />
                            </div>
                          )}
                          <div className="p-2 flex-grow flex items-center overflow-hidden">
                            <span className="text-muted-foreground text-xs md:text-sm truncate">{ingredient}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mb-5">
                  <h3 className="font-medium mb-3 md:mb-4 text-base md:text-lg flex items-center">
                    <ClipboardList className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Instructions
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {recipe.instructions.map((instruction, index) => {
                      const matchingImage = recipeImages?.instructionsImages?.find(img => 
                        instruction.toLowerCase().includes(img.title.toLowerCase().split(',')[0].trim())
                      );
                      
                      const stepIcons = [
                        <ChefHat key="chef" className="h-3 w-3" />,
                        <Flame key="flame" className="h-3 w-3" />,
                        <Utensils key="utensils" className="h-3 w-3" />,
                        <Cookie key="cookie" className="h-3 w-3" />,
                        <CheckCircle key="check" className="h-3 w-3" />
                      ];
                      
                      // Get icon based on step number (cycle through if more steps than icons)
                      const icon = stepIcons[index % stepIcons.length];
                      
                      return (
                        <div key={index} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                          <div className="flex flex-col sm:flex-row">
                            {matchingImage && (
                              <div className="w-full sm:w-24 h-32 sm:h-24 md:w-32 md:h-32 relative flex-shrink-0">
                                <img 
                                  src={`data:image/png;base64,${matchingImage.image}`} 
                                  alt={matchingImage.title} 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent"></div>
                                <div className="absolute bottom-1 right-1 bg-blue-500 text-white h-5 w-5 rounded-full flex items-center justify-center text-xs shadow-md">
                                  {icon}
                                </div>
                              </div>
                            )}
                            <div className="p-3 flex-grow">
                              <div className="flex items-center mb-2">
                                {!matchingImage && (
                                  <div className="bg-blue-500 text-white h-5 w-5 rounded-full flex items-center justify-center mr-2 shadow-sm">
                                    {icon}
                                  </div>
                                )}
                                <h4 className="font-medium text-xs md:text-sm text-blue-700">Step {index + 1}</h4>
                              </div>
                              <p className="text-muted-foreground text-xs md:text-sm">{instruction}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {recipe.tips && recipe.tips.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3 md:mb-4 text-base md:text-lg flex items-center">
                      <Lightbulb className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Tips
                    </h3>
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-3 md:p-4 rounded-lg border border-yellow-200 shadow-sm">
                      <ul className="space-y-2 md:space-y-3">
                        {recipe.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <div className="bg-yellow-200 rounded-full p-1 mt-0.5 mr-2 flex-shrink-0">
                              <Lightbulb className="h-3 w-3 md:h-4 md:w-4 text-yellow-600" />
                            </div>
                            <span className="text-muted-foreground text-xs md:text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </ModernCard>
            )}
            
            {!isLoading && !recipe && !error && (
              <ModernCard className="flex items-center justify-center p-8 md:p-12">
                <div className="text-center text-muted-foreground">
                  <p className="mb-2 text-sm md:text-base">Your recipe will appear here</p>
                  <p className="text-xs md:text-sm">Fill out the form and click "Generate Recipe"</p>
                </div>
              </ModernCard>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 