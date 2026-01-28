import { Metadata } from "next";
import CategoryListingPage from "@/features/storefront/components/category-listing-page";
import HeroBanner from "@/components/ui/hero-banner";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Danh mục - AKA Store",
  description:
    "Khám phá các danh mục sản phẩm. Tìm sản phẩm theo loại và phong cách.",
};

export default function CategoriesPage() {
  return (
  <>  
    <HeroBanner
      title="Danh mục"
      description="Khám phá các danh mục sản phẩm"
      imageUrl="/assets/placeholder-banner.png"
      verticalPos="center"
      horizontalPos="center"
      overlayOpacity={30}
    />
    <Suspense fallback={null}>
      <CategoryListingPage />
    </Suspense>
  </>
  )
}
