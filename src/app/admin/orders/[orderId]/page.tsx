import { Metadata } from "next";
import { notFound } from "next/navigation";
import { unifiedOrderService } from "@/lib/api/services/unified";
import AdminOrderDetailPage from "@/features/orders/components/admin-order-detail-page";

interface OrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { orderId } = await params;

  try {
    const order = await unifiedOrderService.getOrder(parseInt(orderId));
    return {
      title: `Order ${order.orderNumber} - Admin Dashboard`,
      description: `Manage order ${order.orderNumber} details, status, and fulfillment`,
    };
  } catch (error) {
    return {
      title: `Order #${orderId} - Admin Dashboard`,
      description: "Order details and management",
    };
  }
}

export default async function OrderDetailPageRoute({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;

  try {
    const order = await unifiedOrderService.getOrder(parseInt(orderId));
    return <AdminOrderDetailPage order={order} />;
  } catch (error) {
    notFound();
  }
}
