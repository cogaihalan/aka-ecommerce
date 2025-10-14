"use client";

import { useMemo } from 'react';
import { Product } from '@/types/product';
import { NavigationFilters, FilterCounts } from '@/types/navigation';

// Extended Product interface for additional filtering properties
interface ExtendedProduct extends Product {
  rating?: number;
  inStock?: boolean;
  color?: string;
  sizes?: string[];
}

interface UseProductFiltersOptions {
  products: ExtendedProduct[];
  filters: NavigationFilters;
}

export function useProductFilters({ products, filters }: UseProductFiltersOptions) {
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
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      filtered = filtered.filter(product => {
        const price = product.pricing?.basePrice || 0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        product.primaryCategory && filters.categories!.includes(product.primaryCategory.slug.toLowerCase())
      );
    }




    // Rating filter
    if (filters.ratings && filters.ratings.length > 0) {
      filtered = filtered.filter(product => {
        const rating = product.rating || 0;
        return filters.ratings!.some(filterRating => rating >= Number(filterRating));
      });
    }

    // Availability filter
    if (filters.availability && filters.availability.length > 0) {
      filtered = filtered.filter(product => {
        if (filters.availability!.includes('in-stock')) {
          return product.inStock;
        }
        if (filters.availability!.includes('on-sale')) {
          return product.pricing?.compareAtPrice && product.pricing.compareAtPrice > (product.pricing?.basePrice || 0);
        }
        if (filters.availability!.includes('new-arrival')) {
          const createdAt = product.createdAt;
          if (createdAt) {
            const daysSinceCreated = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceCreated <= 30; // New arrivals within 30 days
          }
        }
        return true;
      });
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
      case 'price-low':
        return sorted.sort((a, b) => (a.pricing?.basePrice || 0) - (b.pricing?.basePrice || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.pricing?.basePrice || 0) - (a.pricing?.basePrice || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return sorted.sort((a, b) => {
          const aDate = new Date(a.createdAt || 0);
          const bDate = new Date(b.createdAt || 0);
          return bDate.getTime() - aDate.getTime();
        });
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
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
      if (product.primaryCategory) {
        const category = product.primaryCategory.slug.toLowerCase();
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
    counts.category = categoryCounts;




    // Rating counts
    const ratingCounts: { [key: string]: number } = {};
    products.forEach(product => {
      const rating = Math.floor(product.rating || 0);
      if (rating >= 2) {
        ratingCounts[rating.toString()] = (ratingCounts[rating.toString()] || 0) + 1;
      }
    });
    counts.rating = ratingCounts;

    // Availability counts
    const availabilityCounts: { [key: string]: number } = {};
    let inStockCount = 0;
    let onSaleCount = 0;
    let newArrivalCount = 0;

    products.forEach(product => {
      if (product.inStock) inStockCount++;
      if (product.pricing?.compareAtPrice && product.pricing.compareAtPrice > (product.pricing?.basePrice || 0)) onSaleCount++;
      
      const createdAt = product.createdAt;
      if (createdAt) {
        const daysSinceCreated = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreated <= 30) newArrivalCount++;
      }
    });

    availabilityCounts['in-stock'] = inStockCount;
    availabilityCounts['on-sale'] = onSaleCount;
    availabilityCounts['new-arrival'] = newArrivalCount;
    counts.availability = availabilityCounts;

    return counts;
  }, [products]);

  return {
    filteredProducts: sortedProducts,
    filterCounts,
    totalProducts: products.length,
    filteredCount: filteredProducts.length
  };
}
