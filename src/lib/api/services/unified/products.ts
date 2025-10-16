import { apiClient } from "@/lib/api/client";
import type {
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  QueryParams,
  ProductImageUploadRequest,
  ProductImageUpdateRequest,
  ProductImageDeleteRequest,
} from "@/lib/api/types";
import type { Product } from "@/types/product";

export class UnifiedProductService {
  protected basePath = "/admin/products";

  // Get products with new query structure
  async getProducts(params: QueryParams = {}): Promise<ProductListResponse> {
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

    if (params.name !== undefined)
      searchParams.append("name", params.name.toString());

    // Handle category filtering
    if (params.categoryIds && params.categoryIds.length > 0) {
      params.categoryIds.forEach((categoryId) => {
        searchParams.append("categoryIds", categoryId.toString());
      });
    }

    // Handle price range filtering
    if (params.minPrice !== undefined)
      searchParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice !== undefined)
      searchParams.append("maxPrice", params.maxPrice.toString());

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

    console.log(endpoint);
    const response = await apiClient.get<ProductListResponse>(endpoint);
    console.log(response);
    return response.data!;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`${this.basePath}/${id}`);
    return response.data!;
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<Product>(this.basePath, data);
    return response.data!;
  }

  async updateProduct(
    id: number,
    data: UpdateProductRequest
  ): Promise<Product> {
    const response = await apiClient.put<Product>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  async patchProduct(
    id: number,
    data: Partial<UpdateProductRequest>
  ): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  // Product Image Management API
  async uploadProductImages(data: ProductImageUploadRequest): Promise<Product> {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    data.files.forEach((file) => {
      formData.append(`files`, file);
    });

    const response = await apiClient.post<Product>(
      `${this.basePath}/${data.id}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data!;
  }

  async updateProductImages(data: ProductImageUpdateRequest): Promise<Product> {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    formData.append("removedImageIds", JSON.stringify(data.removedImageIds));
    if (data.primaryImageId !== undefined) {
      formData.append("primaryImageId", data.primaryImageId?.toString() || "");
    }
    data.files.forEach((file) => {
      formData.append(`files`, file);
    });

    const response = await apiClient.put<Product>(
      `${this.basePath}/${data.id}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data!;
  }

  async deleteProductImages(data: ProductImageDeleteRequest): Promise<Product> {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    formData.append("removedImageIds", JSON.stringify(data.removedImageIds));
    data.files.forEach((file) => {
      formData.append(`files`, file);
    });

    const response = await apiClient.request<Product>(
      `${this.basePath}/${data.id}/images`,
      {
        method: "DELETE",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data!;
  }
}

export const unifiedProductService = new UnifiedProductService();
