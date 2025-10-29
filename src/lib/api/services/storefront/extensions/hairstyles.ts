import { apiClient } from "@/lib/api/client";
import { UnifiedHairstyleService } from "@/lib/api/services/unified/extensions/hairstyles";
import { HairstyleListResponse, QueryParams } from "@/lib/api/types";
import { Hairstyle } from "@/types";

export class StorefrontHairstyleService extends UnifiedHairstyleService {
  protected basePath = "/user/hairstyles";

  async getHairstyles(params: QueryParams = {}): Promise<HairstyleListResponse> {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append("page", params.page.toString());
    if (params.size !== undefined) searchParams.append("size", params.size.toString());
    if (params.sort && params.sort.length > 0) {
      params.sort.forEach((sortItem) => {
        searchParams.append("sort", sortItem);
      });
    }
    if (params.gender !== undefined) searchParams.append("gender", params.gender.toString());
    if (params.barberName !== undefined) searchParams.append("barberName", params.barberName.toString());
    if (params.name !== undefined) searchParams.append("name", params.name.toString());
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;
    const response = await apiClient.get<HairstyleListResponse>(endpoint);
    return response.data!;
  }

  async getHairstyle(id: number): Promise<Hairstyle> {
    const response = await apiClient.get<Hairstyle>(`${this.basePath}/${id}`);
    return response.data!;
  }

  async toggleFavoriteHairstyle(id: number): Promise<Hairstyle> {
    const response = await apiClient.post<Hairstyle>(`${this.basePath}/${id}/favorite`);
    return response.data!;
  }
}

// Export singleton instance
export const storefrontHairstyleService = new StorefrontHairstyleService();
