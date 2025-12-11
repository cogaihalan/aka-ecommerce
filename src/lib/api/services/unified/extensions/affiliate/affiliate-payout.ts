import { apiClient } from "@/lib/api/client";
import type { AffiliatePayoutMethod } from "@/types";
import type { AffiliatePayoutMethodListResponse, CreateAffiliatePayoutMethodRequest } from "@/lib/api/types";


export class  UnifiedAffiliatePayoutService {
    protected basePath = "/affiliate/payout-method";

    async getAffiliatePayoutMethods(): Promise<AffiliatePayoutMethodListResponse> {
        const response = await apiClient.get<AffiliatePayoutMethodListResponse>(this.basePath);
        return response.data!;
    }

    async createAffiliatePayoutMethod(data: CreateAffiliatePayoutMethodRequest): Promise<AffiliatePayoutMethod> {
        const response = await apiClient.post<AffiliatePayoutMethod>(this.basePath, data);
        return response.data!;
    }

    async updateAffiliatePayoutMethod(id: number): Promise<AffiliatePayoutMethod> {
        const response = await apiClient.post<AffiliatePayoutMethod>(`${this.basePath}/${id}/set-active`);
        return response.data!;
    }

    async deleteAffiliatePayoutMethod(id: number): Promise<void> {
        await apiClient.delete<void>(`${this.basePath}/${id}`);
    }
}

export const unifiedAffiliatePayoutService = new UnifiedAffiliatePayoutService();
