import axios from 'axios';
import { addApiLog } from '../components/ui/api-debug';

// Base URL for API calls
const API_BASE_URL = 'http://localhost:8080/ask/ai';

// Model constants to match the backend
export const MODELS = {
  OPEN_AI: "openai",     // primary
  O_LLAMA_AI: "ollama"
};

// Default model to use with API calls
const DEFAULT_MODEL = MODELS.OPEN_AI;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  config => {
    const timestamp = new Date().toLocaleTimeString();
    addApiLog({
      id: Date.now().toString(),
      timestamp,
      type: 'request',
      method: config.method?.toUpperCase(),
      url: config.url,
      data: {
        params: config.params,
        data: config.data
      }
    });
    return config;
  },
  error => {
    const timestamp = new Date().toLocaleTimeString();
    addApiLog({
      id: Date.now().toString(),
      timestamp,
      type: 'error',
      error
    });
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  response => {
    const timestamp = new Date().toLocaleTimeString();
    addApiLog({
      id: Date.now().toString(),
      timestamp,
      type: 'response',
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    const timestamp = new Date().toLocaleTimeString();
    addApiLog({
      id: Date.now().toString(),
      timestamp,
      type: 'error',
      status: error.response?.status,
      error: {
        message: error.message,
        response: error.response?.data
      }
    });
    return Promise.reject(error);
  }
);

// Types for Spring backend API responses
export interface ApiResponse<T> {
  status: string | number;
  message: string;
  data: T;
}

export interface RecipeResponse {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  nutritionalInfo?: string | { [key: string]: string };
  nutritionalInformation?: { [key: string]: string };
  tips?: string[];
}

export interface DietPlanResponse {
  dietGoal?: string;
  foodPreferences?: string;
  dietaryRestrictions?: string;
  weeklySchedule?: string;
  dailyMealPlan?: any[];
  
  // Legacy fields (keeping for backward compatibility)
  title?: string;
  overview?: string;
  tips?: string[];
  // Other frontend-specific fields
  weeklyPlan?: any;
  nutritionalOverview?: any;
  warnings?: string[];
}

export interface ExercisePlanResponse {
  fitnessGoal?: string;
  exercisePreference?: string;
  equipment?: string;
  weeklySchedule?: string;
  dailyWorkoutPlan?: any[];
  progressionTips?: string;
  approximateFatBurned?: string;
  muscleGained?: string;
  activeRecovery?: string;
  finalNote?: string;
  
  // Legacy fields (keeping for backward compatibility)
  title?: string;
  overview?: string;
  tips?: string[];
  // Other frontend-specific fields
  weeklyPlan?: any;
  fitnessStats?: any;
  warnings?: string[];
}

export interface ImageItem {
  title: string;
  image: string;
}

export interface RecipeImagesResponse {
  titleImage: ImageItem;
  ingredientsImages: ImageItem[];
  instructionsImages: ImageItem[];
  exerciseImages: ImageItem[] | null;
}

export interface AiImageResponse {
  images: string[];
}

export interface TitleImage {
  title: string;
  imageUrl: string;
}

// Helper function to handle various response formats
const extractResponseData = <T>(response: any): T => {
  console.log('Response data:', response);
  
  if (response && response.data !== undefined) {
    return response.data;
  } 
  if (response && response.result !== undefined) {
    return response.result;
  }
  if (response && typeof response === 'object' && !response.data && !response.result) {
    return response;
  }
  
  throw new Error('Unexpected response format from server');
};

// API functions
export const apiService = {
  // Chat API
  getAIChatResponse: async (prompt: string, model: string = DEFAULT_MODEL): Promise<string> => {
    try {
      const response = await apiClient.get('/chat', {
        params: { prompt, model }
      });
      
      return extractResponseData(response.data);
    } catch (error) {
      console.error('Error getting AI chat response:', error);
      throw error;
    }
  },

  // Recipe API
  createRecipe: async (
    ingredients: string,
    cuisine: string = '',
    dietaryRestrictions: string = '',
    model: string = DEFAULT_MODEL
  ): Promise<RecipeResponse> => {
    try {
      const response = await apiClient.get('/create/recipe', {
        params: { 
          ingredients, 
          cuisine: cuisine || 'none', 
          dietaryRestrictions: dietaryRestrictions || 'none', 
          model 
        }
      });
      
      const data = extractResponseData<RecipeResponse>(response.data);
      
      // Handle both nutritionalInfo and nutritionalInformation field names
      if (!data.nutritionalInfo && data.nutritionalInformation) {
        data.nutritionalInfo = data.nutritionalInformation;
      }
      
      return data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  },

  // Diet Plan API
  createDietPlan: async (
    dietGoal: string,
    foodPreferences: string = '',
    dietaryRestrictions: string = '',
    model: string = DEFAULT_MODEL
  ): Promise<DietPlanResponse> => {
    try {
      const response = await apiClient.get('/create/diet/plan', {
        params: { 
          dietGoal, 
          foodPreferences: foodPreferences || 'none', 
          dietaryRestrictions: dietaryRestrictions || 'none', 
          model 
        }
      });
      
      return extractResponseData(response.data);
    } catch (error) {
      console.error('Error creating diet plan:', error);
      throw error;
    }
  },

  // Exercise Plan API
  createExercisePlan: async (
    fitnessGoal: string,
    exercisePreference: string = '',
    equipment: string = '',
    model: string = DEFAULT_MODEL
  ): Promise<ExercisePlanResponse> => {
    try {
      const response = await apiClient.get('/create/exercise/plan', {
        params: { 
          fitnessGoal, 
          exercisePreference: exercisePreference || 'none', 
          equipment: equipment || 'none', 
          model 
        }
      });
      
      return extractResponseData(response.data);
    } catch (error) {
      console.error('Error creating exercise plan:', error);
      throw error;
    }
  },

  // Recipe Images API
  generateRecipeImages: async (recipe: RecipeResponse): Promise<RecipeImagesResponse> => {
    try {
      const response = await apiClient.post('/generate/images/recipe', recipe);
      
      return extractResponseData(response.data);
    } catch (error) {
      console.error('Error generating recipe images:', error);
      throw error;
    }
  },

  // Diet Images API
  generateDietImages: async (dietPlan: DietPlanResponse): Promise<TitleImage[]> => {
    try {
      // Create payload matching the backend DietPlanResponse structure
      const dietPlanPayload = {
        dietGoal: dietPlan.dietGoal || dietPlan.title || '',
        foodPreferences: dietPlan.foodPreferences || '',
        dietaryRestrictions: dietPlan.dietaryRestrictions || '',
        weeklySchedule: dietPlan.weeklySchedule || '',
        dailyMealPlan: dietPlan.dailyMealPlan || []
      };
      
      const response = await apiClient.post('/generate/images/diet', dietPlanPayload);
      
      return extractResponseData(response.data);
    } catch (error) {
      console.error('Error generating diet images:', error);
      throw error;
    }
  },

  // Exercise Images API
  generateExerciseImages: async (exercisePlan: ExercisePlanResponse): Promise<AiImageResponse> => {
    try {
      // Create payload matching the backend ExercisePlanResponse structure
      const exercisePlanPayload = {
        fitnessGoal: exercisePlan.fitnessGoal || exercisePlan.title || '',
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
      
      const response = await apiClient.post('/generate/images/exercise', exercisePlanPayload);
      
      return extractResponseData(response.data);
    } catch (error) {
      console.error('Error generating exercise images:', error);
      throw error;
    }
  }
};

export default apiService; 