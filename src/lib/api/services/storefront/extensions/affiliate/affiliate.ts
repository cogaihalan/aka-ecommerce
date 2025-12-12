import { serverApiClient } from "@/lib/api/server";
import { ServerAffiliateService } from "@/lib/api/services/server/extensions/affiliate/affiliate";
import { AffiliateAccount, AffiliateWithdrawal } from "@/types";
import type { CreateAffiliateWithdrawalRequest } from "@/lib/api/types";

export class StorefrontServerAffiliateService extends ServerAffiliateService {
  protected basePath = "/affiliate/account";
  protected withdrawPath = "/withdraw";

  async getCurrentAffiliateAccount(): Promise<AffiliateAccount> {
    const response = await serverApiClient.get<AffiliateAccount>(this.basePath);
    return response.data!;
  }

  async createAffiliateWithdrawal(data: CreateAffiliateWithdrawalRequest): Promise<AffiliateWithdrawal> {
    const response = await serverApiClient.post<AffiliateWithdrawal>(`${this.basePath}${this.withdrawPath}`, data);
    return response.data!;
  }
}

// Export singleton instance
export const storefrontServerAffiliateService = new StorefrontServerAffiliateService();
