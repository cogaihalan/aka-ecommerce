"use client";

import { useMemo } from "react";
import { Product } from "@/types/product";
import { NavigationFilters, FilterCounts } from "@/types/navigation";

export function useProductFilters({
  products,
  filters,
}: {
  products: Product[];
  filters: NavigationFilters;
}) {
  // Since we're doing server-side filtering, we only need client-side filtering for additional features
  // that aren't handled by the server (like advanced search, additional filters, etc.)
  const filteredProducts = useMemo(() => {
    // For now, return products as-is since server handles most filtering
    // This can be extended for client-side only filters in the future
    return products;
  }, [products]);

  // Since sorting is handled server-side, return filtered products as-is
  const sortedProducts = useMemo(() => {
    return filteredProducts;
  }, [filteredProducts]);

  // Calculate filter counts
  const filterCounts = useMemo((): FilterCounts => {
    const counts: FilterCounts = {};

    // Category counts
    const categoryCounts: { [key: string]: number } = {};
    products.forEach((product) => {
      if (product.categories) {
        product.categories.forEach((category) => {
          const categoryKey = category.id.toString();
          categoryCounts[categoryKey] = (categoryCounts[categoryKey] || 0) + 1;
        });
      }
    });
    counts.categoryIds = categoryCounts;

    return counts;
  }, [products]);

  return {
    filteredProducts: sortedProducts,
    filterCounts,
    totalProducts: products.length,
    filteredCount: filteredProducts.length,
  };
}
