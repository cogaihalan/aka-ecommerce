import { apiClient } from "@/lib/api/client";
import type { AffiliateApproval } from "@/types";
import type { QueryParams, AffiliateApprovalListResponse, AdminUpdateAffiliateApprovalStatusRequest } from "@/lib/api/types";


export class  UnifiedAffiliateApprovalService {
    protected basePath = "/admin/affiliate/approvals";

    async getAffiliateApprovals(params: QueryParams = {}): Promise<AffiliateApprovalListResponse> {
    const searchParams = new URLSearchParams();

    // Handle pagination
    if (params.page !== undefined) searchParams.append("page", params.page.toString());
    if (params.size !== undefined) searchParams.append("size", params.size.toString());

    // Handle sorting
    if (params.sort && params.sort.length > 0) {
      params.sort.forEach((sortItem) => {
        searchParams.append("sort", sortItem);
      });
    }

    // Handle search
    if (params.status !== undefined) searchParams.append("status", params.status.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await apiClient.get<AffiliateApprovalListResponse>(endpoint);
    return response.data!;
    }

    async updateAffiliateApprovalStatus(data: AdminUpdateAffiliateApprovalStatusRequest): Promise<AffiliateApproval> {
        const endpoint = `${this.basePath}/${data.id}/${data.status.slice(0, -1).toLowerCase()}`;
        const response = await apiClient.patch<AffiliateApproval>(endpoint);
        return response.data!;
    }

    async createAffiliateApproval(): Promise<AffiliateApproval> {
        const response = await apiClient.post<AffiliateApproval>(this.basePath);
        return response.data!;
    }
}

export const unifiedAffiliateApprovalService = new UnifiedAffiliateApprovalService();
