import { ServerAffiliateLinkService } from "@/lib/api/services/server/extensions/affiliate/affiliate-link";

export class StorefrontServerAffiliateLinkService extends ServerAffiliateLinkService {
  protected basePath = "/affiliate/links";
}

// Export singleton instance
export const storefrontServerAffiliateLinkService = new StorefrontServerAffiliateLinkService();
