"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { CheckCircle, Package, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Order } from "@/types";
import { useI18n } from "@/components/providers/i18n-provider";

interface OrderDataProps {
  order: Order | null;
}

export default function CheckoutSuccessPage(props: OrderDataProps) {
  const { t } = useI18n();
  const { order } = props;

  return (
    <div className="max-w-4xl mx-auto py-8 lg:py-16 space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{t("checkout.success.title")}</h1>
          <p className="text-muted-foreground">{t("checkout.success.subtitle")}</p>
        </div>

        {order && (
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {t("checkout.success.orderCode", { code: order.code })}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t("checkout.success.orderDetails")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order && (
              <>
                <OrderDetailRow label={t("checkout.success.labels.orderCode")} value={order.code} />
                <OrderDetailRow
                  label={t("checkout.success.labels.total")}
                  value={
                    <Price
                      price={order.finalAmount}
                      size="base"
                      weight="semibold"
                    />
                  }
                />
                <OrderDetailRow
                  label={t("checkout.success.labels.paymentMethod")}
                  value={order.paymentMethod}
                />
                <OrderDetailRow
                  label={t("checkout.success.labels.shippingAddress")}
                  value={order.shippingAddress}
                />
                <OrderDetailRow
                  label={t("checkout.success.labels.status")}
                  value={<Badge variant="default">{order.status}</Badge>}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Next Steps Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("checkout.success.nextSteps.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <StepItem
                step={1}
                title={t("checkout.success.nextSteps.step1.title")}
                description={t("checkout.success.nextSteps.step1.description")}
                color="blue"
              />
              <StepItem
                step={2}
                title={t("checkout.success.nextSteps.step2.title")}
                description={t("checkout.success.nextSteps.step2.description")}
                color="orange"
              />
              <StepItem
                step={3}
                title={t("checkout.success.nextSteps.step3.title")}
                description={t("checkout.success.nextSteps.step3.description")}
                color="green"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("checkout.success.contact.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContactItem
              icon={<Mail className="h-5 w-5 text-muted-foreground" />}
              title={t("checkout.success.contact.email")}
              value="support@akastore.com"
            />
            <ContactItem
              icon={<Phone className="h-5 w-5 text-muted-foreground" />}
              title={t("checkout.success.contact.hotline")}
              value="1900 1234"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/account/orders">{t("checkout.success.viewOrders")}</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/products">{t("checkout.success.continueShopping")}</Link>
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
