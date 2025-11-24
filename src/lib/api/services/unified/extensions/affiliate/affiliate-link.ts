import { apiClient } from "@/lib/api/client";
import type { AffiliateLink } from "@/types";
import type { QueryParams, AffiliateLinkListResponse, CreateAffiliateLinkRequest } from "@/lib/api/types";


export class  UnifiedAffiliateLinkService {
    protected basePath = "/admin/affiliate/links";

    async getAffiliateLinks(params: QueryParams = {}): Promise<AffiliateLinkListResponse> {
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

      const response = await apiClient.get<AffiliateLinkListResponse>(endpoint);
      return response.data!;
    }

    async getAffiliateLink(id: number): Promise<AffiliateLink> {
      const response = await apiClient.get<AffiliateLink>(`${this.basePath}/${id}`);
      return response.data!;
    }

    async createAffiliateLink(data: CreateAffiliateLinkRequest): Promise<AffiliateLink> {
      const response = await apiClient.post<AffiliateLink>(this.basePath, data);
      return response.data!;
    }

    async toggleActiveAffiliateLink(id: number): Promise<AffiliateLink> {
      const response = await apiClient.put<AffiliateLink>(`${this.basePath}/${id}/toggle-active`);
      return response.data!;
    }

}

export const unifiedAffiliateLinkService = new UnifiedAffiliateLinkService();
