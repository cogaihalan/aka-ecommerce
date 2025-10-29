import { Metadata } from "next";
import { storefrontServerOrderService } from "@/lib/api/services/storefront/orders";
import CheckoutSuccessPage from "@/features/storefront/components/checkout/checkout-success-page";
import { notFound } from "next/navigation";

interface CheckoutSuccessPageRouteProps {
  searchParams: Promise<{
    order_id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Order Confirmed - AKA Store",
  description: "Thank you for your purchase! Your order has been confirmed.",
};


export default async function CheckoutSuccessPageRoute({ searchParams }: CheckoutSuccessPageRouteProps) {
  const params = await searchParams;
  const orderId = params.order_id;

  if (!orderId) {
    notFound();
  }

  const order = await storefrontServerOrderService.getOrder(Number(orderId));
  if (!order) {
    notFound();
  }
  return <CheckoutSuccessPage order={order} />;
}
