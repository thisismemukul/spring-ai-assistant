import { useState, FormEvent, useEffect } from 'react'
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/solid'
import { DumbbellIcon, CheckIcon, ClipboardListIcon, AlertCircleIcon, CalendarIcon, Flame, Timer, Zap, ArrowUpIcon, Scale, Clock, Repeat, ImageIcon } from 'lucide-react'
import { extractErrorMessage } from '../utils/errorHandling'
import { AppLayout } from '../components/ui/app-layout'
import { ModernHeader } from '../components/ui/modern-header'
import { ModernCard } from '../components/ui/modern-card'
import ErrorMessage from '../components/ErrorMessage'
import { MDRenderer } from '../components/MDRenderer'
import { MODELS, apiService, AiImageResponse } from '../services/api'

// Individual exercise structure
interface Exercise {
  title: string;
  sets: string;
  reps: string;
  restTime: string;
  instructions: string;
}

// Body part workout structure
interface BodyPartWorkout {
  bodyPart: string;
  exercise: Exercise[];
}

// Updated Exercise Plan Response structure
export interface ExercisePlanResponse {
  fitnessGoal?: string;
  exercisePreference?: string;
  equipment?: string;
  weeklySchedule?: string;
  dailyWorkoutPlan?: BodyPartWorkout[];
  progressionTips?: string;
  approximateFatBurned?: string;
  muscleGained?: string;
  activeRecovery?: string;
  finalNote?: string;
  
  // Legacy fields (keeping for backward compatibility)
  title?: string;
  overview?: string;
  weeklyPlan?: {
    [key: string]: {
      warmup: string;
      mainRoutine: {
        name: string;
        sets: number;
        reps: string;
        restTime: string;
        notes?: string;
      }[];
      cooldown: string;
    }
  };
  fitnessStats?: {
    estimatedCaloriesBurned: string;
    workoutDuration: string;
    intensity: string;
  };
  tips?: string[];
  warnings?: string[];
}

export default function ExercisePlan() {
  const [fitnessGoal, setFitnessGoal] = useState('')
  const [exercisePreference, setExercisePreference] = useState('')
  const [equipment, setEquipment] = useState('')
  const [model, setModel] = useState(MODELS.OPEN_AI)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [exercisePlan, setExercisePlan] = useState<ExercisePlanResponse | null>(null)
  const [exerciseImages, setExerciseImages] = useState<AiImageResponse | null>(null)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [activeDay, setActiveDay] = useState('monday')
  const [activeBodyPart, setActiveBodyPart] = useState<string | null>(null)
  const [animateStats, setAnimateStats] = useState(false)
  
  // Trigger animation when exercise plan loads
  useEffect(() => {
    if (exercisePlan) {
      // Slight delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setAnimateStats(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [exercisePlan])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!fitnessGoal.trim()) return

    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    setExercisePlan(null)
    setExerciseImages(null)
    setAnimateStats(false)

    try {
      // Make API call using apiService
      const response = await apiService.createExercisePlan(
        fitnessGoal,
        exercisePreference,
        equipment,
        model
      )
      
      // Transform API response to match the component's expected format if needed
      const exercisePlanData = response as unknown as ExercisePlanResponse;
      setExercisePlan(exercisePlanData)
      
      // Set first body part as active if available
      if (exercisePlanData.dailyWorkoutPlan && exercisePlanData.dailyWorkoutPlan.length > 0) {
        setActiveBodyPart(exercisePlanData.dailyWorkoutPlan[0].bodyPart);
      }
      
      setSuccessMessage('Exercise plan generated successfully!')
    } catch (error) {
      console.error('Error generating exercise plan:', error)
      // Extract user-friendly error message
      setError(extractErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const generateImages = async () => {
    if (!exercisePlan) return
    
    setIsGeneratingImage(true)
    setError('')
    setSuccessMessage('')
    
    try {
      // Map frontend exercise plan to the format expected by the backend
      const backendExercisePlan: ExercisePlanResponse = {
        fitnessGoal: exercisePlan.fitnessGoal || '',
        exercisePreference: exercisePlan.exercisePreference || '',
        equipment: exercisePlan.equipment || '',
        weeklySchedule: exercisePlan.weeklySchedule || '',
        dailyWorkoutPlan: exercisePlan.dailyWorkoutPlan || [],
        progressionTips: exercisePlan.progressionTips || '',
        approximateFatBurned: exercisePlan.approximateFatBurned || '',
        muscleGained: exercisePlan.muscleGained || '',
        activeRecovery: exercisePlan.activeRecovery || '',
        finalNote: exercisePlan.finalNote || ''
      };
      
      const imageResponse = await apiService.generateExerciseImages(backendExercisePlan)
      setExerciseImages(imageResponse)
      setSuccessMessage('Images generated successfully!')
    } catch (error) {
      console.error('Error generating images:', error)
      setError(extractErrorMessage(error) || 'Failed to generate images. Please try again.')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Format weekday name
  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <AppLayout>
      <div className="w-full max-w-6xl mx-auto px-1 sm:px-3 md:px-4">
        <ModernHeader
          title="Exercise Plan Generator"
          subtitle="Create a personalized workout routine based on your fitness goals!"
          logo={<DumbbellIcon className="h-5 w-5 text-white" />}
          color="purple"
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
                  <label htmlFor="fitnessGoal" className="block text-sm font-medium mb-1">
                    Fitness Goal (required)
                  </label>
                  <textarea
                    id="fitnessGoal"
                    rows={4}
                    className="min-h-[50px] max-h-[200px] w-full resize-none rounded-xl border-0 bg-[hsl(var(--vibrant-light-purple))] p-4 text-foreground shadow-md focus:outline-none focus:ring-1 focus:ring-[hsl(var(--vibrant-blue))]"
                    placeholder="Describe your fitness goals (e.g., build muscle, improve cardio, etc.)"
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="exercisePreference" className="block text-sm font-medium mb-1">
                    Exercise Preference (optional)
                  </label>
                  <input
                    type="text"
                    id="exercisePreference"
                    className="h-12 w-full rounded-xl border-0 bg-[hsl(var(--vibrant-light-purple))] px-4 py-3 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--vibrant-blue))]"
                    placeholder="E.g., cardio, strength training, yoga, or 'none'"
                    value={exercisePreference}
                    onChange={(e) => setExercisePreference(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="equipment" className="block text-sm font-medium mb-1">
                    Available Equipment (optional)
                  </label>
                  <input
                    type="text"
                    id="equipment"
                    className="h-12 w-full rounded-xl border-0 bg-[hsl(var(--vibrant-light-purple))] px-4 py-3 text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-[hsl(var(--vibrant-blue))]"
                    placeholder="E.g., dumbbells, resistance bands, or 'none'"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="exerciseModel" className="block text-sm font-medium mb-1">
                    AI Model
                  </label>
                  <select
                    id="exerciseModel"
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
                  className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-12 bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md hover:shadow-lg hover:from-purple-500 hover:to-purple-400 active:translate-y-0.5 transition-all"
                  disabled={isLoading || !fitnessGoal.trim()}
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Generating...
                    </>
                  ) : (
                    'Generate Exercise Plan'
                  )}
                </button>
              </form>
            </ModernCard>
          </div>
          
          <div className="md:col-span-2">
            {exercisePlan && (
              <div className="space-y-6">
                <ModernCard className="p-5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <h2 className="text-xl font-bold flex items-center">
                      <DumbbellIcon className="h-5 w-5 mr-2 text-primary" />
                      {exercisePlan.fitnessGoal ? `Workout Plan for ${exercisePlan.fitnessGoal}` : 'Your Personalized Exercise Plan'}
                    </h2>
                    <button
                      onClick={generateImages}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md hover:shadow-lg hover:from-purple-500 hover:to-purple-400 active:translate-y-0.5 transition-all"
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

                  {/* Weekly Schedule */}
                  {exercisePlan.weeklySchedule && (
                    <div className="mb-4 text-muted-foreground bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-purple-600" />
                        <span className="text-purple-900 font-medium">Schedule: </span>
                        <span className="text-purple-800">{exercisePlan.weeklySchedule}</span>
                      </div>
                    </div>
                  )}

                  {/* Display generated images if available */}
                  {exerciseImages && exerciseImages.images && exerciseImages.images.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Generated Exercise Images</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {exerciseImages.images.map((imageUrl, index) => (
                          <div key={index} className="overflow-hidden rounded-lg border shadow-sm">
                            <div className="aspect-video w-full relative bg-gray-100">
                              <img 
                                src={imageUrl} 
                                alt={`Exercise ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fitness Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                    {exercisePlan.approximateFatBurned && (
                      <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-3 rounded-lg border border-rose-200 flex items-center shadow-sm">
                        <div className="p-2 bg-rose-100 rounded-full mr-2 flex-shrink-0">
                          <Flame className="h-4 w-4 text-rose-600" />
                        </div>
                        <div>
                          <div className="text-xs text-rose-700 font-medium">Calories Burned</div>
                          <div className="text-sm font-bold text-rose-900">
                            {exercisePlan.approximateFatBurned}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {exercisePlan.muscleGained && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200 flex items-center shadow-sm">
                        <div className="p-2 bg-blue-100 rounded-full mr-2 flex-shrink-0">
                          <Scale className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-xs text-blue-700 font-medium">Muscle Gain</div>
                          <div className="text-sm font-bold text-blue-900">
                            {exercisePlan.muscleGained}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {exercisePlan.activeRecovery && (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-200 flex items-center shadow-sm">
                        <div className="p-2 bg-emerald-100 rounded-full mr-2 flex-shrink-0">
                          <Repeat className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-xs text-emerald-700 font-medium">Recovery</div>
                          <div className="text-sm font-bold text-emerald-900">
                            {exercisePlan.activeRecovery}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Daily workout plan */}
                  {exercisePlan.dailyWorkoutPlan && exercisePlan.dailyWorkoutPlan.length > 0 && (
                    <>
                      {/* Body part selector tabs */}
                      <div className="mb-4">
                        <div className="flex overflow-x-auto pb-2 -mx-1">
                          {exercisePlan.dailyWorkoutPlan.map((bodyPartWorkout) => (
                            <button
                              key={bodyPartWorkout.bodyPart}
                              onClick={() => setActiveBodyPart(bodyPartWorkout.bodyPart)}
                              className={`mx-1 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                                activeBodyPart === bodyPartWorkout.bodyPart
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              {bodyPartWorkout.bodyPart}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active body part workout */}
                      {activeBodyPart && (
                        <div className="space-y-4">
                          {exercisePlan.dailyWorkoutPlan
                            .filter(bodyWorkout => bodyWorkout.bodyPart === activeBodyPart)
                            .map((bodyWorkout, bodyIndex) => (
                              <div key={bodyIndex} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                {/* Body part header */}
                                <div className="p-4 border-b bg-purple-50">
                                  <h3 className="font-medium text-lg flex items-center text-purple-900">
                                    <DumbbellIcon className="h-5 w-5 mr-2 text-purple-600" />
                                    {bodyWorkout.bodyPart} Workout
                                  </h3>
                                </div>
                                
                                {/* Exercise list */}
                                <div className="p-4">
                                  <div className="space-y-4">
                                    {bodyWorkout.exercise.map((exercise, idx) => (
                                      <div key={idx} className="bg-gray-50 rounded-lg p-4 border">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                                          <h4 className="font-medium text-lg text-purple-900">{exercise.title}</h4>
                                          <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                            <div className="flex items-center justify-center px-2 py-1 rounded bg-purple-100 text-xs text-purple-900 font-medium">
                                              <span className="mr-1">{exercise.sets}</span>
                                              <span>Sets</span>
                                            </div>
                                            <div className="flex items-center justify-center px-2 py-1 rounded bg-indigo-100 text-xs text-indigo-900 font-medium">
                                              <span className="mr-1">{exercise.reps}</span>
                                              <span>Reps</span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center text-sm mb-3 text-gray-600">
                                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                          <span className="font-medium mr-1">Rest:</span>
                                          <span>{exercise.restTime}</span>
                                        </div>
                                        
                                        <div className="text-sm border-t pt-3">
                                          <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                                            <ClipboardListIcon className="h-4 w-4 mr-1" />
                                            Instructions
                                          </h5>
                                          <p className="text-gray-700">{exercise.instructions}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Progression Tips and Final Note */}
                      {(exercisePlan.progressionTips || exercisePlan.finalNote) && (
                        <div className="mt-5 space-y-3">
                          {exercisePlan.progressionTips && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                              <h4 className="font-medium flex items-center text-blue-900 mb-1">
                                <ArrowUpIcon className="h-4 w-4 mr-1 text-blue-600" />
                                Progression
                              </h4>
                              <p className="text-sm text-blue-800">{exercisePlan.progressionTips}</p>
                            </div>
                          )}
                          
                          {exercisePlan.finalNote && (
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                              <h4 className="font-medium flex items-center text-purple-900 mb-1">
                                <CheckIcon className="h-4 w-4 mr-1 text-purple-600" />
                                Note
                              </h4>
                              <p className="text-sm text-purple-800">{exercisePlan.finalNote}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Legacy weekly plan - keep for backward compatibility */}
                  {!exercisePlan.dailyWorkoutPlan && exercisePlan.weeklyPlan && (
                    <>
                      {/* Legacy fitnessStats display */}
                      {exercisePlan.fitnessStats && (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 md:p-4 rounded-lg border border-purple-200 flex items-center mb-4 shadow-sm">
                          <div className="flex flex-col gap-2 w-full">
                            <div className="grid grid-cols-3 gap-3 text-center">
                              <div className="bg-white/60 p-2 rounded border border-purple-100">
                                <div className="text-xs text-purple-700">Calories Burned</div>
                                <div className="text-sm font-bold text-purple-900">
                                  {exercisePlan.fitnessStats.estimatedCaloriesBurned}
                                </div>
                              </div>
                              <div className="bg-white/60 p-2 rounded border border-purple-100">
                                <div className="text-xs text-purple-700">Duration</div>
                                <div className="text-sm font-bold text-purple-900">
                                  {exercisePlan.fitnessStats.workoutDuration}
                                </div>
                              </div>
                              <div className="bg-white/60 p-2 rounded border border-purple-100">
                                <div className="text-xs text-purple-700">Intensity</div>
                                <div className="text-sm font-bold text-purple-900">
                                  {exercisePlan.fitnessStats.intensity}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    
                      {/* Day selector tabs */}
                      <div className="mb-4">
                        <div className="flex overflow-x-auto pb-2 -mx-1">
                          {Object.keys(exercisePlan.weeklyPlan).map((day) => (
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

                      {/* Active day workout plan */}
                      {exercisePlan.weeklyPlan[activeDay] && (
                        <div className="space-y-4">
                          {/* Warmup */}
                          <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <h4 className="font-medium mb-2 flex items-center text-sm">
                              <CalendarIcon className="h-4 w-4 mr-2 text-primary/70" />
                              Warm-up
                            </h4>
                            <MDRenderer content={exercisePlan.weeklyPlan[activeDay].warmup} />
                          </div>
                          
                          {/* Main Routine */}
                          <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <h4 className="font-medium mb-3 flex items-center text-sm">
                              <DumbbellIcon className="h-4 w-4 mr-2 text-primary/70" />
                              Main Workout
                            </h4>
                            
                            {exercisePlan.weeklyPlan[activeDay].mainRoutine.map((exercise, idx) => (
                              <div key={idx} className="mb-4 last:mb-0 p-3 bg-muted/30 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="font-medium">{exercise.name}</h5>
                                  <span className="text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded">
                                    {exercise.sets} sets × {exercise.reps}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="flex items-center">
                                    <span className="text-muted-foreground mr-1">Rest:</span>
                                    <span>{exercise.restTime}</span>
                                  </div>
                                  {exercise.notes && (
                                    <div className="flex items-start col-span-2">
                                      <span className="text-muted-foreground mr-1">Notes:</span>
                                      <span>{exercise.notes}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Cooldown */}
                          <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <h4 className="font-medium mb-2 flex items-center text-sm">
                              <CalendarIcon className="h-4 w-4 mr-2 text-primary/70" />
                              Cool-down
                            </h4>
                            <MDRenderer content={exercisePlan.weeklyPlan[activeDay].cooldown} />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </ModernCard>

                {/* Tips and warnings - legacy support */}
                {exercisePlan.tips && exercisePlan.tips.length > 0 && (
                  <ModernCard className="p-5">
                    <h3 className="font-medium mb-3 text-lg flex items-center">
                      <CheckIcon className="h-5 w-5 mr-2 text-primary" />
                      Tips for Success
                    </h3>
                    <ul className="space-y-2">
                      {exercisePlan.tips.map((tip, idx) => (
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

                {exercisePlan.warnings && exercisePlan.warnings.length > 0 && (
                  <ModernCard className="p-5 border-yellow-200">
                    <h3 className="font-medium mb-3 text-lg flex items-center text-yellow-700">
                      <AlertCircleIcon className="h-5 w-5 mr-2 text-yellow-500" />
                      Important Notes
                    </h3>
                    <ul className="space-y-2">
                      {exercisePlan.warnings.map((warning, idx) => (
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
            
            {!isLoading && !exercisePlan && !error && (
              <ModernCard className="flex items-center justify-center p-12">
                <div className="text-center text-muted-foreground">
                  <DumbbellIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="mb-2 font-medium">Your exercise plan will appear here</p>
                  <p className="text-sm">Fill out the form and click "Generate Exercise Plan"</p>
                </div>
              </ModernCard>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
} 