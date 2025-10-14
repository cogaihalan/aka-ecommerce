import { Metadata } from "next";
import CategoryListingPage from "@/features/storefront/components/category-listing-page";

export const metadata: Metadata = {
  title: "Categories - AKA Store",
  description:
    "Explore our product categories. Find products organized by type and style.",
};

export default function CategoriesPage() {
  return <CategoryListingPage />;
}
