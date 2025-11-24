import { UnifiedAffiliateApprovalService } from "@/lib/api/services/unified/extensions/affiliate/affiliate-approval";

export class StorefrontAffiliateApprovalService extends UnifiedAffiliateApprovalService {
  protected basePath = "/affiliate/approvals";
}

// Export singleton instance
export const storefrontAffiliateApprovalService = new StorefrontAffiliateApprovalService();
