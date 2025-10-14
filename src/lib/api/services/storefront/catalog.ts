import {
  unifiedProductService,
  unifiedCategoryService,
} from "@/lib/api/services/unified";
import type {
  Product,
  ProductListResponse,
  Category,
  QueryParams,
} from "@/lib/api/types";

export class StorefrontCatalogService {
  // Product catalog - delegate to unified service
  async getProducts(params: QueryParams = {}): Promise<ProductListResponse> {
    return unifiedProductService.getProducts(params);
  }

  // Get a single product by ID - delegate to unified service
  async getProduct(id: number): Promise<Product> {
    return unifiedProductService.getProduct(id);
  }

  // Get product with full details for storefront - delegate to unified service
  async getProductWithDetails(id: number): Promise<Product> {
    return unifiedProductService.getProduct(id);
  }

  // Categories - delegate to unified service
  async getCategories(): Promise<Category[]> {
    const result = await unifiedCategoryService.getCategories({});
    return Array.isArray(result) ? result : result.categories;
  }

  async getCategory(slug: string): Promise<Category> {
    return unifiedCategoryService.getCategoryBySlug(slug);
  }
}

// Export singleton instance
export const storefrontCatalogService = new StorefrontCatalogService();
