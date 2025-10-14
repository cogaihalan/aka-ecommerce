import { serverApiClient } from "@/lib/api/server";
import type {
  AppUser,
  CreateUserPayload,
  UpdateUserPayload,
  UserRole,
  UserListResponse,
} from "@/types/auth";

/**
 * Unified User Service
 * Provides user management functionality for both admin and storefront
 */
class ServerUnifiedUserService {
  private basePath = "/users";

  /**
   * Get users with pagination and filtering
   */
  async getUsers(
    options: {
      page?: number;
      limit?: number;
      role?: UserRole;
      search?: string;
      isActive?: boolean;
    } = {}
  ): Promise<UserListResponse> {
    const params = new URLSearchParams();

    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.role) params.append("role", options.role);
    if (options.search) params.append("search", options.search);
    if (options.isActive !== undefined)
      params.append("isActive", options.isActive.toString());

    const queryString = params.toString() || "";
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await serverApiClient.get<UserListResponse>(endpoint);
    return response.data!;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<AppUser | null> {
    const response = await serverApiClient.get<AppUser>(
      `${this.basePath}/${userId}`
    );
    return response.data!;
  }

  /**
   * Create new user (admin only)
   */
  async createUser(userData: CreateUserPayload): Promise<AppUser> {
    const response = await serverApiClient.post<AppUser>(
      this.basePath,
      userData
    );
    return response.data!;
  }

  /**
   * Update user (admin only)
   */
  async updateUser(
    userId: string,
    userData: UpdateUserPayload
  ): Promise<AppUser> {
    const response = await serverApiClient.put<AppUser>(
      `${this.basePath}/${userId}`,
      userData
    );
    return response.data!;
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, role: UserRole): Promise<AppUser> {
    const response = await serverApiClient.put<AppUser>(
      `${this.basePath}/${userId}/role`,
      { role }
    );
    return response.data!;
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<void> {
    await serverApiClient.delete(`${this.basePath}/${userId}`);
  }
}

export const serverUnifiedUserService = new ServerUnifiedUserService();
