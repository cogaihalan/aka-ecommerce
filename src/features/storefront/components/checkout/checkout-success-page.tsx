"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { CheckCircle, Package, Truck, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Get order ID from URL params
    const orderId = searchParams.get("order_id");
    if (orderId) {
      // In a real app, you would fetch order data from API
      // For now, we'll use the order ID from URL and simulate other data
      setOrderData({
        orderNumber: orderId,
        total: 1250000, // This would come from the actual order data
        paymentMethod: "Chuyển khoản ngân hàng", // This would come from the actual order
        shippingMethod: "Giao hàng tiêu chuẩn", // This would come from the actual order
        status: "confirmed",
        estimatedDelivery: "3-5 business days",
      });
    }
  }, [searchParams]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">Đặt hàng thành công!</h1>
          <p className="text-muted-foreground">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
          </p>
        </div>

        {orderData && (
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Mã đơn hàng: {orderData.orderNumber}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Chi tiết đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderData ? (
              <>
                <div className="flex justify-between">
                  <span>Mã đơn hàng:</span>
                  <span className="font-mono">{orderData.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng tiền:</span>
                  <Price price={orderData.total} size="base" weight="bold" />
                </div>
                <div className="flex justify-between">
                  <span>Phương thức thanh toán:</span>
                  <span>{orderData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phương thức vận chuyển:</span>
                  <span>{orderData.shippingMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <Badge variant="default">Đã xác nhận</Badge>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  Đang tải thông tin đơn hàng...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Bước tiếp theo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Xác nhận đơn hàng</p>
                  <p className="text-sm text-muted-foreground">
                    Chúng tôi sẽ gửi email xác nhận trong vài phút tới
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-orange-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Xử lý đơn hàng</p>
                  <p className="text-sm text-muted-foreground">
                    Đơn hàng sẽ được chuẩn bị và đóng gói
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-green-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Giao hàng</p>
                  <p className="text-sm text-muted-foreground">
                    Dự kiến giao hàng trong{" "}
                    {orderData?.estimatedDelivery || "3-5 ngày làm việc"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin liên hệ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email hỗ trợ</p>
                <p className="text-sm text-muted-foreground">
                  support@akastore.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Hotline</p>
                <p className="text-sm text-muted-foreground">1900 1234</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/account/orders">Xem đơn hàng của tôi</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/products">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    </div>
  );
}
