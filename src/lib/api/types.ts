// Import comprehensive product types
import type { Product, ProductVariant } from "@/types/product";

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

// Order types
export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  customer: Customer;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  pricing: OrderPricing;
  shipping: OrderShippingInfo;
  payment: PaymentInfo;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
  discount?: number;
  tax?: number;
}

export interface OrderPricing {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
}

export interface OrderShippingInfo {
  method: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  cost: number;
}

export interface PaymentInfo {
  method: string;
  gateway: string;
  transactionId?: string;
  status: PaymentStatus;
  processedAt?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type FulfillmentStatus =
  | "unfulfilled"
  | "partial"
  | "fulfilled"
  | "cancelled";

// Customer types
export interface Customer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: "active" | "inactive" | "banned";
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Address {
  id: number;
  type: "shipping" | "billing";
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  phone?: string;
  isDefault: boolean;
}

// Cart types
export interface Cart {
  id: string;
  customerId?: number;
  items: CartItem[];
  pricing: CartPricing;
  shippingAddress?: Address;
  billingAddress?: Address;
  appliedCoupons: AppliedCoupon[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  addedAt: string;
}

export interface CartPricing {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  appliedAt: string;
}

// Wishlist types
export interface Wishlist {
  id: number;
  customerId: number;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: number;
  product: Product;
  variant?: ProductVariant;
  addedAt: string;
}

// Search types
export interface SearchResult<T = any> {
  items: T[];
  pagination: PaginationResponse;
  filters: SearchFilter[];
  suggestions: string[];
  total: number;
}

export interface SearchFilter {
  key: string;
  label: string;
  type: "range" | "select" | "multiselect" | "boolean";
  options: FilterOption[];
  selected?: any;
}

export interface FilterOption {
  value: any;
  label: string;
  count: number;
}

// API Response types
export interface ProductListResponse {
  items: Product[];
  pagination: PaginationResponse;
}

export interface OrderListResponse {
  orders: Order[];
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
}

export interface ProductImageDeleteRequest {
  id: number;
  files: File[];
  removedImageIds: number[];
}

export interface CreateOrderRequest {
  customerId?: number;
  items: {
    productId: number;
    variantId?: number;
    quantity: number;
  }[];
  shippingAddress: Omit<Address, "id">;
  billingAddress?: Omit<Address, "id">;
  shippingMethod: string;
  paymentMethod: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateOrderRequest {
  id: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  notes?: string;
  tags?: string[];
}
