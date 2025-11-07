"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle, Clock, ArrowLeft, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Order, OrderStatus } from "@/types/order";
import Link from "next/link";
import { storefrontOrderService } from "@/lib/api/services/storefront/orders-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getStatusBadgeVariant, getStatusText } from "@/lib/utils";

interface OrderDetailPageProps {
  order: Order;
}

export default function OrderDetailPage({ order }: OrderDetailPageProps) {
  const router = useRouter();

  const handleCancelOrder = async () => {
    try {
      await storefrontOrderService.cancelOrder(order.id);
      toast.success("Hủy đơn hàng thành công");
      router.refresh();
    } catch (error) {
      toast.error("Hủy đơn hàng thất bại");
    }
  };

  const canCancelOrder = () => {
    return (
      order.status !== "CANCELLED" &&
      order.status !== "DELIVERED" &&
      order.status !== "REFUNDED"
    );
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "SHIPPING":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "PENDING":
      case "CONFIRMED":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "CANCELLED":
      case "REFUNDED":
        return <Package className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Link href="/account/orders">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại lịch sử đơn hàng
          </Button>
        </Link>

        {canCancelOrder() && (
          <Button
            variant="destructive"
            onClick={handleCancelOrder}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Hủy đơn hàng
          </Button>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{`Đơn hàng #${order.code}`}</h1>
        <p className="text-muted-foreground">
          Đặt ngày{" "}
          {order.createdAt
            ? new Date(order.createdAt).toLocaleDateString()
            : "Không rõ ngày"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm trong đơn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <Package className="h-10 w-10 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Số lượng: {item.quantity}
                    </p>
                    <p className="font-bold">
                      {formatPrice(item.priceAtPurchase)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Địa chỉ giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="font-medium">{order.recipientName}</p>
                <p className="text-muted-foreground">{order.recipientPhone}</p>
                <p>{order.shippingAddress}</p>
                {order.note && (
                  <div className="mt-2 p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Ghi chú:</p>
                    <p className="text-sm">{order.note}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Thanh toán:{" "}
                  <span className="font-medium">{order.paymentStatus}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Phương thức:{" "}
                  <span className="font-medium">{order.paymentMethod}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Tổng quan đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatPrice(order.subtotalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vận chuyển</span>
                <span>
                  {order.shippingFee === 0
                    ? "Miễn phí"
                    : formatPrice(order.shippingFee)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng</span>
                <span>{formatPrice(order.finalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
