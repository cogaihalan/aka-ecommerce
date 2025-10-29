import { serverApiClient } from "@/lib/api/server";
import type { Hairstyle } from "@/types";
import type { QueryParams, HairstyleListResponse } from "@/lib/api/types";

export class ServerStorefrontHairstyleService {
  protected basePath = "/user/hairstyles";

  async getHairstyles(
    params: QueryParams = {}
  ): Promise<HairstyleListResponse> {
    const searchParams = new URLSearchParams();

    // Handle pagination
    if (params.page !== undefined)
      searchParams.append("page", params.page.toString());
    if (params.size !== undefined)
      searchParams.append("size", params.size.toString());

    // Handle sorting
    if (params.sort && params.sort.length > 0) {
      params.sort.forEach((sortItem) => {
        searchParams.append("sort", sortItem);
      });
    }

    // Handle search
    if (params.name !== undefined)
      searchParams.append("name", params.name.toString());
    if (params.gender !== undefined)
      searchParams.append("gender", params.gender.toString());
    if (params.barberName !== undefined)
      searchParams.append("barberName", params.barberName.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await serverApiClient.get<HairstyleListResponse>(endpoint);
    return response.data!;
  }

  async getHairstyle(id: number): Promise<Hairstyle> {
    const response = await serverApiClient.get<Hairstyle>(
      `${this.basePath}/${id}`
    );
    return response.data!;
  }
}

export const serverStorefrontHairstyleService =
  new ServerStorefrontHairstyleService();
