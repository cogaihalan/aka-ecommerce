import { UnifiedUserService } from "@/lib/api/services/unified/users";
import { User } from "@/types";
import { apiClient } from "@/lib/api/client";
import { UpdateUserRequest } from "@/lib/api/types";

export class StorefrontUserService extends UnifiedUserService {
  protected basePath = "/profile";

  async updateUserProfile(userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`${this.basePath}`, userData);
    return response.data!;
  }
}

// Export singleton instance
export const storefrontUserService = new StorefrontUserService();
