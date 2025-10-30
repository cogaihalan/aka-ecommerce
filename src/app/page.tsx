import { Metadata } from "next";
import StorefrontHomePage from "@/features/storefront/components/home-page";

export const metadata: Metadata = {
  title: "AKA Store - Mua sắm cao cấp",
  description:
    "Khám phá sản phẩm cao cấp tại AKA Store. Chất lượng, phong cách và đổi mới trong từng lần mua.",
};

export default function HomePage() {
  return <StorefrontHomePage />;
}
