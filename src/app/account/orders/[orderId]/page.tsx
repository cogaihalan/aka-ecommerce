import { Metadata } from "next";
import OrderDetailPage from "@/features/storefront/components/account/orders/order-detail-page";
import { storefrontServerOrderService } from "@/lib/api/services/storefront/orders";
import { notFound } from "next/navigation";

interface OrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { orderId } = await params;
  const order = await storefrontServerOrderService.getOrder(Number(orderId));
  return {
    title: `Order #${order.code} - AKA Store`,
    description: "View your order details and tracking information.",
  };
}

export default async function OrderDetailPageRoute({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;
  const order = await storefrontServerOrderService.getOrder(Number(orderId));
  if (!order) {
    notFound();
  }
  return <OrderDetailPage order={order} />;
}
