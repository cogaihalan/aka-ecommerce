import { unifiedProductService } from "@/lib/api/services/unified";
import type { ProductListResponse, QueryParams } from "@/lib/api/types";

import type { Product } from "@/types";

export class StorefrontCatalogService {
  // Product catalog - delegate to unified service
  async getProducts(params: QueryParams = {}): Promise<ProductListResponse> {
    return unifiedProductService.getProducts(params);
  }

  // Get a single product by ID - delegate to unified service
  async getProduct(id: number): Promise<Product> {
    return unifiedProductService.getProduct(id);
  }
}

// Export singleton instance
export const storefrontCatalogService = new StorefrontCatalogService();
