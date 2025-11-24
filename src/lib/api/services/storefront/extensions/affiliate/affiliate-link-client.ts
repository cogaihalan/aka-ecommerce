import { UnifiedAffiliateLinkService } from "@/lib/api/services/unified/extensions/affiliate/affiliate-link";

export class StorefrontAffiliateLinkService extends UnifiedAffiliateLinkService {
  protected basePath = "/affiliate/links";
}

// Export singleton instance
export const storefrontAffiliateLinkService = new StorefrontAffiliateLinkService();
