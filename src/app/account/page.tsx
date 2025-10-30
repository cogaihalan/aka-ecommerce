import { Metadata } from "next";
import AccountDashboard from "@/features/storefront/components/account/account-dashboard";
import { storefrontServerOrderService } from "@/lib/api/services/storefront/orders";

export const metadata: Metadata = {
  title: "Bảng điều khiển tài khoản - AKA Store",
  description: "Tổng quan tài khoản và hoạt động gần đây của bạn.",
};

export default async function AccountPage() {

  const orders = await storefrontServerOrderService.getOrders({
    page: 1,
    size: 5,
    sort: ["createdAt,desc"],
  });

  return <AccountDashboard orders={orders.items} />;
}
