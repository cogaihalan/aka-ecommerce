import { Metadata } from "next";
import CheckoutPage from "@/features/storefront/components/checkout/checkout-page";

export const metadata: Metadata = {
  title: "Checkout - AKA Store",
  description: "Complete your purchase securely with our checkout process.",
};

export default function CheckoutPageRoute() {
  return <CheckoutPage />;
}
