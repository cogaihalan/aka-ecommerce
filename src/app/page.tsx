import { Metadata } from "next";
import StorefrontHomePage from "@/features/storefront/components/home-page";

export const metadata: Metadata = {
  title: "AKA Store - Premium Ecommerce",
  description:
    "Discover premium products at AKA Store. Quality, style, and innovation in every purchase.",
};

export default function HomePage() {
  return <StorefrontHomePage />;
}
