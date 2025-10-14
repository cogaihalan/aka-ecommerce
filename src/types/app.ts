export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
  parentId?: string;
  children?: Category[];
  isActive: boolean;
  sortOrder: number;
}

export interface AppStore {
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;

  // Categories
  categories: Category[];
  categoriesTree: Category[];
  categoriesMap: Record<string, Category>;

  // Error states
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCategories: (categories: Category[]) => void;
  initializeApp: () => Promise<void>;
  refreshCategories: () => Promise<void>;

  // Getters
  getCategoryBySlug: (slug: string) => Category | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getChildCategories: (parentId: string) => Category[];
  getRootCategories: () => Category[];
}
