import { UnifiedSubmissionService } from "@/lib/api/services/unified/extensions/submissions";
import type { Submission } from "@/types";
import type { CreateSubmissionRequest, QueryParams, SubmissionListResponse, SubmissionMediaUploadRequest } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";

export class StorefrontSubmissionService extends UnifiedSubmissionService {
  protected basePath = "/submissions";


  async getMySubmissions(params: QueryParams = {}): Promise<SubmissionListResponse> {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append("page", params.page.toString());
    if (params.size !== undefined) searchParams.append("size", params.size.toString());
    
    // Handle sorting
    if (params.sort && params.sort.length > 0) {
        params.sort.forEach((sortItem) => {
            searchParams.append("sort", sortItem);
        });
        }
      
    if (params.status !== undefined) searchParams.append("status", params.status.toString());
    if (params.barberName !== undefined) searchParams.append("barberName", params.barberName.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;
    const response = await apiClient.get<SubmissionListResponse>(endpoint);
    return response.data!;
  }

  async createSubmission(data: CreateSubmissionRequest): Promise<Submission> {
    const response = await apiClient.post<Submission>(this.basePath, data);
    return response.data!;
  }

  async voteSubmission(submissionId: number): Promise<Submission> {
    const response = await apiClient.post<Submission>(`${this.basePath}/${submissionId}/vote`);
    return response.data!;
  }

  async uploadSubmissionMedia(data: SubmissionMediaUploadRequest): Promise<Submission> {
    const formData = new FormData();
    formData.append("submissionId", data.submissionId.toString());
    data.files.forEach((file) => {
      formData.append("files", file);
    });
    const response = await apiClient.post<Submission>(`${this.basePath}/${data.submissionId}/photos`, formData);
    return response.data!;
  }
}

// Export singleton instance
export const storefrontSubmissionService = new StorefrontSubmissionService();
