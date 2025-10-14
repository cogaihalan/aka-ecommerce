import type { ApiConfig, ApiResponse, RequestOptions } from "../shared-types";
import { ApiError } from "../shared-types";

// Default configuration
export const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
};

// Re-export shared types
export type { ApiConfig, ApiResponse, RequestOptions };
export { ApiError };

// Base API Client class with shared functionality
export abstract class BaseApiClient {
  protected config: ApiConfig;
  protected defaultHeaders: Record<string, string>;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  // Abstract method for getting auth headers - must be implemented by subclasses
  protected abstract getAuthHeaders(): Promise<Record<string, string>>;

  // Build full URL
  protected buildUrl(endpoint: string): string {
    const baseUrl = this.config.baseUrl.endsWith("/")
      ? this.config.baseUrl.slice(0, -1)
      : this.config.baseUrl;

    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    return `${baseUrl}${cleanEndpoint}`;
  }

  // Retry mechanism
  protected async withRetry<T>(
    operation: () => Promise<T>,
    retries: number = this.config.retries!
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) except 429 (rate limit)
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500 &&
          error.status !== 429
        ) {
          console.warn(
            `API request failed with client error ${error.status}, not retrying:`,
            error.message
          );
          throw error;
        }

        // Don't retry on authentication errors
        if (error instanceof ApiError && error.status === 401) {
          console.warn(
            `API request failed with authentication error, not retrying:`,
            error.message
          );
          throw error;
        }

        // Don't retry on forbidden errors
        if (error instanceof ApiError && error.status === 403) {
          console.warn(
            `API request failed with forbidden error, not retrying:`,
            error.message
          );
          throw error;
        }

        // Don't retry on not found errors
        if (error instanceof ApiError && error.status === 404) {
          console.warn(
            `API request failed with not found error, not retrying:`,
            error.message
          );
          throw error;
        }

        // Don't retry on last attempt
        if (attempt >= retries) {
          console.error(
            `API request failed after ${attempt + 1} attempts:`,
            error
          );
          throw error;
        }

        // Calculate delay with exponential backoff and cap
        const baseDelay = this.config.retryDelay!;
        const maxDelay = 30000; // 30 seconds max
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);

        console.warn(
          `API request failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms:`,
          error
        );

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // Make HTTP request
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      headers = {},
      body,
      timeout = this.config.timeout,
      retries = this.config.retries,
      cache = "default",
      next,
    } = options;

    const url = this.buildUrl(endpoint);
    const authHeaders = await this.getAuthHeaders();

    const requestHeaders = {
      ...this.defaultHeaders,
      ...authHeaders,
      ...headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      cache,
      next,
    };

    if (body && method !== "GET") {
      requestOptions.body = JSON.stringify(body);
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await this.withRetry(async () => {
        const res = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
          let errorDetails: any;

          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
            errorDetails = errorData;
          } catch {
            // If response is not JSON, use status text
          }

          throw new ApiError(
            res.status,
            errorMessage,
            res.headers.get("x-request-id") || undefined,
            errorDetails
          );
        }

        return res;
      }, retries);

      const data = await response.json();

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        timestamp: new Date().toISOString(),
        requestId: response.headers.get("x-request-id") || undefined,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError(408, "Request timeout");
        }
        throw new ApiError(0, error.message);
      }

      throw new ApiError(0, "Unknown error occurred");
    }
  }

  // Convenience methods
  async get<T = any>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
  ) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method">
  ) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method">
  ) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method">
  ) {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  async delete<T = any>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
  ) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}
