"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { NavigationState, NavigationFilters } from "@/types/navigation";
import { DEFAULT_FILTERS } from "@/constants/navigation";

interface UseNavigationOptions {
  defaultFilters?: Partial<NavigationFilters>;
  defaultPage?: number;
  defaultLimit?: number;
}

export function useNavigation(options: UseNavigationOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { defaultFilters = {}, defaultPage = 0, defaultLimit = 12 } = options;

  // Parse URL parameters
  const parseUrlParams = useCallback((): NavigationState => {
    const filters: NavigationFilters = {
      ...DEFAULT_FILTERS,
      ...defaultFilters,
    };

    // Parse search
    const search = searchParams.get("search") || "";
    if (search) filters.search = search;

    // Parse sort
    const sort = searchParams.get("sort") || "";
    filters.sort = sort;

    // Parse price range
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice && maxPrice) {
      filters.priceRange = [parseInt(minPrice), parseInt(maxPrice)];
    }

    // Parse categoryIds as comma-separated string
    const categoryIdsParam = searchParams.get("categoryIds");
    if (categoryIdsParam) {
      filters.categoryIds = categoryIdsParam.split(",").map(id => id.trim()).filter(id => id);
    }

    // Parse pagination
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(
      searchParams.get("limit") || defaultLimit.toString()
    );

    return {
      filters,
      page,
      limit,
    };
  }, [searchParams, defaultFilters, defaultLimit]);

  const [state, setState] = useState<NavigationState>(parseUrlParams);

  // Update URL when state changes
  const updateUrl = useCallback(
    (newState: NavigationState) => {
      const params = new URLSearchParams();

      // Add search
      if (newState.filters.search) {
        params.set("search", newState.filters.search);
      }

      // Add sort
      if (newState.filters.sort && newState.filters.sort !== "featured") {
        params.set("sort", newState.filters.sort);
      }

      // Add price range
      if (
        newState.filters.priceRange &&
        (newState.filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
          newState.filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1])
      ) {
        params.set("minPrice", newState.filters.priceRange[0].toString());
        params.set("maxPrice", newState.filters.priceRange[1].toString());
      }

      // Add categoryIds as comma-separated string
      if (newState.filters.categoryIds && newState.filters.categoryIds.length > 0) {
        params.set("categoryIds", newState.filters.categoryIds.join(","));
      }

      // View mode is handled separately in the component layer

      // Add pagination
      if (newState.page > 1) {
        params.set("page", newState.page.toString());
      }
      if (newState.limit !== defaultLimit) {
        params.set("limit", newState.limit.toString());
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl, { scroll: false });
    },
    [router, pathname, defaultLimit]
  );

  // Update filters with debouncing to prevent excessive re-renders
  const updateFilters = useCallback(
    (newFilters: Partial<NavigationFilters>) => {
      setState((prevState) => {
        // Only update if filters actually changed
        const hasChanges = Object.keys(newFilters).some((key) => {
          const newValue = newFilters[key];
          const oldValue = prevState.filters[key];

          if (Array.isArray(newValue) && Array.isArray(oldValue)) {
            return (
              newValue.length !== oldValue.length ||
              !newValue.every((val, index) => val === oldValue[index])
            );
          }

          return newValue !== oldValue;
        });

        if (!hasChanges) {
          return prevState;
        }

        const updatedState = {
          ...prevState,
          filters: {
            ...prevState.filters,
            ...newFilters,
          },
          page: defaultPage, // Reset to first page when filters change
        };
        updateUrl(updatedState);
        return updatedState;
      });
    },
    [updateUrl]
  );

  // View mode is handled in the component layer, not in navigation state

  // Update page
  const updatePage = useCallback(
    (page: number) => {
      setState((prevState) => {
        const updatedState = { ...prevState, page };
        updateUrl(updatedState);
        return updatedState;
      });
    },
    [updateUrl]
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    setState((prevState) => {
      const updatedState = {
        ...prevState,
        filters: { ...DEFAULT_FILTERS, ...defaultFilters },
        page: defaultPage,
      };
      updateUrl(updatedState);
      return updatedState;
    });
  }, [updateUrl, defaultFilters, defaultPage]);

  // Get active filters count
  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    const filters = state.filters;

    if (filters.search) count++;
    if (filters.sort && filters.sort !== "featured") count++;
    if (
      filters.priceRange &&
      (filters.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] ||
        filters.priceRange[1] !== DEFAULT_FILTERS.priceRange[1])
    )
      count++;

    const categoryIds = filters.categoryIds || [];
    if (categoryIds && categoryIds.length > 0) count += categoryIds.length;

    return count;
  }, [state.filters]);

  // Sync with URL changes - only when searchParams actually change
  useEffect(() => {
    const newState = parseUrlParams();
    setState((prevState) => {
      // Deep comparison to prevent unnecessary updates
      const filtersChanged =
        JSON.stringify(prevState.filters) !== JSON.stringify(newState.filters);
      const pageChanged = prevState.page !== newState.page;
      const limitChanged = prevState.limit !== newState.limit;

      if (filtersChanged || pageChanged || limitChanged) {
        return newState;
      }
      return prevState;
    });
  }, [searchParams]);

  return {
    state,
    updateFilters,
    updatePage,
    resetFilters,
    getActiveFiltersCount
  };
}
