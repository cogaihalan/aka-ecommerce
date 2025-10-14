import { serverApiClient } from "@/lib/api/server";
import type {
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  QueryParams,
  ProductImageUploadRequest,
  ProductImageUpdateRequest,
  ProductImageDeleteRequest,
} from "@/lib/api/types";
import type { Product, ProductVariant } from "@/types/product";

class ServerUnifiedProductService {
  private basePath = "/products";

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

    // const queryString = searchParams.toString();
    const queryString = "";
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await serverApiClient.get<ProductListResponse>(endpoint);

    return response.data!;
  }

  async getProduct(id: number): Promise<Product> {
    const response = await serverApiClient.get<Product>(
      `${this.basePath}/${id}`
    );
    return response.data!;
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await serverApiClient.post<Product>(this.basePath, data);
    return response.data!;
  }

  async updateProduct(
    id: number,
    data: UpdateProductRequest
  ): Promise<Product> {
    const response = await serverApiClient.put<Product>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  async patchProduct(
    id: number,
    data: Partial<UpdateProductRequest>
  ): Promise<Product> {
    const response = await serverApiClient.patch<Product>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  async deleteProduct(id: number): Promise<void> {
    await serverApiClient.delete(`${this.basePath}/${id}`);
  }

  // Product Image Management API
  async uploadProductImages(data: ProductImageUploadRequest): Promise<Product> {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    data.files.forEach((file) => {
      formData.append(`files`, file);
    });

    const response = await serverApiClient.post<Product>(
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
    data.files.forEach((file) => {
      formData.append(`files`, file);
    });

    const response = await serverApiClient.put<Product>(
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

    const response = await serverApiClient.request<Product>(
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

  // Product variants
  async getProductVariants(productId: number): Promise<ProductVariant[]> {
    const response = await serverApiClient.get<ProductVariant[]>(
      `${this.basePath}/${productId}/variants`
    );
    return response.data!;
  }

  async createProductVariant(
    productId: number,
    data: Partial<ProductVariant>
  ): Promise<ProductVariant> {
    const response = await serverApiClient.post<ProductVariant>(
      `${this.basePath}/${productId}/variants`,
      data
    );
    return response.data!;
  }

  async updateProductVariant(
    productId: number,
    variantId: number,
    data: Partial<ProductVariant>
  ): Promise<ProductVariant> {
    const response = await serverApiClient.patch<ProductVariant>(
      `${this.basePath}/${productId}/variants/${variantId}`,
      data
    );
    return response.data!;
  }

  async deleteProductVariant(
    productId: number,
    variantId: number
  ): Promise<void> {
    await serverApiClient.delete(
      `${this.basePath}/${productId}/variants/${variantId}`
    );
  }

  // Media management removed - use ProductImageManager component instead

  // Complex product management methods removed - use simplified product structure

  // Analytics and comparison methods removed - use simplified product structure

  // Bulk operations and import/export removed - use simplified product structure
}

// Export singleton instance
export const serverUnifiedProductService = new ServerUnifiedProductService();
