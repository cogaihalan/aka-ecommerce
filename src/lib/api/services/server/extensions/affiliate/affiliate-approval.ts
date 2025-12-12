import { serverApiClient } from "@/lib/api/server";
import type { AffiliateApproval } from "@/types";
import type { QueryParams, AffiliateApprovalListResponse, AdminUpdateAffiliateApprovalStatusRequest } from "@/lib/api/types";


export class ServerAffiliateApprovalService {
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
    if (params.name !== undefined) searchParams.append("name", params.name.toString());

    if (params.code !== undefined) searchParams.append("code", params.code.toString());

    if (params.campaignName !== undefined) searchParams.append("campaignName", params.campaignName.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await serverApiClient.get<AffiliateApprovalListResponse>(endpoint);
    return response.data!;
    }

    async approveAffiliateApproval(data: AdminUpdateAffiliateApprovalStatusRequest): Promise<AffiliateApproval> {
        const endpoint = `${this.basePath}/${data.id}/approve`;
        const response = await serverApiClient.patch<AffiliateApproval>(endpoint);
        return response.data!;
    }

    async rejectAffiliateApproval(data: AdminUpdateAffiliateApprovalStatusRequest): Promise<AffiliateApproval> {
        const endpoint = `${this.basePath}/${data.id}/reject`;
        const response = await serverApiClient.patch<AffiliateApproval>(endpoint, data);
        return response.data!;
    }

    async createAffiliateApproval(): Promise<AffiliateApproval> {
        const response = await serverApiClient.post<AffiliateApproval>(this.basePath);
        return response.data!;
    }
}

export const serverAffiliateApprovalService = new ServerAffiliateApprovalService();
