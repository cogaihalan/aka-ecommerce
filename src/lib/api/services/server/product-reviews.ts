import { serverApiClient } from "@/lib/api/server";
import type {
  ProductReviewListResponse,
  CreateProductReviewRequest,
  UpdateProductReviewStatusRequest,
  QueryParams,
} from "@/lib/api/types";
import type { ProductReview } from "@/types/product";

export class ServerProductReviewService {
  protected basePath = "/admin/reviews";

  // Get products with new query structure
  async getProductReviews(params: QueryParams = {}): Promise<ProductReviewListResponse> {
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

    if (params.productId !== undefined)
      searchParams.append("productId", params.productId.toString());
    
    if (params.rating !== undefined)
      searchParams.append("rating", params.rating.toString());

    // Handle status filtering
    if (params.statuses && params.statuses.length > 0) {
      params.statuses.forEach((status) => {
        searchParams.append("statuses", status);
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await serverApiClient.get<ProductReviewListResponse>(endpoint);
    return response.data!;
  }

  async createProductReview(data: CreateProductReviewRequest): Promise<ProductReview> {
    const response = await serverApiClient.post<ProductReview>(`${this.basePath}/${data.productId}`, data);
    return response.data!;
  }

  async updateProductReviewStatus(
    id: number,
    data: UpdateProductReviewStatusRequest
  ): Promise<ProductReview> {
    const response = await serverApiClient.put<ProductReview>(`${this.basePath}/${id}/status?status=${data.status}`);
    return response.data!;
  }

}

export const serverProductReviewService = new ServerProductReviewService();
