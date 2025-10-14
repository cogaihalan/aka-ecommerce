// API Configuration
export const API_CONFIG = {
  // Real API configuration
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
};

// Helper function to get the API base URL
export const getApiBaseUrl = () => API_CONFIG.baseUrl;
