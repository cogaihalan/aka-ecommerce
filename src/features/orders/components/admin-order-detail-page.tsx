"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  User,
  MapPin,
  X,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Order, OrderHistory } from "@/types";
import { formatCurrency } from "@/lib/format";
import { unifiedOrderService } from "@/lib/api/services/unified";
import { toast } from "sonner";
import PageContainer from "@/components/layout/page-container";
import OrderTimeline from "./order-timeline";

interface AdminOrderDetailPageProps {
  order: Order;
  orderHistories: OrderHistory[];
}

export default function AdminOrderDetailPage({
  order,
  orderHistories,
}: AdminOrderDetailPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Status validation logic
  const canConfirmOrder = order.status === "PENDING";
  const canMarkAsShipping = order.status === "CONFIRMED";
  const canMarkAsDelivered = order.status === "SHIPPING";
  const canRefundOrder = order.status === "DELIVERED";
  const canCancelOrder = ["PENDING", "CONFIRMED", "SHIPPING"].includes(
    order.status
  );

  const getStatusIcon = useCallback((status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "SHIPPING":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "CONFIRMED":
        return <RefreshCw className="h-5 w-5 text-yellow-500" />;
      case "CANCELLED":
      case "REFUNDED":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  }, []);

  const getStatusBadgeVariant = useCallback((status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
      case "PAID":
        return "default";
      case "SHIPPING":
      case "CONFIRMED":
        return "secondary";
      case "CANCELLED":
      case "FAILED":
      case "REFUNDED":
        return "destructive";
      case "PENDING":
      case "UNPAID":
      default:
        return "outline";
    }
  }, []);

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      await unifiedOrderService.confirmOrder(
        order.id,
        "Xác nhận bởi quản trị viên"
      );
      toast.success("Xác nhận đơn hàng thành công");
      router.refresh();
    } catch (error) {
      toast.error("Xác nhận đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleShippingUpdate = async () => {
    setLoading(true);
    try {
      await unifiedOrderService.updateOrderShippingStatus(
        order.id,
        "Đã giao cho đơn vị vận chuyển bởi quản trị viên"
      );
      toast.success("Cập nhật trạng thái: Đang giao hàng");
      router.refresh();
    } catch (error) {
      toast.error("Cập nhật trạng thái giao hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveredUpdate = async () => {
    setLoading(true);
    try {
      await unifiedOrderService.markDeliveredOrder(
        order.id,
        "Đã giao bởi quản trị viên"
      );
      toast.success("Đánh dấu đã giao thành công");
      router.refresh();
    } catch (error) {
      toast.error("Đánh dấu đã giao thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      await unifiedOrderService.cancelOrder(order.id, "Hủy bởi quản trị viên");
      toast.success("Hủy đơn hàng thành công");
      router.refresh();
    } catch (error) {
      toast.error("Hủy đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRefundOrder = async () => {
    setLoading(true);
    try {
      await unifiedOrderService.refundOrder(
        order.id,
        "Hoàn tiền bởi quản trị viên"
      );
      toast.success("Hoàn tiền đơn hàng thành công");
      router.refresh();
    } catch (error) {
      toast.error("Hoàn tiền đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col flex-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-xl font-semibold lg:text-2xl">
                Đơn hàng {order.code}
              </h1>
              <p className="text-muted-foreground">
                Ngày tạo:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <Badge variant={"outline"} className="w-fit">
              {getStatusIcon(order.status)}
              {order.status}
            </Badge>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <span>Hành động</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                      onClick={handleConfirmOrder}
                      disabled={loading || !canConfirmOrder}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Xác nhận đơn hàng
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                      onClick={handleShippingUpdate}
                      disabled={loading || !canMarkAsShipping}
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Đánh dấu là đang giao
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                      onClick={handleDeliveredUpdate}
                      disabled={loading || !canMarkAsDelivered}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Đánh dấu là đã giao
                    </Button>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                      onClick={handleRefundOrder}
                      disabled={loading || !canRefundOrder}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Hoàn tiền đơn hàng
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="destructive"
                      size="sm"
                      onClick={handleCancelOrder}
                      disabled={loading || !canCancelOrder}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Hủy đơn hàng
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 border rounded-lg"
                      >
                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {item.productName || "Sản phẩm"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ID sản phẩm: {item.productId}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="text-sm text-muted-foreground">
                              Số lượng: {item.quantity}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Giá: {formatCurrency(item.priceAtPurchase)}
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="font-bold">
                              Tổng:{" "}
                              {formatCurrency(
                                item.priceAtPurchase * item.quantity
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Không tìm thấy sản phẩm cho đơn hàng này</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Tên</Label>
                    <p className="text-sm">{order.user?.username || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">ID người dùng</Label>
                    <p className="text-sm">{order.user?.id || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">ID nhân viên</Label>
                    <p className="text-sm">{order.user?.clerkId || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Tên người nhận
                    </Label>
                    <p className="text-sm">{order.recipientName || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Thông tin giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div>
                    <Label className="text-sm font-medium">
                      Tên người nhận
                    </Label>
                    <p>{order.recipientName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Số điện thoại người nhận
                    </Label>
                    <p>{order.recipientPhone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Địa chỉ giao hàng
                    </Label>
                    <p>{order.shippingAddress}</p>
                  </div>
                  {order.note && (
                    <div>
                      <Label className="text-sm font-medium">Ghi chú</Label>
                      <p>{order.note}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <OrderTimeline histories={orderHistories} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>
                    {order.shippingFee === 0
                      ? "Miễn phí"
                      : formatCurrency(order.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá</span>
                  <span>{formatCurrency(order.discountAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng</span>
                  <span>{formatCurrency(order.finalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Phương thức</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái</span>
                  <Badge variant={getStatusBadgeVariant(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
