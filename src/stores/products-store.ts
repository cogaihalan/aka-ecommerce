"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { storefrontCatalogService } from "@/lib/api/services/storefront/catalog";
import type { Product } from "@/types/product";
import type { QueryParams, ProductListResponse } from "@/lib/api/types";

interface ProductsStore {
  // State
  products: Product[];
  isLoading: boolean;
  error: string | null;
  lastFetchParams: QueryParams | null;
  totalCount: number;
  currentPage: number;
  hasMore: boolean;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProducts: (products: Product[], totalCount: number) => void;
  addProducts: (products: Product[]) => void;
  clearProducts: () => void;
  fetchProducts: (params: QueryParams, append?: boolean) => Promise<void>;
  refreshProducts: (params: QueryParams) => Promise<void>;
  getProductById: (id: number) => Product | undefined;
  updateProduct: (product: Product) => void;
}

export const useProductsStore = create<ProductsStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        products: [],
        isLoading: false,
        error: null,
        lastFetchParams: null,
        totalCount: 0,
        currentPage: 1,
        hasMore: false,

        // Actions
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),

        setProducts: (products, totalCount) => {
          set({
            products,
            totalCount,
            hasMore: products.length < totalCount,
            error: null,
          });
        },

        addProducts: (newProducts) => {
          const { products } = get();
          const existingIds = new Set(products.map((p) => p.id));
          const uniqueNewProducts = newProducts.filter(
            (p) => !existingIds.has(p.id)
          );
          const updatedProducts = [...products, ...uniqueNewProducts];

          set({
            products: updatedProducts,
            hasMore: updatedProducts.length < get().totalCount,
          });
        },

        clearProducts: () => {
          set({
            products: [],
            totalCount: 0,
            currentPage: 1,
            hasMore: false,
            lastFetchParams: null,
            error: null,
          });
        },

        fetchProducts: async (params, append = false) => {
          const {
            setLoading,
            setError,
            setProducts,
            addProducts,
            lastFetchParams,
          } = get();

          // Skip fetch if same params and not appending
          if (
            !append &&
            lastFetchParams &&
            JSON.stringify(lastFetchParams) === JSON.stringify(params)
          ) {
            return;
          }

          try {
            setLoading(true);
            setError(null);

            const response: ProductListResponse =
              await storefrontCatalogService.getProducts(params);

            if (append) {
              addProducts(response.items);
            } else {
              // Handle both possible response structures
              const totalCount =
                response.pagination?.total || response.items.length;
              setProducts(response.items, totalCount);
            }

            set({
              lastFetchParams: params,
              currentPage: params.page || 1,
            });
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Failed to fetch products"
            );
          } finally {
            setLoading(false);
          }
        },

        refreshProducts: async (params) => {
          const { clearProducts, fetchProducts } = get();
          clearProducts();
          await fetchProducts(params);
        },

        getProductById: (id) => {
          const { products } = get();
          return products.find((product) => product.id === id);
        },

        updateProduct: (updatedProduct) => {
          const { products, setProducts, totalCount } = get();
          const updatedProducts = products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          );
          setProducts(updatedProducts, totalCount);
        },
      }),
      {
        name: "products-store",
        partialize: (state) => ({
          products: state.products,
          totalCount: state.totalCount,
          currentPage: state.currentPage,
          lastFetchParams: state.lastFetchParams,
        }),
      }
    ),
    {
      name: "products-store",
    }
  )
);
