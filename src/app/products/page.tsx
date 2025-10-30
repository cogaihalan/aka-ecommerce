import { Metadata } from "next";
import { Suspense } from "react";
import ProductListingPage from "@/features/storefront/components/product-list/product-listing-page";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm - AKA Store",
  description:
    "Khám phá toàn bộ bộ sưu tập sản phẩm cao cấp của chúng tôi. Tìm đúng thứ bạn cần.",
};

function ProductsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Tất cả sản phẩm</h1>
        <p className="text-muted-foreground">Khám phá bộ sưu tập sản phẩm cao cấp</p>
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
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-96 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductListingPage />
    </Suspense>
  );
}
