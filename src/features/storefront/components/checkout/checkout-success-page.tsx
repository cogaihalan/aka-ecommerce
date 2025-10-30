"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { CheckCircle, Package, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Order } from "@/types";

interface OrderDataProps {
  order: Order | null;
}

export default function CheckoutSuccessPage(props: OrderDataProps) {
  const { order } = props;

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

        {order && (
          <Badge
            variant="secondary"
            className="text-lg px-4 py-2"
          >{`Mã đơn hàng: ${order.code}`}</Badge>
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
            {order && (
              <>
                <OrderDetailRow label="Mã đơn hàng" value={order.code} />
                <OrderDetailRow
                  label="Tổng tiền"
                  value={
                    <Price
                      price={order.finalAmount}
                      size="base"
                      weight="semibold"
                    />
                  }
                />
                <OrderDetailRow
                  label="Phương thức thanh toán"
                  value={order.paymentMethod}
                />
                <OrderDetailRow
                  label="Địa chỉ giao hàng"
                  value={order.shippingAddress}
                />
                <OrderDetailRow
                  label="Trạng thái"
                  value={<Badge variant="default">{order.status}</Badge>}
                />
              </>
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
          <Link href="/account/orders">Xem đơn hàng</Link>
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
      <span>{value}</span>
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
