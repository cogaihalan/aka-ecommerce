// Import comprehensive product types
import type {
  Product,
  ProductReview,
  Category,
  Order,
  User,
  ProductStatus,
  Course,
  Contest,
  Hairstyle,
  PaymentMethod,
  PaymentStatus,
  OrderStatus,
  OrderHistory,
  Submission,
  SubmissionStatus,
  ProductReviewStatus,
} from "@/types";

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
  email?: string;
  phoneNumber?: string;
  active?: boolean;
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  statuses?: string[];
  status?: SubmissionStatus;
  barberName?: string;
  gender?: string;
  rating?: number;
  productId?: number;
}

export interface OrderQueryParams {
  page?: number;
  size?: number;
  sort?: string[];
  status?: OrderStatus;
  orderCode?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  recipientName?: string;
  recipientPhone?: string;
}

// API Response types
export interface ProductListResponse {
  items: Product[];
  pagination: PaginationResponse;
}

export interface ProductReviewListResponse {
  items: ProductReview[];
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

export interface OrderHistoryListResponse {
  items: OrderHistory[];
}

export interface PaymentResponse {
  paymentUrl: string;
}

export interface UserListResponse {
  items: User[];
  pagination: PaginationResponse;
}

export interface CourseListResponse {
  items: Course[];
  pagination: PaginationResponse;
}

export interface ContestListResponse {
  items: Contest[];
  pagination: PaginationResponse;
}

export interface HairstyleListResponse {
  items: Hairstyle[];
  pagination: PaginationResponse;
}

export interface SubmissionListResponse {
  items: Submission[];
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
  stock: number;
  price: number;
  discountPrice?: number;
  categoryIds: number[];
  status: ProductStatus;
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

export interface CreateProductReviewRequest {
  rating: number;
  comment: string;
  productId?: number;
}

export interface UpdateProductReviewStatusRequest {
  id: number;
  status: ProductReviewStatus;
}

// Category API types
export interface CreateCategoryRequest {
  name: string;
  description: string;
  parentId?: number;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id?: number;
}

export interface CategoryMediaUploadRequest {
  id: number;
  file: File;
}

// Order API types
export interface CreateOrderRequest {
  cartItemId: number[];
  paymentMethod: "COD" | "VNPAY" | "MOMO" | "ZALO";
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  note?: string;
}

export interface CreatePaymentRequest {
  orderId: number;
  gateway: "VNPAY" | "MOMO" | "ZALO";
}

// User API types
export interface UpdateUserRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
}

// Cart API types
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface RemoveCartItemRequest {
  productId: number;
}

// Extension API types

// Course API types
export interface CourseCreateRequest {
  name: string;
  description: string;
  duration?: number;
  active: boolean;
}

export interface CourseUpdateRequest {
  id?: number;
  name?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  active?: boolean;
}

export interface CourseMediaUploadRequest {
  id: number;
  file: File;
}

// Contest API types

export interface CreateContestRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface UpdateContestRequest extends Partial<CreateContestRequest> {
  id?: number;
}

export interface ContestMediaUploadRequest {
  id: number;
  file: File;
}

// Hairstyles API types

export interface CreateHairstyleRequest {
  name: string;
  barberName: string;
  gender: string;
}

export interface UpdateHairstyleRequest
  extends Partial<CreateHairstyleRequest> {
  id?: number;
}

export interface HairStyleMediaUploadRequest {
  id: number;
  files: File[];
}

export interface HairStyleMediaDeleteRequest {
  id: number;
  photoIds: number[];
}

// Submissions API types

export interface AdminUpdateSubmissionStatusRequest {
  id: number;
  status: SubmissionStatus;
}

export interface CreateSubmissionRequest {
  name: string;
  contestId: number;
  description: string;
  barberName: string;
  barberAddress: string;
}

export interface SubmissionMediaUploadRequest {
  submissionId: number;
  files: File[];
}
