import { Category } from "./app";

export interface AppContextType {
  // Categories
  categories: Category[];

  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  refreshCategories: () => Promise<void>;
  initializeApp: () => Promise<void>;
}
