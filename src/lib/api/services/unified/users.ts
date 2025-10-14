import { apiClient } from "@/lib/api/client";
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
class UnifiedUserService {
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

    const response = await apiClient.get<UserListResponse>(endpoint);
    return response.data!;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<AppUser | null> {
    const response = await apiClient.get<AppUser>(`${this.basePath}/${userId}`);
    return response.data!;
  }

  /**
   * Create new user (admin only)
   */
  async createUser(userData: CreateUserPayload): Promise<AppUser> {
    const response = await apiClient.post<AppUser>(this.basePath, userData);
    return response.data!;
  }

  /**
   * Update user (admin only)
   */
  async updateUser(
    userId: string,
    userData: UpdateUserPayload
  ): Promise<AppUser> {
    const response = await apiClient.put<AppUser>(
      `${this.basePath}/${userId}`,
      userData
    );
    return response.data!;
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, role: UserRole): Promise<AppUser> {
    const response = await apiClient.put<AppUser>(
      `${this.basePath}/${userId}/role`,
      { role }
    );
    return response.data!;
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${userId}`);
  }
}

export const unifiedUserService = new UnifiedUserService();
