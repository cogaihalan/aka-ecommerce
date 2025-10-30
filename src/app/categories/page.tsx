import { Metadata } from "next";
import CategoryListingPage from "@/features/storefront/components/category-listing-page";

export const metadata: Metadata = {
  title: "Danh mục - AKA Store",
  description:
    "Khám phá các danh mục sản phẩm. Tìm sản phẩm theo loại và phong cách.",
};

export default function CategoriesPage() {
  return <CategoryListingPage />;
}
