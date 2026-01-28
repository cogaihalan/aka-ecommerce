"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { storefrontCatalogService } from "@/lib/api/services/storefront/catalog";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/product-card";
import { ProductCardSkeleton } from "@/components/product/product-card-skeleton";
import {
  NavigationSidebar,
  SortControls,
  MobileNavigation,
} from "@/components/navigation";
import { useNavigation } from "@/hooks/use-navigation";
import { useProductFilters } from "@/hooks/use-product-filters";
import {
  AnimatedGrid,
  LoadingOverlay,
} from "@/components/ui/animated-container";

export default function ProductListingPage() {
  const {
    state,
    updateFilters,
    updatePage,
    resetFilters,
    getActiveFiltersCount,
  } = useNavigation();

  // View mode is handled separately from navigation state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Ref to track if we're currently fetching to prevent duplicate requests
  const fetchingRef = useRef<boolean>(false);

  // Memoize the query parameters to prevent unnecessary re-fetches
  const queryParams = useMemo(
    () => ({
      page: state.page,
      size: state.limit,
      name: state.filters.search || undefined,
      sort:
        state.filters.sort && state.filters.sort !== "featured"
          ? [state.filters.sort]
          : [],
      categoryIds: state.filters.categoryIds,
      minPrice: state.filters.priceRange?.[0],
      maxPrice: state.filters.priceRange?.[1],
    }),
    [
      state.page,
      state.limit,
      state.filters.search,
      state.filters.sort,
      state.filters.categoryIds,
      state.filters.priceRange,
    ],
  );

  // Fetch products with proper loading state management
  const fetchProducts = useCallback(
    async (showLoading = true) => {
      // Prevent duplicate requests
      if (fetchingRef.current) return;

      try {
        fetchingRef.current = true;
        if (showLoading) {
          setIsLoading(true);
        }
        setError(null);

        const response =
          await storefrontCatalogService.getProducts(queryParams);
        setProducts(response.items || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
      } finally {
        setIsLoading(false);
        fetchingRef.current = false;
        setIsInitialLoad(false);
      }
    },
    [queryParams],
  );

  // Use product filters hook for client-side filtering (only for search and additional client-side filters)
  const { filterCounts } = useProductFilters({
    products: products,
    filters: state.filters,
  });

  // Single effect to handle data fetching
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Determine which products to display - use server-filtered products directly
  const displayProducts = products;
  const displayCount = products.length;
  const displayTotal = products.length;

  // Since we're using server-side pagination, we don't need client-side pagination
  const paginatedProducts = displayProducts;
  // For now, we'll use a reasonable total pages estimate
  // In a real implementation, you'd get this from the API response
  const totalPages = Math.max(1, Math.ceil(displayTotal / state.limit));

  const handlePageChange = (page: number) => {
    updatePage(page);
  };

  // Show loading skeleton only on initial load
  if (isInitialLoad && isLoading) {
    return (
      <div className="space-y-6 py-8 lg:py-16">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Tất cả sản phẩm</h1>
          <p className="text-muted-foreground">
            Khám phá bộ sưu tập đầy đủ của chúng tôi
          </p>
        </div>

        {/* Loading skeleton grid */}
        <div className="flex gap-6">
          <div className="hidden lg:block w-80">
            <div className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-32 bg-muted animate-pulse rounded" />
              <div className="h-24 bg-muted animate-pulse rounded" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 bg-muted animate-pulse rounded w-32" />
              <div className="h-10 bg-muted animate-pulse rounded w-24" />
            </div>

            <AnimatedGrid
              className={`grid gap-6 items-stretch ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 lg:grid-cols-2"
              }`}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductCardSkeleton
                  key={index}
                  variant={viewMode === "list" ? "compact" : "default"}
                />
              ))}
            </AnimatedGrid>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => fetchProducts()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8 lg:py-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Tất cả sản phẩm</h1>
        <p className="text-muted-foreground">
          Khám phá bộ sưu tập đầy đủ của chúng tôi
        </p>
      </div>

      {/* Sort Controls */}
      <div className="flex items-end lg:items-center justify-between gap-2">
        <SortControls
          sortBy={state.filters.sort || "featured"}
          viewMode={viewMode}
          onSortChange={(sort) => updateFilters({ sort })}
          onViewModeChange={setViewMode}
          totalProducts={displayTotal}
          filteredCount={displayCount}
          currentPageCount={paginatedProducts.length}
          currentPage={state.page}
        />
        {/* Mobile Navigation */}
        <MobileNavigation
          filters={state.filters}
          onFiltersChange={updateFilters}
          onResetFilters={resetFilters}
          filterCounts={filterCounts}
          activeFiltersCount={getActiveFiltersCount()}
        />
      </div>

      {/* Main Content Layout */}
      <div className="flex gap-6 pb-8 lg:pb-16">
        {/* Navigation Sidebar */}
        <NavigationSidebar
          filters={state.filters}
          onFiltersChange={updateFilters}
          onResetFilters={resetFilters}
          filterCounts={filterCounts}
          activeFiltersCount={getActiveFiltersCount()}
          isMobile={false}
        />

        {/* Products Grid - 3 columns */}
        <div className="flex-1">
          <LoadingOverlay isLoading={isLoading && !isInitialLoad}>
            <AnimatedGrid
              className={`grid gap-6 layout-transition items-stretch ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 lg:grid-cols-2"
              }`}
            >
              {paginatedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard
                    product={product}
                    variant={viewMode === "list" ? "compact" : "default"}
                  />
                </div>
              ))}
            </AnimatedGrid>
          </LoadingOverlay>

          {/* Loading indicator for filter changes */}
          {isLoading && !isInitialLoad && (
            <div className="flex justify-center mt-6 animate-fade-in">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">Cập nhật sản phẩm...</span>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(state.page - 1)}
                      className={
                        state.page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (state.page <= 3) {
                      pageNumber = i + 1;
                    } else if (state.page >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = state.page - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNumber)}
                          isActive={state.page === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(state.page + 1)}
                      className={
                        state.page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Show skeleton cards when no products and no filters applied */}
          {!isLoading &&
            displayProducts.length === 0 &&
            !(state.filters.search || getActiveFiltersCount() > 0) && (
              <AnimatedGrid
                className={`grid gap-6 items-stretch ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 lg:grid-cols-2"
                }`}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductCardSkeleton
                    key={index}
                    className="pt-0"
                    variant={viewMode === "list" ? "compact" : "default"}
                  />
                ))}
              </AnimatedGrid>
            )}

          {/* No products message - only show when filters/search are applied */}
          {!isLoading &&
            displayProducts.length === 0 &&
            (state.filters.search || getActiveFiltersCount() > 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Không tìm thấy sản phẩm phù hợp với tiêu chí của bạn
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                  {state.filters.search && (
                    <Button
                      variant="outline"
                      onClick={() => updateFilters({ search: "" })}
                    >
                      Xóa tìm kiếm
                    </Button>
                  )}
                  {getActiveFiltersCount() > 0 && (
                    <Button variant="outline" onClick={resetFilters}>
                      Xóa tất cả bộ lọc
                    </Button>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
