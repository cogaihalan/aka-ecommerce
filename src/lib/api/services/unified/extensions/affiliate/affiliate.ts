import { apiClient } from "@/lib/api/client";
import type { AffiliateWithdrawal } from "@/types";
import type { QueryParams, AffiliateAccountListResponse, AffiliateWithdrawalListResponse, AffiliateTransactionListResponse } from "@/lib/api/types";

export class  UnifiedAffiliateService {
    protected basePath = "/admin/affiliate/account";

    async getAffiliateAccount(params: QueryParams = {}): Promise<AffiliateAccountListResponse> {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.append("page", params.page.toString());
        if (params.size !== undefined) searchParams.append("size", params.size.toString());
        if (params.sort !== undefined) searchParams.append("sort", params.sort.toString());

        if (params.affiliateId !== undefined) searchParams.append("affiliateId", params.affiliateId.toString());

        if (params.affiliateCode !== undefined) searchParams.append("affiliateCode", params.affiliateCode);

        const response = await apiClient.get<AffiliateAccountListResponse>(`${this.basePath}?${searchParams.toString()}`);
        return response.data!;
    }

    async getAffiliateWithdrawals(params: QueryParams = {}): Promise<AffiliateWithdrawalListResponse> {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.append("page", params.page.toString());
        if (params.size !== undefined) searchParams.append("size", params.size.toString());
        if (params.sort !== undefined) searchParams.append("sort", params.sort.toString());

        if (params.affiliateId !== undefined) searchParams.append("affiliateId", params.affiliateId.toString());

        if (params.affiliateCode !== undefined) searchParams.append("affiliateCode", params.affiliateCode);

        if (params.status !== undefined) searchParams.append("status", params.status.toString());

        const response = await apiClient.get<AffiliateWithdrawalListResponse>(`${this.basePath}?${searchParams.toString()}`);
        return response.data!;
    }

    async getAffiliateTransactions(params: QueryParams = {}): Promise<AffiliateTransactionListResponse> {
        const searchParams = new URLSearchParams();
        if (params.page !== undefined) searchParams.append("page", params.page.toString());
        if (params.size !== undefined) searchParams.append("size", params.size.toString());
        if (params.sort !== undefined) searchParams.append("sort", params.sort.toString());

        if (params.affiliateId !== undefined) searchParams.append("affiliateId", params.affiliateId.toString());

        if (params.affiliateCode !== undefined) searchParams.append("affiliateCode", params.affiliateCode);

        if (params.type !== undefined) searchParams.append("type", params.type);

        const response = await apiClient.get<AffiliateTransactionListResponse>(`${this.basePath}?${searchParams.toString()}`);
        return response.data!;
    }

    async updateAffiliateWithdrawalStatus(id: number): Promise<AffiliateWithdrawal> {
        const response = await apiClient.post<AffiliateWithdrawal>(`${this.basePath}/${id}`);
        return response.data!;
    }
}

export const unifiedAffiliateService = new UnifiedAffiliateService();
