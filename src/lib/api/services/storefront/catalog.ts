import { UnifiedProductService } from "@/lib/api/services/unified/products";

export class StorefrontCatalogService extends UnifiedProductService {
  protected basePath = "/products";
}

// Export singleton instance
export const storefrontCatalogService = new StorefrontCatalogService();
