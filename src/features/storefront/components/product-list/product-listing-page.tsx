// Updated storefront product listing page with layered navigation
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await storefrontCatalogService.getProducts({
        page: state.page,
        size: state.limit,
        name: state.filters.search || undefined,
        sort: state.filters.sort ? [state.filters.sort] : [],
        categoryIds: state.filters.categoryIds,
        minPrice: state.filters.priceRange?.[0],
        maxPrice: state.filters.priceRange?.[1],
      });

      setProducts(response.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  }, [state.page, state.limit, state.filters]);

  // Use product filters hook for client-side filtering
  const { filteredProducts, filterCounts, totalProducts, filteredCount } =
    useProductFilters({
      products: products,
      filters: state.filters,
    });

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [state.filters, state.page, fetchProducts]);

  // Load initial products
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Determine which products to display
  const displayProducts = products;
  const displayCount = products.length;
  const displayTotal = products.length;

  // Pagination logic
  const itemsPerPage = state.limit;
  const totalPages = Math.ceil(displayCount / itemsPerPage);
  const startIndex = (state.page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = displayProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    updatePage(page);
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of premium products
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
          <Button onClick={fetchProducts}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">
          Discover our complete collection of premium products
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
          <LoadingOverlay isLoading={isLoading && products.length > 0}>
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

          {/* Loading indicator for pagination */}
          {isLoading && products.length > 0 && (
            <div className="flex justify-center mt-6 animate-fade-in">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading more products...</span>
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
                  No products found matching your criteria
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                  {state.filters.search && (
                    <Button
                      variant="outline"
                      onClick={() => updateFilters({ search: "" })}
                    >
                      Clear search
                    </Button>
                  )}
                  {getActiveFiltersCount() > 0 && (
                    <Button variant="outline" onClick={resetFilters}>
                      Clear all filters
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
