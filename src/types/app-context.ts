import { Category } from "./app";

export interface AppContextType {
  // Categories
  categories: Category[];
  categoriesTree: Category[];
  getCategoryBySlug: (slug: string) => Category | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getChildCategories: (parentId: string) => Category[];
  getRootCategories: () => Category[];

  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  refreshCategories: () => Promise<void>;
  initializeApp: () => Promise<void>;
}
