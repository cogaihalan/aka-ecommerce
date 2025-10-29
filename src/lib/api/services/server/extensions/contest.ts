import { serverApiClient } from "@/lib/api/server";
import type {
  ContestListResponse,
  CreateContestRequest,
  UpdateContestRequest,
  QueryParams,
  ContestMediaUploadRequest,
} from "@/lib/api/types";
import type { Contest } from "@/types";

export class ServerUnifiedContestService {
  protected basePath = "/admin/contests";

  // Get products with new query structure
  async getContests(params: QueryParams = {}): Promise<ContestListResponse> {
    const searchParams = new URLSearchParams();

    // Handle pagination
    if (params.page !== undefined)
      searchParams.append("page", params.page.toString());
    if (params.size !== undefined)
      searchParams.append("size", params.size.toString());

    // Handle sorting
    if (params.sort && params.sort.length > 0) {
      params.sort.forEach((sortItem: string) => {
        searchParams.append("sort", sortItem);
      });
    }

    if (params.name !== undefined)
      searchParams.append("name", params.name.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await serverApiClient.get<ContestListResponse>(endpoint);

    return response.data!;
  }

  async getContest(id: number): Promise<Contest> {
    const response = await serverApiClient.get<Contest>(`${this.basePath}/${id}`);
    return response.data!;
  }

  async createContest(data: CreateContestRequest): Promise<Contest> {
    const response = await serverApiClient.post<Contest>(this.basePath, data);
    return response.data!;
  }

    async updateContest(
        id: number,
        data: UpdateContestRequest
    ): Promise<Contest> {
        const response = await serverApiClient.put<Contest>(
        `${this.basePath}/${id}`,
        data
        );
        return response.data!;
    }
    async uploadContestThumbnail(data: ContestMediaUploadRequest): Promise<Contest> {
        const formData = new FormData();
        formData.append("id", data.id.toString());
        formData.append("file", data.file);
        const response = await serverApiClient.post<Contest>(`${this.basePath}/${data.id}/thumbnail`, formData);
        return response.data!;
    }

    async deleteContestThumbnail(id: number): Promise<void> {
        await serverApiClient.delete(`${this.basePath}/${id}/thumbnail`);
    }
}

// Export singleton instance
export const serverUnifiedContestService = new ServerUnifiedContestService();
