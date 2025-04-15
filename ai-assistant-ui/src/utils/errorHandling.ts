import { AxiosError } from 'axios';

export type ApiError = {
  message: string;
  status: number;
  data?: {
    errorCode: string;
    errorMessage: string;
    userMessage: string;
    errorType: string;
    metadata: any;
  };
};

/**
 * Extracts a user-friendly error message from various error types
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Handle Axios errors
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      const data = error.response.data;
      
      // Try to get the error message from the Spring response data structure
      if (data && typeof data === 'object') {
        // Check for the specific API error format with data object
        if (data.data && typeof data.data === 'object') {
          // Prioritize userMessage field as it's more user-friendly
          if (data.data.userMessage) return data.data.userMessage;
          if (data.data.errorMessage) return data.data.errorMessage;
          if (data.data.errorCode) return `Error code: ${data.data.errorCode}`;
        }
        
        // Spring ResponseEntity<ApiResponse<T>> format
        if (data.message) return data.message;
        if (data.error) return data.error;
        
        // Spring validation errors
        if (data.errors && Array.isArray(data.errors)) {
          return data.errors.map((err: any) => err.defaultMessage || err.message).join(', ');
        }
        
        // Spring exception handler format
        if (data.timestamp && data.status && data.error) {
          return `${data.error}: ${data.message || ''}`;
        }
      }
      
      return `Server error (${error.response.status}): ${error.message}`;
    } else if (error.request) {
      // The request was made but no response was received
      return 'No response received from server. Please check your connection.';
    } else {
      // Something happened in setting up the request
      return error.message;
    }
  }
  
  // Handle other error types
  if (error instanceof Error) {
    return error.message;
  }
  
  // Unknown error type
  return 'An unexpected error occurred';
}

/**
 * Gets the technical error details for logging or debugging
 */
export function getErrorDetails(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data?.data?.errorMessage) {
    return error.response.data.data.errorMessage;
  }
  
  return extractErrorMessage(error);
}

/**
 * Display and log errors
 */
export function handleError(error: unknown, logPrefix = 'Error'): string {
  const message = extractErrorMessage(error);
  console.error(`${logPrefix}:`, error);
  return message;
}

/**
 * Parse JSON safely without throwing exceptions
 */
export function safeParseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
} 