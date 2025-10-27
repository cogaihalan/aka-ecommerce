"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";

interface OrderDetailPageProps {
  order: Order;
}

export default function OrderDetailPage({ order }: OrderDetailPageProps) {
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

  const getStatusVariant = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return "default";
      case "SHIPPING":
        return "secondary";
      case "CANCELLED":
      case "REFUNDED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Order #{order.code}</h1>
        <p className="text-muted-foreground">
          Placed on{" "}
          {order.createdAt
            ? new Date(order.createdAt).toLocaleDateString()
            : "Unknown date"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-muted rounded-md"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
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
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="font-medium">{order.recipientName}</p>
                <p className="text-muted-foreground">{order.recipientPhone}</p>
                <p>{order.shippingAddress}</p>
                {order.note && (
                  <div className="mt-2 p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground">Note:</p>
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
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Payment:{" "}
                  <span className="font-medium">{order.paymentStatus}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Method:{" "}
                  <span className="font-medium">{order.paymentMethod}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {order.shippingFee === 0
                    ? "Free"
                    : formatPrice(order.shippingFee)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.finalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full">Track Package</Button>
        </div>
      </div>
    </div>
  );
}
