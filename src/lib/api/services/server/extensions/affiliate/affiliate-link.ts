import { serverApiClient } from "@/lib/api/server";
import type { AffiliateLink } from "@/types";
import type { QueryParams, AffiliateLinkListResponse, CreateAffiliateLinkRequest, AffiliateLinkUpdateRequest } from "@/lib/api/types";


export class ServerAffiliateLinkService {
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

    const response = await serverApiClient.get<AffiliateLinkListResponse>(endpoint);
    return response.data!;
  }

  async getAffiliateLink(id: number): Promise<AffiliateLink> {
    const response = await serverApiClient.get<AffiliateLink>(`${this.basePath}/${id}`);
    return response.data!;
  }

  async createAffiliateLink(data: CreateAffiliateLinkRequest): Promise<AffiliateLink> {
    const response = await serverApiClient.post<AffiliateLink>(this.basePath, data);
    return response.data!;
  }

  async updateAffiliateLink(id: number, data: AffiliateLinkUpdateRequest): Promise<AffiliateLink> {
    const response = await serverApiClient.put<AffiliateLink>(`${this.basePath}/${id}`, data);
    return response.data!;
  }

  async toggleActiveAffiliateLink(id: number): Promise<AffiliateLink> {
    const response = await serverApiClient.put<AffiliateLink>(`${this.basePath}/${id}/toggle-active`);
    return response.data!;
  }

}

export const serverAffiliateLinkService = new ServerAffiliateLinkService();
