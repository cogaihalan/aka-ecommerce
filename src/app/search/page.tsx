import { Metadata } from "next";
import SearchPage from "@/features/storefront/components/search-page";

export const metadata: Metadata = {
  title: "Search - AKA Store",
  description: "Search for products across our entire catalog.",
};

export default function SearchPageRoute() {
  return <SearchPage />;
}
