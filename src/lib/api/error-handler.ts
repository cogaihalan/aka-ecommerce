import { ApiError } from "@/lib/api/shared-types";

// Error types
interface ErrorDetails {
  code: string;
  message: string;
  field?: string;
  value?: any;
}

interface ValidationError {
  type: "validation";
  errors: ErrorDetails[];
}

interface BusinessError {
  type: "business";
  code: string;
  message: string;
  details?: any;
}

interface NetworkError {
  type: "network";
  message: string;
  retryable: boolean;
}

interface AuthError {
  type: "auth";
  code: string;
  message: string;
  redirectTo?: string;
}

type AppError = ValidationError | BusinessError | NetworkError | AuthError;

// Error handler class
export class ErrorHandler {
  // Parse API error into application error
  static parseError(error: unknown): AppError {
    if (error instanceof ApiError) {
      return this.parseApiError(error);
    }

    if (error instanceof Error) {
      return this.parseGenericError(error);
    }

    return {
      type: "network",
      message: "An unknown error occurred",
      retryable: false,
    };
  }

  // Parse API error response
  private static parseApiError(error: ApiError): AppError {
    const { status, message, details } = error;

    // Authentication errors
    if (status === 401) {
      return {
        type: "auth",
        code: "UNAUTHORIZED",
        message: "Please sign in to continue",
        redirectTo: "/auth/sign-in",
      };
    }

    if (status === 403) {
      return {
        type: "auth",
        code: "FORBIDDEN",
        message: "You don't have permission to perform this action",
      };
    }

    // Validation errors
    if (status === 422) {
      const validationErrors: ErrorDetails[] = details?.errors || [];
      return {
        type: "validation",
        errors: validationErrors,
      };
    }

    // Business logic errors
    if (status >= 400 && status < 500) {
      return {
        type: "business",
        code: details?.code || "CLIENT_ERROR",
        message: message || "Request failed",
        details,
      };
    }

    // Server errors
    if (status >= 500) {
      return {
        type: "network",
        message: message || "Server error occurred",
        retryable: true,
      };
    }

    // Network errors
    if (status === 0) {
      return {
        type: "network",
        message: message || "Network error occurred",
        retryable: true,
      };
    }

    return {
      type: "network",
      message: message || "An error occurred",
      retryable: status >= 500,
    };
  }

  // Parse generic error
  private static parseGenericError(error: Error): AppError {
    // Network-related errors
    if (error.name === "AbortError") {
      return {
        type: "network",
        message: "Request was cancelled",
        retryable: true,
      };
    }

    if (error.message.includes("fetch")) {
      return {
        type: "network",
        message: "Network connection failed",
        retryable: true,
      };
    }

    return {
      type: "network",
      message: error.message || "An unexpected error occurred",
      retryable: false,
    };
  }

  // Get user-friendly error message
  static getUserMessage(error: AppError): string {
    switch (error.type) {
      case "validation":
        if (error.errors.length === 1) {
          return error.errors[0].message;
        }
        return `Please fix ${error.errors.length} validation errors`;

      case "business":
        return error.message;

      case "auth":
        return error.message;

      case "network":
        return error.message;

      default:
        return "An unexpected error occurred";
    }
  }

  // Check if error is retryable
  static isRetryable(error: AppError): boolean {
    return error.type === "network" && error.retryable;
  }

  // Get error action (what user should do)
  static getErrorAction(error: AppError): {
    action: string;
    buttonText: string;
    redirectTo?: string;
  } {
    switch (error.type) {
      case "validation":
        return {
          action: "Please review the form and try again",
          buttonText: "Try Again",
        };

      case "business":
        return {
          action: error.message,
          buttonText: "OK",
        };

      case "auth":
        return {
          action: error.message,
          buttonText: error.redirectTo ? "Sign In" : "OK",
          redirectTo: error.redirectTo,
        };

      case "network":
        return {
          action: error.message,
          buttonText: error.retryable ? "Retry" : "OK",
        };

      default:
        return {
          action: "An unexpected error occurred",
          buttonText: "OK",
        };
    }
  }

  // Log error for debugging
  static logError(error: unknown, context?: string): void {
    const appError = this.parseError(error);

    console.error(`[API Error${context ? ` - ${context}` : ""}]`, {
      type: appError.type,
      message: this.getUserMessage(appError),
      originalError: error,
      timestamp: new Date().toISOString(),
    });
  }
}

// Error boundary helper
export const handleApiError = (error: unknown, context?: string): AppError => {
  ErrorHandler.logError(error, context);
  return ErrorHandler.parseError(error);
};

// Retry utility
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const appError = ErrorHandler.parseError(error);

      // Don't retry if error is not retryable
      if (!ErrorHandler.isRetryable(appError)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retry with exponential backoff
      const waitTime = delay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
};

// Error notification helper
export const notifyError = (error: AppError): void => {
  const { action, buttonText } = ErrorHandler.getErrorAction(error);

  // This would integrate with your notification system
  // For now, we'll just log it
  console.warn("Error notification:", { action, buttonText });
};

// Export error types
export type {
  ErrorDetails,
  ValidationError,
  BusinessError,
  NetworkError,
  AuthError,
  AppError,
};
