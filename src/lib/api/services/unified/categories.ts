import { BaseService } from "../base-service";
import type {
  Category,
  CategoryListResponse,
  CategoryTreeResponse,
  CategoryWithProducts,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  QueryParams,
} from "@/lib/api/types";

class UnifiedCategoryService extends BaseService {
  constructor() {
    super({ basePath: "/categories" });
  }

  // Get all categories with filtering and pagination
  async getCategories(
    params: QueryParams = {},
    isAdmin: boolean = false
  ): Promise<CategoryListResponse | Category[]> {
    const searchParams = this.buildQueryParams(params);
    const endpoint = this.buildEndpoint("", searchParams);
    return this.get<CategoryListResponse | Category[]>(endpoint, isAdmin);
  }

  // Get category tree (hierarchical structure) - admin only
  async getCategoryTree(): Promise<CategoryTreeResponse> {
    return this.get<CategoryTreeResponse>("/tree", true);
  }

  // Get categories tree for storefront (public)
  async getCategoriesTree(): Promise<Category[]> {
    return this.get<Category[]>("/tree", false);
  }

  // Get a single category by ID (admin)
  async getCategory(id: number): Promise<Category> {
    return this.get<Category>(`/${id}`, true);
  }

  // Get a single category by slug (storefront)
  async getCategoryBySlug(slug: string): Promise<Category> {
    return this.get<Category>(`/slug/${slug}`, false);
  }

  // Get category with products
  async getCategoryWithProducts(
    id: number,
    params: QueryParams = {}
  ): Promise<CategoryWithProducts> {
    const searchParams = this.buildQueryParams(params);
    const endpoint = this.buildEndpoint(`/${id}/products`, searchParams);
    return this.get<CategoryWithProducts>(endpoint, true);
  }

  // Create a new category (admin only)
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    return this.post<Category>("", data, true);
  }

  // Update an existing category (admin only)
  async updateCategory(data: UpdateCategoryRequest): Promise<Category> {
    const { id, ...updateData } = data;
    return this.put<Category>(`/${id}`, updateData, true);
  }

  // Delete a category (admin only)
  async deleteCategory(id: number): Promise<void> {
    return this.delete(`/${id}`, true);
  }

  // Update category status (admin only)
  async updateCategoryStatus(id: number, isActive: boolean): Promise<Category> {
    return this.patch<Category>(`/${id}/status`, { isActive }, true);
  }

  // Reorder categories (admin only)
  async reorderCategories(
    categoryOrders: { id: number; sortOrder: number }[]
  ): Promise<void> {
    return this.patch("/reorder", { categoryOrders }, true);
  }

  // Search categories (admin only)
  async searchCategories(
    query: string,
    limit: number = 10
  ): Promise<Category[]> {
    const endpoint = `/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    return this.get<Category[]>(endpoint, true);
  }

  // Validate category slug uniqueness (admin only)
  async validateSlug(
    slug: string,
    excludeId?: number
  ): Promise<{ isValid: boolean; message?: string }> {
    const endpoint = `/validate-slug?slug=${encodeURIComponent(slug)}${excludeId ? `&excludeId=${excludeId}` : ""}`;
    return this.get<{ isValid: boolean; message?: string }>(endpoint, true);
  }
}

// Export singleton instance
export const unifiedCategoryService = new UnifiedCategoryService();
