// Payment method types
export type PaymentMethod = "COD" | "VNPAY" | "MOMO" | "ZALO";

// Payment status types
export type PaymentStatus = "UNPAID" | "PAID" | "FAILED";

// Order status types
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

// User interface for order
export interface OrderUser {
  id: number;
  username: string;
  clerkId: string;
}

// Order item interface
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
}

// Main order interface
export interface Order {
  id: number;
  code: string;
  user: OrderUser;
  subtotalAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  note?: string;
  items: OrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Order history action types
export type OrderHistoryAction =
  | "CREATED"
  | "PAYMENT"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "CONFIRMED"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

// Order history interface
export interface OrderHistory {
  id: number;
  order: string; // Order code/ID as string
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  action: OrderHistoryAction;
  actorId: number;
  actorName: string;
  note?: string;
  createdAt: string; // ISO date string
}
