import { apiClient } from "@/lib/api/client";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  QueryParams,
} from "@/lib/api/types";
import type { Category } from "@/types";

class UnifiedCategoryService {
  private basePath = "/categories";

  // Get products with new query structure
  async getCategories(params: QueryParams = {}): Promise<Category[]> {
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

    const response = await apiClient.get<Category[]>(endpoint);

    return response.data!;
  }

  async getCategory(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(`${this.basePath}/${id}`);
    return response.data!;
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await apiClient.post<Category>(this.basePath, data);
    return response.data!;
  }

  async updateCategory(
    id: number,
    data: UpdateCategoryRequest
  ): Promise<Category> {
    const response = await apiClient.put<Category>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

// Export singleton instance
export const unifiedCategoryService = new UnifiedCategoryService();
