import { ServerAffiliateApprovalService } from "@/lib/api/services/server/extensions/affiliate/affiliate-approval";

export class StorefrontServerAffiliateApprovalService extends ServerAffiliateApprovalService {
  protected basePath = "/affiliates/approvals";
}

// Export singleton instance
export const storefrontServerAffiliateApprovalService = new StorefrontServerAffiliateApprovalService();
