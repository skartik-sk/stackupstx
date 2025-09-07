// Utility functions for handling API errors
import { toast } from 'react-hot-toast';

export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

// Generic error handler
export const handleAPIError = (error: unknown): string => {
  console.error('API Error:', error);
  
  // Handle network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  // Handle API errors with message
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle object errors
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as APIError).message;
  }
  
  // Generic error
  return 'An unexpected error occurred. Please try again.';
};

// Show error toast with proper handling
export const showErrorToast = (error: unknown) => {
  const errorMessage = handleAPIError(error);
  toast.error(errorMessage);
};

// Show success toast
export const showSuccessToast = (message: string) => {
  toast.success(message);
};

// Retry wrapper for API calls
export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Error && error.message.includes('4')) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
};

// Format error message for display
export const formatErrorMessage = (error: unknown): { title: string; description: string } => {
  const message = handleAPIError(error);
  
  // Network errors
  if (message.includes('Network error') || message.includes('fetch')) {
    return {
      title: 'Connection Error',
      description: 'Unable to connect to the server. Please check your internet connection.'
    };
  }
  
  // Server errors
  if (message.includes('500') || message.includes('Internal Server Error')) {
    return {
      title: 'Server Error',
      description: 'The server is experiencing issues. Please try again later.'
    };
  }
  
  // Not found errors
  if (message.includes('404') || message.includes('Not found')) {
    return {
      title: 'Not Found',
      description: 'The requested resource could not be found.'
    };
  }
  
  // Unauthorized errors
  if (message.includes('401') || message.includes('Unauthorized')) {
    return {
      title: 'Authentication Required',
      description: 'Please connect your wallet to continue.'
    };
  }
  
  // Forbidden errors
  if (message.includes('403') || message.includes('Forbidden')) {
    return {
      title: 'Access Denied',
      description: 'You do not have permission to perform this action.'
    };
  }
  
  // Default error
  return {
    title: 'Error',
    description: message
  };
};
