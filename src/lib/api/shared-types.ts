// Shared API types that don't contain server-only imports
export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
  requestId?: string;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public requestId?: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}
