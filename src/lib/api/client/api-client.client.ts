import { BaseApiClient } from "./api-client-base";

// Client-side API Client class
export class ClientApiClient extends BaseApiClient {
  private authToken: string | null = null;

  // Set the authentication token
  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  // Get authentication headers for client-side usage
  protected async getAuthHeaders(): Promise<Record<string, string>> {
    if (this.authToken) {
      return {
        Authorization: `Bearer ${this.authToken}`,
      };
    }

    return {};
  }
}

// Create default client API client instance
export const apiClient = new ClientApiClient();

// Create API client with no retries for critical requests
export const noRetryApiClient = new ClientApiClient({ retries: 0 });
