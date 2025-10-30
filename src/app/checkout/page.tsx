import { Metadata } from "next";
import CheckoutPage from "@/features/storefront/components/checkout/checkout-page";

export const metadata: Metadata = {
  title: "Thanh toán - AKA Store",
  description: "Hoàn tất mua hàng một cách an toàn với quy trình thanh toán của chúng tôi.",
};

export default function CheckoutPageRoute() {
  return <CheckoutPage />;
}
