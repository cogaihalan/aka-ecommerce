// Cart item interface
export interface CartItem {
  id: string;
  productId: number;
  variantId?: number;
  name: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  image?: string;
  attributes: Record<string, string>;
  sku: string;
  weight?: number;
  maxQuantity?: number;
}

// Main cart interface
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

  // Actions
  addItem: (
    product: any,
    variant?: any,
    quantity?: number,
    attributes?: Record<string, string>
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utility functions
  getItemQuantity: (productId: number, variantId?: number) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
  isItemInCart: (productId: number, variantId?: number) => boolean;

  // Persistence
  loadCart: () => void;
  saveCart: () => void;
}

// Cart validation result
export interface CartValidationResult {
  isValid: boolean;
  errors: { itemId: string; message: string }[];
  warnings: { itemId: string; message: string }[];
}

// Add to cart parameters
export interface AddToCartParams {
  product: any;
  variant?: any;
  quantity?: number;
}
