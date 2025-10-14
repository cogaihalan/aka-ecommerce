"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// import { storefrontCategoriesService } from "@/lib/api/services/storefront/categories";
import { AppStore, Category } from "@/types/app";

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isLoading: false,
        isInitialized: false,
        categories: [],
        categoriesTree: [],
        categoriesMap: {},
        error: null,

        // Actions
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),

        setCategories: (categories) => {
          // Build categories tree and map
          const categoriesMap: Record<string, Category> = {};
          const categoriesTree: Category[] = [];

          // Create map for quick lookups
          categories.forEach((category) => {
            categoriesMap[category.id] = category;
          });

          // Build tree structure
          categories.forEach((category) => {
            if (!category.parentId) {
              // Root category
              const children = categories.filter(
                (c) => c.parentId === category.id
              );
              categoriesTree.push({
                ...category,
                children: children.length > 0 ? children : undefined,
              });
            }
          });

          set({
            categories,
            categoriesTree,
            categoriesMap,
            isInitialized: true,
          });
        },

        initializeApp: async () => {
          const { setLoading, setError, refreshCategories } = get();

          try {
            setLoading(true);
            setError(null);

            // Fetch categories
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

        refreshCategories: async () => {
          const { setLoading, setError, setCategories } = get();

          try {
            setLoading(true);
            setError(null);

            // Fetch categories from API service
            // const response = await storefrontCategoriesService.getCategories({
            //   isActive: true,
            // });
            // setCategories(response.categories);
            setCategories([]);
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

        // Getters
        getCategoryBySlug: (slug) => {
          const { categories } = get();
          return categories.find((category) => category.slug === slug);
        },

        getCategoryById: (id) => {
          const { categoriesMap } = get();
          return categoriesMap[id];
        },

        getChildCategories: (parentId) => {
          const { categories } = get();
          return categories.filter(
            (category) => category.parentId === parentId
          );
        },

        getRootCategories: () => {
          const { categoriesTree } = get();
          return categoriesTree;
        },
      }),
      {
        name: "app-store",
        partialize: (state) => ({
          categories: state.categories,
          isInitialized: state.isInitialized,
        }),
      }
    ),
    {
      name: "app-store",
    }
  )
);
