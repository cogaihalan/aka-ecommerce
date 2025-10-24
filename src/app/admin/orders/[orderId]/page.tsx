import { Metadata } from "next";
import { notFound } from "next/navigation";
import { serverUnifiedOrderService } from "@/lib/api/services/server";
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
    const order = await serverUnifiedOrderService.getOrder(parseInt(orderId));
    return {
      title: `Order ${order.code} - Admin Dashboard`,
      description: `Manage order ${order.code} details, status, and fulfillment`,
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
    const [order, orderHistories] = await Promise.all([
      serverUnifiedOrderService.getOrder(parseInt(orderId)),
      serverUnifiedOrderService.getOrderHistories(parseInt(orderId))
    ]);

    return <AdminOrderDetailPage order={order} orderHistories={orderHistories.items || []} />;
  } catch (error) {
    console.log(error);
    notFound();
  }
}
