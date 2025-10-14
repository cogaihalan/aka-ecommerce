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
import type { Product, ProductVariant } from "@/types/product";

class UnifiedProductService {
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

    // Handle dynamic parameters
    Object.entries(params).forEach(([key, value]) => {
      if (
        key !== "page" &&
        key !== "size" &&
        key !== "sort" &&
        value !== undefined &&
        value !== null
      ) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(`${key}[]`, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await apiClient.get<ProductListResponse>(endpoint);
    return response.data!;
  }

  // Search products with simplified query structure
  async searchProducts(params: QueryParams = {}): Promise<ProductListResponse> {
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

    // Handle dynamic parameters
    Object.entries(params).forEach(([key, value]) => {
      if (
        key !== "page" &&
        key !== "size" &&
        key !== "sort" &&
        value !== undefined &&
        value !== null
      ) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(`${key}[]`, v.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/search?${queryString}`
      : `${this.basePath}/search`;

    const response = await apiClient.get<ProductListResponse>(endpoint);
    return response.data!;
  }

  // Basic CRUD operations
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

  // Enhanced product management methods

  // Get product with full details including variants, reviews, etc.
  async getProductWithDetails(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(
      `${this.basePath}/${id}/details`
    );
    return response.data!;
  }

  // Product Image Management API
  async uploadProductImages(data: ProductImageUploadRequest): Promise<Product> {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    data.files.forEach((file, index) => {
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

  // Manage product categories
  async assignProductToCategories(
    productId: number,
    categoryIds: number[],
    primaryCategoryId?: number
  ): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${productId}/categories`,
      {
        categoryIds,
        primaryCategoryId,
      }
    );
    return response.data!;
  }

  // Product status management
  async publishProduct(id: number): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}/publish`
    );
    return response.data!;
  }

  async unpublishProduct(id: number): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}/unpublish`
    );
    return response.data!;
  }

  async archiveProduct(id: number): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}/archive`
    );
    return response.data!;
  }

  // Product comparison removed - use simplified product structure
}

export const unifiedProductService = new UnifiedProductService();
