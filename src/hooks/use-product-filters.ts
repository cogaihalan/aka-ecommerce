"use client";

import { useMemo } from 'react';
import { Product } from '@/types/product';
import { NavigationFilters, FilterCounts } from '@/types/navigation';


export function useProductFilters({ products, filters }: { products: Product[], filters: NavigationFilters }) {
  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange.length > 0) {
      const [minPrice = 0 , maxPrice = 100000000] = filters.priceRange;
      filtered = filtered.filter(product => {
        const price = product.discountPrice || product.price || 0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Category filter
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filtered = filtered.filter(product =>
        product.categories && product.categories.some(category => 
          filters.categoryIds!.includes(category.id.toString())
        )
      );
    }


    return filtered;
  }, [products, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!filters.sort || filters.sort === 'featured') {
      return filteredProducts;
    }

    const sorted = [...filteredProducts];

    switch (filters.sort) {
      case 'price,asc':
        return sorted.sort((a, b) => (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0));
      case 'price,desc':
        return sorted.sort((a, b) => (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0));
      case 'name,asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name,desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }, [filteredProducts, filters.sort]);

  // Calculate filter counts
  const filterCounts = useMemo((): FilterCounts => {
    const counts: FilterCounts = {};

    // Category counts
    const categoryCounts: { [key: string]: number } = {};
    products.forEach(product => {
      if (product.categories) {
        product.categories.forEach(category => {
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
    filteredCount: filteredProducts.length
  };
}
