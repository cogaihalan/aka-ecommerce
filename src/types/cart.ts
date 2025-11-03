import { Product } from "./product";

// Cart item interface based on your example
export interface CartItem {
  id: number;
  product: Product;
  price: number;
  quantity: number;
}

// Main cart interface based on your example
export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

// Cart store interface
export interface CartStore {
  // State
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
  itemLoadingStates: Record<number, boolean>;

  // Actions
  addItem: (product: any, quantity?: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  resetCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setItemLoading: (itemId: number, loading: boolean) => void;
  isItemLoading: (itemId: number) => boolean;

  // Utility functions
  getItemQuantity: (productId: number) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
  isItemInCart: (productId: number) => boolean;

  // Persistence
  loadCart: () => Promise<void>;
  saveCart: () => void;
}

// Cart validation result
export interface CartValidationResult {
  isValid: boolean;
  errors: { itemId: string; message: string }[];
  warnings: { itemId: string; message: string }[];
}
