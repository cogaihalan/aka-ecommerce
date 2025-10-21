"use client";

import {
  useState,
  useEffect,
  useMemo,
  useTransition,
  useDeferredValue,
} from "react";
import { useRouter } from "next/navigation";
import {
  ProductImageGallery,
  ProductInfo,
  ProductTabs,
} from "@/components/product";
import { storefrontCatalogService } from "@/lib/api/services/storefront/catalog";
import { Product, ProductImage } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductDetailPageProps {
  productId: string;
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<{
    product: Product | null;
    relatedProducts: Product[];
    loading: boolean;
    error: string | null;
  }>({
    product: null,
    relatedProducts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true, error: null }));

        const [productData] = await Promise.all([
          storefrontCatalogService.getProduct(parseInt(productId)),
        ]);

        if (!productData) {
          // Redirect to 404 page when product is not found
          router.replace("/not-found");
          return;
        }

        // Use startTransition for non-urgent state updates to prevent blocking
        startTransition(() => {
          setData({
            product: productData,
            relatedProducts: [],
            loading: false,
            error: null,
          });
        });
      } catch (err) {
        setData((prev) => ({
          ...prev,
          error: "Failed to load product data",
          loading: false,
        }));
        console.error("Error fetching product:", err);
      }
    };

    fetchProductData();
  }, [productId]);

  // Use deferred value to smooth out rendering
  const deferredProduct = useDeferredValue(data.product);

  // Memoize the enhanced product to prevent unnecessary re-renders
  const enhancedProduct = useMemo(() => {
    if (!deferredProduct) return null;

    return {
      ...deferredProduct,
      inStock: deferredProduct.stock > 0,
      stockCount: deferredProduct.stock,
    };
  }, [deferredProduct]);

  if (data.loading) {
    return <ProductDetailSkeleton />;
  }

  // If there's an error or no product, redirect to 404
  if (data.error || !data.product) {
    router.replace("/not-found");
    return null;
  }

  return (
    <div className="relative">
      {/* Loading indicator during transitions */}
      {isPending && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-sm border">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>
      )}

      <div
        className={cn(
          "space-y-12 transition-opacity duration-200",
          isPending ? "opacity-90" : "opacity-100"
        )}
      >
        {/* Main Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <ProductImageGallery
            images={
              deferredProduct?.images.map((image: ProductImage) => ({
                ...image,
                alt: deferredProduct?.name || "",
              })) || []
            }
          />

          {/* Product Info */}
          {enhancedProduct && <ProductInfo product={enhancedProduct} />}
        </div>

        {/* Product Tabs */}
        {enhancedProduct && <ProductTabs product={enhancedProduct} />}
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Main Product Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg bg-muted/50" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-square rounded-md bg-muted/50"
              />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-20 bg-muted/50" />
            <Skeleton className="h-8 w-3/4 bg-muted/50" />
            <Skeleton className="h-4 w-32 bg-muted/50" />
            <Skeleton className="h-6 w-24 bg-muted/50" />
            <Skeleton className="h-4 w-full bg-muted/50" />
            <Skeleton className="h-4 w-2/3 bg-muted/50" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-10 w-full bg-muted/50" />
            <Skeleton className="h-10 w-full bg-muted/50" />
            <Skeleton className="h-10 w-full bg-muted/50" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-12 w-full bg-muted/50" />
            <Skeleton className="h-12 w-full bg-muted/50" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-24 bg-muted/50" />
          <Skeleton className="h-10 w-32 bg-muted/50" />
          <Skeleton className="h-10 w-20 bg-muted/50" />
          <Skeleton className="h-10 w-28 bg-muted/50" />
        </div>
        <Skeleton className="h-64 w-full bg-muted/50" />
      </div>

      {/* Related Products Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-muted/50" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square rounded-lg bg-muted/50" />
              <Skeleton className="h-4 w-3/4 bg-muted/50" />
              <Skeleton className="h-4 w-1/2 bg-muted/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
