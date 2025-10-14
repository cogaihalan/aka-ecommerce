import { useAuth } from "@clerk/nextjs";
import { BaseApiClient } from "./api-client-base";

// Client-side API Client class
export class ClientApiClient extends BaseApiClient {
  // Get authentication headers for client-side usage
  protected async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const { getToken } = await useAuth();
      const token = await getToken();

      if (token) {
        return {
          Authorization: `Bearer ${token}`,
        };
      }
    } catch (error) {
      console.warn("Failed to get auth token:", error);
    }

    return {};
  }
}

// Create default client API client instance
export const apiClient = new ClientApiClient();

// Create API client with no retries for critical requests
export const noRetryApiClient = new ClientApiClient({ retries: 0 });
