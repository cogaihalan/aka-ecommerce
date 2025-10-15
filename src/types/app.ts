export interface Category {
  id: number;
  name: string;
  description: string;
  parentId: number;
}

export interface AppStore {
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;

  // Categories
  categories: Category[];

  // Error states
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCategories: (categories: Category[]) => void;
  initializeApp: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  removeCategory: (categoryId: number) => void;
}
