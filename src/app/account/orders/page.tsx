import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import OrderHistoryPage from "@/features/storefront/components/account/orders/order-history-page";
import { DashboardPageProps } from "@/types";
import { searchParamsCache } from "@/lib/searchparams";

export const metadata: Metadata = {
  title: "Lịch sử đơn hàng - AKA Store",
  description: "Xem lịch sử đơn hàng và theo dõi đơn hiện tại.",
};

export default async function OrderHistoryPageRoute(props: DashboardPageProps) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/auth/sign-in");
  }

  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams as any);

  return <OrderHistoryPage />;
}
