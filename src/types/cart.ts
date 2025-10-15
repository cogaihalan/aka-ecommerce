// Cart item interface
export interface CartItem {
  id: number;
  variantId: number;
  variantName: string;
  quantity: number;
  price: number;
}

// Main cart interface
export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}
