import { Metadata } from "next";
import CartPage from "@/features/storefront/components/cart-page";

export const metadata: Metadata = {
  title: "Giỏ hàng - AKA Store",
  description: "Xem lại các sản phẩm đã chọn và tiến hành thanh toán.",
};

export default function CartPageRoute() {
  return <CartPage />;
}
