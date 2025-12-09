import { apiClient } from "@/lib/api/client";
import { UnifiedAffiliateService } from "@/lib/api/services/unified/extensions/affiliate/affiliate";
import { AffiliateAccount, AffiliateWithdrawal } from "@/types";
import type { CreateAffiliateWithdrawalRequest } from "@/lib/api/types";

export class StorefrontAffiliateService extends UnifiedAffiliateService {
  protected basePath = "/affiliate/account";
  
  async getCurrentAffiliateAccount(): Promise<AffiliateAccount> {
    const response = await apiClient.get<AffiliateAccount>(this.basePath);
    return response.data!;
  }

  async createAffiliateWithdrawal(data: CreateAffiliateWithdrawalRequest): Promise<AffiliateWithdrawal> {
    const response = await apiClient.post<AffiliateWithdrawal>(this.basePath, data);
    return response.data!;
  }
}

// Export singleton instance
export const storefrontAffiliateService = new StorefrontAffiliateService();
