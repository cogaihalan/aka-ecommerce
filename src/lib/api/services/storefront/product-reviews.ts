import { UnifiedProductReviewService } from "@/lib/api/services/unified/product-reviews";

export class StorefrontProductReviewService extends UnifiedProductReviewService {
  protected basePath = "/reviews";
}

// Export singleton instance
export const storefrontProductReviewService = new StorefrontProductReviewService();
