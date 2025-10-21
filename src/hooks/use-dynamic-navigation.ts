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
        id: "price-asc",
        label: "Price: Low to High",
        value: "price,asc",
        field: "price",
        order: "asc",
      },
      {
        id: "price-desc",
        label: "Price: High to Low",
        value: "price,desc",
        field: "price",
        order: "desc",
      },
      {
        id: "name-asc",
        label: "Name: A to Z",
        value: "name,asc",
        field: "name",
        order: "asc",
      },
      {
        id: "name-desc",
        label: "Name: Z to A",
        value: "name,desc",
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
          max: 100000000,
          step: 1000,
        },
        {
          id: "categoryIds",
          label: "Category",
          type: "checkbox",
          options: [],
        },
      ];
    }

    // Build dynamic categories from context
    const categoryOptions = categories.map((category) => ({
      id: category.id.toString(),
      label: category.name,
      value: category.id.toString(),
    }));

    return [
      {
        id: "price",
        label: "Price Range",
        type: "range",
        options: [],
        min: 0,
        max: 100000000,
        step: 10,
      },
      {
        id: "categoryIds",
        label: "Category",
        type: "checkbox",
        options: categoryOptions,
      },
    ];
  }, [categories, isLoading]);

  // Default filters
  const defaultFilters = useMemo(
    () => ({
      search: "",
      sort: "featured", // Keep "featured" as default option
      priceRange: [0, 100000000] as [number, number],
      categoryIds: [],
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
