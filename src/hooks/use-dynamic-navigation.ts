"use client";

import { useMemo } from "react";
import {
  useAppLoading,
  useCategories,
} from "@/components/providers/app-provider";
import { FilterGroup, SortOption } from "@/types/navigation";

export function useDynamicNavigation() {
  const { categories } = useCategories();
  const { isLoading } = useAppLoading();

  // Sort options (static for now, could be made dynamic later)
  const sortOptions: SortOption[] = useMemo(
    () => [
      {
        id: "featured",
        label: "Featured",
        value: "featured",
        field: "featured",
        order: "desc",
      },
      {
        id: "price-low",
        label: "Price: Low to High",
        value: "price-low",
        field: "price",
        order: "asc",
      },
      {
        id: "price-high",
        label: "Price: High to Low",
        value: "price-high",
        field: "price",
        order: "desc",
      },
      {
        id: "rating",
        label: "Highest Rated",
        value: "rating",
        field: "rating",
        order: "desc",
      },
      {
        id: "newest",
        label: "Newest First",
        value: "newest",
        field: "createdAt",
        order: "desc",
      },
      {
        id: "name-asc",
        label: "Name: A to Z",
        value: "name-asc",
        field: "name",
        order: "asc",
      },
      {
        id: "name-desc",
        label: "Name: Z to A",
        value: "name-desc",
        field: "name",
        order: "desc",
      },
    ],
    []
  );

  // Dynamic filter groups using categories from context
  const filterGroups: FilterGroup[] = useMemo(() => {
    if (isLoading || !categories.length) {
      // Return default/fallback data while loading
      return [
        {
          id: "price",
          label: "Price Range",
          type: "range",
          options: [],
          min: 0,
          max: 1000,
          step: 10,
        },
        {
          id: "categories",
          label: "Category",
          type: "checkbox",
          options: [
            {
              id: "electronics",
              label: "Electronics",
              value: "electronics",
              count: 0,
            },
            { id: "clothing", label: "Clothing", value: "clothing", count: 0 },
            { id: "home", label: "Home & Garden", value: "home", count: 0 },
            {
              id: "sports",
              label: "Sports & Outdoors",
              value: "sports",
              count: 0,
            },
            { id: "books", label: "Books", value: "books", count: 0 },
            {
              id: "beauty",
              label: "Beauty & Health",
              value: "beauty",
              count: 0,
            },
          ],
        },
        {
          id: "ratings",
          label: "Customer Rating",
          type: "checkbox",
          options: [
            { id: "5", label: "5 Stars", value: "5", count: 0 },
            { id: "4", label: "4 Stars & Up", value: "4", count: 0 },
            { id: "3", label: "3 Stars & Up", value: "3", count: 0 },
            { id: "2", label: "2 Stars & Up", value: "2", count: 0 },
          ],
        },
        {
          id: "availability",
          label: "Availability",
          type: "checkbox",
          options: [
            { id: "in-stock", label: "In Stock", value: "in-stock", count: 0 },
            { id: "on-sale", label: "On Sale", value: "on-sale", count: 0 },
            {
              id: "new-arrival",
              label: "New Arrivals",
              value: "new-arrival",
              count: 0,
            },
          ],
        },
      ];
    }

    // Build dynamic categories from context
    const categoryOptions = categories.map((category) => ({
      id: category.id,
      label: category.name,
      value: category.slug,
      count: category.productCount,
    }));

    return [
      {
        id: "price",
        label: "Price Range",
        type: "range",
        options: [],
        min: 0,
        max: 1000,
        step: 10,
      },
      {
        id: "categories",
        label: "Category",
        type: "checkbox",
        options: categoryOptions,
      },
      {
        id: "ratings",
        label: "Customer Rating",
        type: "checkbox",
        options: [
          { id: "5", label: "5 Stars", value: "5", count: 0 },
          { id: "4", label: "4 Stars & Up", value: "4", count: 0 },
          { id: "3", label: "3 Stars & Up", value: "3", count: 0 },
          { id: "2", label: "2 Stars & Up", value: "2", count: 0 },
        ],
      },
      {
        id: "availability",
        label: "Availability",
        type: "checkbox",
        options: [
          { id: "in-stock", label: "In Stock", value: "in-stock", count: 0 },
          { id: "on-sale", label: "On Sale", value: "on-sale", count: 0 },
          {
            id: "new-arrival",
            label: "New Arrivals",
            value: "new-arrival",
            count: 0,
          },
        ],
      },
    ];
  }, [categories, isLoading]);

  // Default filters
  const defaultFilters = useMemo(
    () => ({
      search: "",
      sort: "featured",
      priceRange: [0, 1000] as [number, number],
      categories: [],
      ratings: [],
      availability: [],
    }),
    []
  );

  return {
    sortOptions,
    filterGroups,
    defaultFilters,
    categories,
    isLoading,
  };
}
