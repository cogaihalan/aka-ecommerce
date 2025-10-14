import { auth } from "@clerk/nextjs/server";
import { BaseApiClient } from "./api-client-base";

// Server-side API Client class
export class ServerApiClient extends BaseApiClient {
  // Get authentication headers for server-side usage
  protected async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const { getToken } = await auth();
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

// Create default server API client instance
export const serverApiClient = new ServerApiClient();

// Create server API client with no retries for critical requests
export const noRetryServerApiClient = new ServerApiClient({ retries: 0 });
