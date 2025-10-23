// Order status types
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

// Order item interface
export interface OrderItem {
  id: number;
  variantId: number;  
  productName: string;
  variantName: string;
  quantity: number;
  priceAtPurchase: number;
}

// Main order interface
export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
