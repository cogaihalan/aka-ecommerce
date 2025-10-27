"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { CheckCircle, Package, Mail, Phone, Loader2 } from "lucide-react";
import Link from "next/link";
import { storefrontOrderService } from "@/lib/api/services/storefront/orders-client";
import { Order } from "@/types";

interface OrderDataState {
  data: Order | null;
  isLoading: boolean;
  error: string | null;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [orderState, setOrderState] = useState<OrderDataState>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = searchParams.get("order_id");

      if (!orderId) {
        setOrderState({
          data: null,
          isLoading: false,
          error: "Không tìm thấy mã đơn hàng",
        });
        return;
      }

      try {
        setOrderState((prev) => ({ ...prev, isLoading: true, error: null }));
        const order = await storefrontOrderService.getOrder(+orderId);

        if (order) {
          setOrderState({
            data: order,
            isLoading: false,
            error: null,
          });
        } else {
          setOrderState({
            data: null,
            isLoading: false,
            error: "Không tìm thấy thông tin đơn hàng",
          });
        }
      } catch (error) {
        setOrderState({
          data: null,
          isLoading: false,
          error: "Có lỗi xảy ra khi tải thông tin đơn hàng",
        });
      }
    };

    fetchOrder();
  }, [searchParams]);

  const { data: orderData, isLoading, error } = orderState;

  return (
    <div className="max-w-4xl mx-auto py-8 lg:py-16 space-y-6">
      {/* Success Header */}
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
            Mã đơn hàng: {orderData.code}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Chi tiết đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Đang tải thông tin đơn hàng...</span>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-red-500">{error}</p>
              </div>
            ) : orderData ? (
              <>
                <OrderDetailRow label="Mã đơn hàng" value={orderData.code} />
                <OrderDetailRow
                  label="Tổng tiền"
                  value={
                    <Price
                      price={orderData.finalAmount}
                      size="base"
                      weight="semibold"
                    />
                  }
                />
                <OrderDetailRow
                  label="Phương thức thanh toán"
                  value={orderData.paymentMethod}
                />
                <OrderDetailRow
                  label="Địa chỉ giao hàng"
                  value={orderData.shippingAddress}
                />
                <OrderDetailRow
                  label="Trạng thái"
                  value={<Badge variant="default">Đã xác nhận</Badge>}
                />
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  Không có thông tin đơn hàng
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps Card */}
        <Card>
          <CardHeader>
            <CardTitle>Bước tiếp theo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <StepItem
                step={1}
                title="Xác nhận đơn hàng"
                description="Chúng tôi sẽ gửi email xác nhận trong vài phút tới"
                color="blue"
              />
              <StepItem
                step={2}
                title="Xử lý đơn hàng"
                description="Đơn hàng sẽ được chuẩn bị và đóng gói"
                color="orange"
              />
              <StepItem
                step={3}
                title="Giao hàng"
                description="Dự kiến giao hàng trong 3-5 ngày làm việc"
                color="green"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin liên hệ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContactItem
              icon={<Mail className="h-5 w-5 text-muted-foreground" />}
              title="Email hỗ trợ"
              value="support@akastore.com"
            />
            <ContactItem
              icon={<Phone className="h-5 w-5 text-muted-foreground" />}
              title="Hotline"
              value="1900 1234"
            />
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

// Helper Components
interface OrderDetailRowProps {
  label: string;
  value: React.ReactNode;
}

function OrderDetailRow({ label, value }: OrderDetailRowProps) {
  return (
    <div className="flex justify-between">
      <span>{label}:</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

interface StepItemProps {
  step: number;
  title: string;
  description: string;
  color: "blue" | "orange" | "green";
}

function StepItem({ step, title, description, color }: StepItemProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}
      >
        <span className="text-sm font-medium">{step}</span>
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function ContactItem({ icon, title, value }: ContactItemProps) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
