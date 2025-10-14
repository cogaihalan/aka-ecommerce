import { serverApiClient } from "@/lib/api/server";

import type {
  Category,
  CategoryListResponse,
  CategoryTreeResponse,
  CategoryWithProducts,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  QueryParams,
} from "@/lib/api/types";

class ServerUnifiedCategoryService {
  private basePath = "/categories";

  // Get all categories with filtering and pagination
  async getCategories(
    params: QueryParams = {}
  ): Promise<CategoryListResponse | Category[]> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }
    const queryString = searchParams.toString() || "";
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;
    const response = await serverApiClient.get<
      CategoryListResponse | Category[]
    >(endpoint);
    return response.data!;
  }

  // Get category tree (hierarchical structure) - admin only
  async getCategoryTree(): Promise<CategoryTreeResponse> {
    const response = await serverApiClient.get<CategoryTreeResponse>("/tree");
    return response.data!;
  }

  // Get categories tree for storefront (public)
  async getCategoriesTree(): Promise<Category[]> {
    const response = await serverApiClient.get<Category[]>("/tree");
    return response.data!;
  }

  // Get a single category by ID (admin)
  async getCategory(id: number): Promise<Category> {
    const response = await serverApiClient.get<Category>(`/${id}`);
    return response.data!;
  }

  // Get a single category by slug (storefront)
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await serverApiClient.get<Category>(`/slug/${slug}`);
    return response.data!;
  }

  // Get category with products
  async getCategoryWithProducts(
    id: number,
    params: QueryParams = {}
  ): Promise<CategoryWithProducts> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }
    const queryString = searchParams.toString() || "";
    const endpoint = queryString
      ? `${this.basePath}/${id}/products?${queryString}`
      : `${this.basePath}/${id}/products`;
    const response = await serverApiClient.get<CategoryWithProducts>(endpoint);
    return response.data!;
  }

  // Create a new category (admin only)
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await serverApiClient.post<Category>("", data);
    return response.data!;
  }

  // Update an existing category (admin only)
  async updateCategory(data: UpdateCategoryRequest): Promise<Category> {
    const { id, ...updateData } = data;
    const response = await serverApiClient.put<Category>(`/${id}`, updateData);
    return response.data!;
  }

  // Delete a category (admin only)
  async deleteCategory(id: number): Promise<void> {
    await serverApiClient.delete(`/${id}`);
  }

  // Update category status (admin only)
  async updateCategoryStatus(id: number, isActive: boolean): Promise<Category> {
    const response = await serverApiClient.patch<Category>(`/${id}/status`, {
      isActive,
    });
    return response.data!;
  }

  // Reorder categories (admin only)
  async reorderCategories(
    categoryOrders: { id: number; sortOrder: number }[]
  ): Promise<Category> {
    const response = await serverApiClient.patch<Category>("/reorder", {
      categoryOrders,
    });
    return response.data!;
  }

  // Search categories (admin only)
  async searchCategories(
    query: string,
    limit: number = 10
  ): Promise<Category[]> {
    const endpoint = `/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    const response = await serverApiClient.get<Category[]>(endpoint);
    return response.data!;
  }

  // Validate category slug uniqueness (admin only)
  async validateSlug(
    slug: string,
    excludeId?: number
  ): Promise<{ isValid: boolean; message?: string }> {
    const endpoint = `/validate-slug?slug=${encodeURIComponent(slug)}${excludeId ? `&excludeId=${excludeId}` : ""}`;
    const response = await serverApiClient.get<{
      isValid: boolean;
      message?: string;
    }>(endpoint);
    return response.data!;
  }
}

// Export singleton instance
export const serverUnifiedCategoryService = new ServerUnifiedCategoryService();
