import { Product, ProductVariant } from "./product";

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
