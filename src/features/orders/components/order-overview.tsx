"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Order, OrderStatus, PaymentStatus } from "@/types";

interface OrderOverviewProps {
  orders: Order[];
  totalOrders: number;
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusCounts: Record<OrderStatus, number>;
  paymentStatusCounts: Record<PaymentStatus, number>;
  recentOrders: number;
}

export default function OrderOverview({ orders, totalOrders }: OrderOverviewProps) {
  // Calculate statistics from orders data
  const stats: OrderStats = {
    totalOrders,
    totalRevenue: orders.reduce((sum, order) => sum + order.finalAmount, 0),
    averageOrderValue: orders.length > 0 
      ? orders.reduce((sum, order) => sum + order.finalAmount, 0) / orders.length 
      : 0,
    statusCounts: {
      PENDING: 0,
      CONFIRMED: 0,
      SHIPPING: 0,
      DELIVERED: 0,
      CANCELLED: 0,
      REFUNDED: 0,
    },
    paymentStatusCounts: {
      UNPAID: 0,
      PAID: 0,
      FAILED: 0,
    },
    recentOrders: orders.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return orderDate >= weekAgo;
    }).length,
  };

  // Count statuses
  orders.forEach(order => {
    stats.statusCounts[order.status]++;
    stats.paymentStatusCounts[order.paymentStatus]++;
  });

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                {stats.totalOrders}
              </div>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">
              {stats.recentOrders} orders this week
            </p>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">
              Average: {formatCurrency(stats.averageOrderValue)}
            </p>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                {stats.statusCounts.PENDING + stats.statusCounts.CONFIRMED + stats.statusCounts.SHIPPING}
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">
              Pending, Confirmed, Shipping
            </p>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Orders</CardTitle>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                {stats.statusCounts.DELIVERED}
              </div>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
