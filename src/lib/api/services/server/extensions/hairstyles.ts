import { serverApiClient } from "@/lib/api/server";
import type { Hairstyle } from "@/types";
import type { QueryParams, HairstyleListResponse, CreateHairstyleRequest, UpdateHairstyleRequest, HairStyleMediaUploadRequest, HairStyleMediaDeleteRequest } from "@/lib/api/types";


export class ServerHairstyleService {
  protected basePath = "/admin/hairstyles";

  async getHairstyles(params: QueryParams = {}): Promise<HairstyleListResponse> {
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
    if (params.gender !== undefined) searchParams.append("gender", params.gender.toString());
    if (params.barberName !== undefined) searchParams.append("barberName", params.barberName.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await serverApiClient.get<HairstyleListResponse>(endpoint);
    return response.data!;
  }

  async getHairstyle(id: number): Promise<Hairstyle> {
        const response = await serverApiClient.get<Hairstyle>(`${this.basePath}/${id}`);
    return response.data!;
  }

  async createHairstyles(data: CreateHairstyleRequest): Promise<Hairstyle> {
    const response = await serverApiClient.post<Hairstyle>(this.basePath, data);
    return response.data!;
  }

  async updateHairstyle(id: number, data: UpdateHairstyleRequest): Promise<Hairstyle> {
    const response = await serverApiClient.put<Hairstyle>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  async uploadHairstyleMedia(data: HairStyleMediaUploadRequest): Promise<Hairstyle> {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    data.files.forEach((file) => {
      formData.append("files", file);
    });
    const response = await serverApiClient.post<Hairstyle>(
      `${this.basePath}/${data.id}/media`,
      formData
    );
    return response.data!;
  }

  async deleteHairstyleMedia(data: HairStyleMediaDeleteRequest): Promise<Hairstyle> {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    formData.append("photoIds", JSON.stringify(data.photoIds));
    const response = await serverApiClient.request<Hairstyle>(
      `${this.basePath}/${data.id}/media`,
      {
        method: "DELETE",
        body: formData,
      }
    );
    return response.data!;
  }
}

export const serverUnifiedHairstyleService = new ServerHairstyleService();
