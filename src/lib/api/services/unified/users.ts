import { apiClient } from "@/lib/api/client";
import type {
  QueryParams,
  UpdateUserRequest,
  UserListResponse,
} from "@/lib/api/types";
import type { User } from "@/types";

export class UnifiedUserService {
  protected basePath = "/admin/users";

  async getUsers(params: QueryParams): Promise<UserListResponse> {
    const searchParams = new URLSearchParams();

    // Handle pagination
    if (params.page !== undefined)
      searchParams.append("page", params.page.toString());
    if (params.size !== undefined)
      searchParams.append("size", params.size.toString());

    // Handle sorting
    if (params.sort && params.sort.length > 0) {
      params.sort.forEach((sortItem: string) => {
        searchParams.append("sort", sortItem);
      });
    }

    if (params.name !== undefined)
      searchParams.append("name", params.name.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await apiClient.get<UserListResponse>(endpoint);

    return response.data!;
  }

  async getUserById(userId: string): Promise<User | null> {
    const response = await apiClient.get<User>(`${this.basePath}/${userId}`);
    return response.data!;
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(
      `${this.basePath}/${userId}`,
      userData
    );
    return response.data!;
  }

  async lockUser(userId: string): Promise<void> {
    await apiClient.post<User>(`${this.basePath}/${userId}/lock`);
  }

  async unlockUser(userId: string): Promise<void> {
    await apiClient.post<User>(`${this.basePath}/${userId}/unlock`);
  }
}

export const unifiedUserService = new UnifiedUserService();
