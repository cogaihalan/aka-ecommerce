import { Metadata } from "next";
import WishlistPage from "@/features/storefront/components/account/wishlist-page";

export const metadata: Metadata = {
  title: "Yêu thích - AKA Store",
  description: "Những sản phẩm đã lưu và mục yêu thích của bạn.",
};

export default function WishlistPageRoute() {
  return <WishlistPage />;
}
