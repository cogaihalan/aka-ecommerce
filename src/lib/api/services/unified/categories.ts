import { apiClient } from "@/lib/api/client";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  QueryParams,
  CategoryListResponse,
  CategoryMediaUploadRequest,
} from "@/lib/api/types";
import type { Category } from "@/types";

class UnifiedCategoryService {
  private basePath = "/categories";

  // Get products with new query structure
  async getCategories(params: QueryParams = {}): Promise<CategoryListResponse> {
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

    const response = await apiClient.get<CategoryListResponse>(endpoint);

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

  async uploadCategoryImage(
    data: CategoryMediaUploadRequest
  ): Promise<Category> {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    formData.append("file", data.file);
    const response = await apiClient.post<Category>(
      `${this.basePath}/${data.id}/thumbnail`,
      formData
    );
    return response.data!;
  }

  async deleteCategoryThumbnail(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}/thumbnail`);
  }
}

// Export singleton instance
export const unifiedCategoryService = new UnifiedCategoryService();
