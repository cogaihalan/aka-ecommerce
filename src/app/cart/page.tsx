import { Metadata } from "next";
import CartPage from "@/features/storefront/components/cart-page";

export const metadata: Metadata = {
  title: "Shopping Cart - AKA Store",
  description: "Review your selected items and proceed to checkout.",
};

export default function CartPageRoute() {
  return <CartPage />;
}
