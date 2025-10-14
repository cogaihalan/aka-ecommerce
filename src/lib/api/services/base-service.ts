import { apiClient } from "@/lib/api/client";
import type { QueryParams } from "@/lib/api/types";

export interface BaseServiceConfig {
  basePath: string;
  useAdminHeaders?: boolean;
  useServerClient?: boolean;
}

export abstract class BaseService {
  protected basePath: string;
  protected useAdminHeaders: boolean;
  protected client: typeof apiClient;

  constructor(config: BaseServiceConfig) {
    this.basePath = config.basePath;
    this.useAdminHeaders = config.useAdminHeaders || false;
    this.client = apiClient; // Always use client API for unified services
  }

  /**
   * Build query parameters from QueryParams object
   */
  protected buildQueryParams(params: QueryParams = {}): URLSearchParams {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    return searchParams;
  }

  /**
   * Build endpoint URL with query parameters
   */
  protected buildEndpoint(path: string, queryParams?: URLSearchParams): string {
    const endpoint = `${this.basePath}${path}`;
    return queryParams && queryParams.toString()
      ? `${endpoint}?${queryParams.toString()}`
      : endpoint;
  }
}
