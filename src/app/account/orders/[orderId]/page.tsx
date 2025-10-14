import { Metadata } from "next";
import OrderDetailPage from "@/features/storefront/components/account/orders/order-detail-page";

interface OrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order #${orderId} - AKA Store`,
    description: "View your order details and tracking information.",
  };
}

export default async function OrderDetailPageRoute({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;
  return <OrderDetailPage orderId={orderId} />;
}
