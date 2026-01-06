"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AppStore } from "@/types/app";
import { unifiedCategoryService } from "@/lib/api/services/unified";

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isLoading: false,
        isInitialized: false,
        categories: [],
        contests: [],
        error: null,

        // Actions
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),

        setCategories: (categories) => {
          set({
            categories,
            isInitialized: true,
          });
        },

        setContests: (contests) => {
          set({ contests });
        },

        initializeApp: async () => {
          const { setLoading, setError, refreshCategories } = get();

          try {
            setLoading(true);
            setError(null);
            await refreshCategories();
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Failed to initialize app"
            );
          } finally {
            setLoading(false);
          }
        },

        addCategory: (category) => {
          const { categories, setCategories } = get();
          const updatedCategories = [...categories, category];
          setCategories(updatedCategories);
        },
        
        updateCategory: (category) => {
          const { categories, setCategories } = get();
          const updatedCategories = categories.map((c) =>
            c.id === category.id ? category : c
          );
          setCategories(updatedCategories);
        },

        removeCategory: (categoryId) => {
          const { categories, setCategories } = get();
          const updatedCategories = categories.filter((c) => c.id !== categoryId);
          setCategories(updatedCategories);
        },

        refreshCategories: async () => {
          const { setLoading, setError, setCategories } = get();

          try {
            setLoading(true);
            setError(null);

            // Fetch categories from API service
            const response = await unifiedCategoryService.getCategories();
            setCategories(response.items);
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Failed to fetch categories"
            );
          } finally {
            setLoading(false);
          }
        },

        refreshContests: async () => {
          const { setLoading, setError } = get();
          try {
            setLoading(true);
            setError(null);
          } catch (error) {
            setError(
              error instanceof Error ? error.message : "Failed to fetch contests"
            );
          } finally {
            setLoading(false);
          }
        },
      }),
      {
        name: "app-store",
        partialize: (state) => ({
          categories: state.categories,
          isInitialized: state.isInitialized,
          contests: state.contests,
        }),
      }
    ),
    {
      name: "app-store",
    }
  )
);
