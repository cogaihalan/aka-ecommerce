import { Category as ProductCategory } from "@/types/product";
import { Category } from "@/types/app";
import { unifiedCategoryService } from "@/lib/api/services/unified";

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export interface CategoryFilters {
  isActive?: boolean;
  parentId?: string;
  search?: string;
}

// Helper function to convert ProductCategory to Category
function mapProductCategoryToCategory(
  productCategory: ProductCategory
): Category {
  return {
    id: productCategory.id.toString(),
    name: productCategory.name,
    slug: productCategory.slug,
    description: productCategory.description,
    image: productCategory.image?.url,
    productCount: 0, // This would need to be fetched separately or included in the API response
    parentId: productCategory.parentId?.toString(),
    children: productCategory.children?.map(mapProductCategoryToCategory),
    isActive: productCategory.isActive,
    sortOrder: 0, // This would need to be included in the API response
  };
}

class CategoriesService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}_${JSON.stringify(params || {})}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Get all categories with optional filtering
   */
  async getCategories(filters?: CategoryFilters): Promise<CategoriesResponse> {
    const cacheKey = this.getCacheKey("categories", filters);
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      // Convert filters to query params format
      const queryParams: any = {};
      if (filters?.isActive !== undefined) {
        queryParams.isActive = filters.isActive;
      }
      if (filters?.parentId) {
        queryParams.parentId = filters.parentId;
      }
      if (filters?.search) {
        queryParams.search = filters.search;
      }

      const result = await unifiedCategoryService.getCategories(
        queryParams,
        false
      );

      // Convert result to expected format
      const productCategories = Array.isArray(result)
        ? result
        : result.categories || [];
      const mappedCategories = productCategories.map(
        mapProductCategoryToCategory
      );

      const data = {
        categories: mappedCategories,
        total: Array.isArray(result)
          ? result.length
          : (result as any).total || 0,
      };

      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  /**
   * Get a single category by ID
   */
  async getCategoryById(id: string): Promise<Category | null> {
    const cacheKey = this.getCacheKey("category", { id });
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const productCategory = await unifiedCategoryService.getCategory(
        parseInt(id)
      );
      const category = mapProductCategoryToCategory(productCategory);
      this.setCachedData(cacheKey, category);
      return category;
    } catch (error) {
      console.error("Error fetching category:", error);
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get a single category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const cacheKey = this.getCacheKey("category", { slug });
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const productCategory =
        await unifiedCategoryService.getCategoryBySlug(slug);
      const category = mapProductCategoryToCategory(productCategory);
      this.setCachedData(cacheKey, category);
      return category;
    } catch (error) {
      console.error("Error fetching category:", error);
      if (error instanceof Error && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get categories tree (hierarchical structure)
   */
  async getCategoriesTree(): Promise<Category[]> {
    const cacheKey = this.getCacheKey("categories-tree");
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const productTree = await unifiedCategoryService.getCategoriesTree();
      const tree = productTree.map(mapProductCategoryToCategory);
      this.setCachedData(cacheKey, tree);
      return tree;
    } catch (error) {
      console.error("Error fetching categories tree:", error);
      throw error;
    }
  }

  /**
   * Clear cache for categories
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear cache for specific category
   */
  clearCategoryCache(id: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(
      (key) => key.includes(id) || key.includes("categories")
    );
    keysToDelete.forEach((key) => this.cache.delete(key));
  }
}

export const storefrontCategoriesService = new CategoriesService();
