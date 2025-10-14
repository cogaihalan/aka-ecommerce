import { Metadata } from "next";
import OrderHistoryPage from "@/features/storefront/components/account/orders/order-history-page";

export const metadata: Metadata = {
  title: "Order History - AKA Store",
  description: "View your order history and track current orders.",
};

export default function OrderHistoryPageRoute() {
  return <OrderHistoryPage />;
}
