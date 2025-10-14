// Main API exports - CLIENT SAFE (no server-only imports)
export { apiClient } from "./client";
export * from "./types";

// Unified services (recommended for most use cases)
export {
  unifiedProductService,
  unifiedAnalyticsService,
} from "./services/unified";

// Admin services (aliases to unified services for backward compatibility)
export {
  unifiedProductService as adminProductService,
  unifiedCategoryService as adminCategoryService,
  unifiedOrderService as adminOrderService,
  unifiedAnalyticsService as adminAnalyticsService,
  unifiedUserService as adminUserService,
} from "./services/unified";

// Storefront services
export * from "./services/storefront";

// Server services (for server components and API routes)
// Note: These should only be imported in server components
export * from "./services/server";

// Configuration
export { API_CONFIG, getApiBaseUrl } from "./config";
