import { serverApiClient } from "@/lib/api/server";
import type { Submission } from "@/types";
import type { QueryParams, AdminUpdateSubmissionStatusRequest, SubmissionListResponse } from "@/lib/api/types";


export class ServerSubmissionService {
    protected basePath = "/admin/submissions";

  async getSubmissions(params: QueryParams = {}): Promise<SubmissionListResponse> {
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

    if (params.status !== undefined) searchParams.append("status", params.status.toString());

    if (params.barberName !== undefined) searchParams.append("barberName", params.barberName.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await serverApiClient.get<SubmissionListResponse>(endpoint);
    return response.data!;
  }

  async adminUpdateSubmissionStatus(data: AdminUpdateSubmissionStatusRequest): Promise<Submission> {
    const response = await serverApiClient.put<Submission>(`${this.basePath}/${data.id}/status?status=${data.status}`);
    return response.data!;
  }
}

export const serverSubmissionService = new ServerSubmissionService();
