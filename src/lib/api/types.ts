// Import comprehensive product types
import type { Product, Category, Order, User, OrderStatus } from "@/types";

// Base API types
export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface QueryParams {
  page?: number;
  size?: number;
  sort?: string[];
  name?: string;
}

// API Response types
export interface ProductListResponse {
  items: Product[];
  pagination: PaginationResponse;
}

export interface CategoryListResponse {
  items: Category[];
  pagination: PaginationResponse;
}

export interface OrderListResponse {
  items: Order[];
  pagination: PaginationResponse;
}

export interface UserListResponse {
  items: User[];
  pagination: PaginationResponse;
}

// Error types
export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: any;
  requestId?: string;
  timestamp: string;
}

// Simplified Product Creation Interface
export interface CreateProductRequest {
  name: string;
  description: string;
  categoryIds: number[];
  price: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id?: number;
}

// Product Image API types
export interface ProductImageUploadRequest {
  id: number;
  files: File[];
}

export interface ProductImageUpdateRequest {
  id: number;
  files: File[];
  removedImageIds: number[];
  primaryImageId?: number | null;
}

export interface ProductImageDeleteRequest {
  id: number;
  files: File[];
  removedImageIds: number[];
}

// Category API types
export interface CreateCategoryRequest {
  name: string;
  description: string;
  parentId: number;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id?: number;
}

// Order API types
export interface CreateOrderRequest {
  shippingAddress: string;
}

// User API types
export interface UpdateUserRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
}

// Cart API types
export interface AddToCartRequest {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface RemoveCartItemRequest {
  variantId: number;
}
