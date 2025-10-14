import { Metadata } from "next";
import WishlistPage from "@/features/storefront/components/account/wishlist-page";

export const metadata: Metadata = {
  title: "Wishlist - AKA Store",
  description: "Your saved items and favorites.",
};

export default function WishlistPageRoute() {
  return <WishlistPage />;
}
