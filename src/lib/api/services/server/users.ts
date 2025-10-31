import { serverApiClient } from "@/lib/api/server";
import type {
  QueryParams,
  UpdateUserRequest,
  UserListResponse,
} from "@/lib/api/types";
import type { User } from "@/types";

class ServerUnifiedUserService {
  private basePath = "/admin/users";

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
      searchParams.append("fullName", params.name.toString());

    if (params.email !== undefined)
      searchParams.append("email", params.email.toString());

    if (params.phoneNumber !== undefined)
      searchParams.append("phoneNumber", params.phoneNumber.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await serverApiClient.get<UserListResponse>(endpoint);

    return response.data!;
  }

  async getUserById(userId: string): Promise<User | null> {
    const response = await serverApiClient.get<User>(`${this.basePath}/${userId}`);
    return response.data!;
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    const response = await serverApiClient.put<User>(
      `${this.basePath}/${userId}`,
      userData
    );
    return response.data!;
  }

  async lockUser(userId: string): Promise<void> {
    await serverApiClient.post<User>(`${this.basePath}/${userId}/lock`);
  }

  async unlockUser(userId: string): Promise<void> {
    await serverApiClient.post<User>(`${this.basePath}/${userId}/unlock`);
  }
}

export const serverUnifiedUserService = new ServerUnifiedUserService();
