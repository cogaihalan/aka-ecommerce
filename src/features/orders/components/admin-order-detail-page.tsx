"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  User,
  MapPin,
  CreditCard,
  Edit,
  Save,
  X,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Order } from "@/lib/api/types";
import { formatCurrency } from "@/lib/format";
import { unifiedOrderService } from "@/lib/api/services/unified";
import { toast } from "sonner";
import PageContainer from "@/components/layout/page-container";

interface AdminOrderDetailPageProps {
  order: Order;
}

export default function AdminOrderDetailPage({
  order,
}: AdminOrderDetailPageProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Partial<Order>>({
    status: order.status,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    notes: order.notes,
    tags: order.tags,
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "processing":
        return <RefreshCw className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
      case "refunded":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "paid":
      case "fulfilled":
        return "default";
      case "shipped":
      case "processing":
        return "secondary";
      case "cancelled":
      case "failed":
      case "refunded":
        return "destructive";
      case "pending":
      case "unfulfilled":
      default:
        return "outline";
    }
  };

  const handleStatusUpdate = async (field: keyof Order, value: any) => {
    setLoading(true);
    try {
      await unifiedOrderService.updateOrder(order.id, {
        id: order.id,
        [field]: value,
      });
      toast.success(`Order ${field} updated successfully`);
      router.refresh();
    } catch (error) {
      toast.error(`Failed to update order ${field}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      await unifiedOrderService.updateOrder(order.id, {
        id: order.id,
        ...editedOrder,
      });
      toast.success("Order updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedOrder({
      status: order.status,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      notes: order.notes,
      tags: order.tags,
    });
    setIsEditing(false);
  };

  return (
    <PageContainer>
      <div className="flex flex-col flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
              <p className="text-muted-foreground">
                Created on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Order
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
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
                            {item.product?.name || "Product"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.product?.sku || "N/A"}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Price: {formatCurrency(item.price)}
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="font-bold">
                              Total: {formatCurrency(item.total)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No items found for this order</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{order.customer?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm">{order.customer?.phone || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge
                      variant={getStatusBadgeVariant(
                        order.customer?.status || "active"
                      )}
                    >
                      {order.customer?.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">
                      {order.shippingAddress?.firstName}{" "}
                      {order.shippingAddress?.lastName}
                    </p>
                    <p>{order.shippingAddress?.address1}</p>
                    {order.shippingAddress?.address2 && (
                      <p>{order.shippingAddress.address2}</p>
                    )}
                    <p>{order.shippingAddress?.phone}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">
                      {order.billingAddress?.firstName}{" "}
                      {order.billingAddress?.lastName}
                    </p>
                    <p>{order.billingAddress?.address1}</p>
                    {order.billingAddress?.address2 && (
                      <p>{order.billingAddress.address2}</p>
                    )}
                    <p>{order.billingAddress?.phone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedOrder.notes || ""}
                    onChange={(e) =>
                      setEditedOrder({ ...editedOrder, notes: e.target.value })
                    }
                    placeholder="Add order notes..."
                    rows={3}
                  />
                ) : (
                  <p className="text-sm">
                    {order.notes || "No notes available"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedOrder.status}
                      onValueChange={(value) =>
                        setEditedOrder({ ...editedOrder, status: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-3 mt-2">
                      {getStatusIcon(order.status)}
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">Payment Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedOrder.paymentStatus}
                      onValueChange={(value) =>
                        setEditedOrder({
                          ...editedOrder,
                          paymentStatus: value as any,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                        <SelectItem value="partially_refunded">
                          Partially Refunded
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-3 mt-2">
                      <Badge
                        variant={getStatusBadgeVariant(order.paymentStatus)}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Fulfillment Status
                  </Label>
                  {isEditing ? (
                    <Select
                      value={editedOrder.fulfillmentStatus}
                      onValueChange={(value) =>
                        setEditedOrder({
                          ...editedOrder,
                          fulfillmentStatus: value as any,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unfulfilled">Unfulfilled</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="fulfilled">Fulfilled</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-3 mt-2">
                      <Badge
                        variant={getStatusBadgeVariant(order.fulfillmentStatus)}
                      >
                        {order.fulfillmentStatus}
                      </Badge>
                    </div>
                  )}
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
                  <span>{formatCurrency(order.pricing.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(order.pricing.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {order.pricing.shipping === 0
                      ? "Free"
                      : formatCurrency(order.pricing.shipping)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.pricing.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="capitalize">{order.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gateway</span>
                  <span className="capitalize">{order.payment.gateway}</span>
                </div>
                {order.payment.transactionId && (
                  <div className="flex justify-between">
                    <span>Transaction ID</span>
                    <span className="text-sm font-mono">
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
                {order.payment.processedAt && (
                  <div className="flex justify-between">
                    <span>Processed</span>
                    <span className="text-sm">
                      {new Date(order.payment.processedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="capitalize">{order.shipping.method}</span>
                </div>
                {order.shipping.carrier && (
                  <div className="flex justify-between">
                    <span>Carrier</span>
                    <span>{order.shipping.carrier}</span>
                  </div>
                )}
                {order.shipping.trackingNumber && (
                  <div className="flex justify-between">
                    <span>Tracking</span>
                    <span className="text-sm font-mono">
                      {order.shipping.trackingNumber}
                    </span>
                  </div>
                )}
                {order.shipping.estimatedDelivery && (
                  <div className="flex justify-between">
                    <span>Est. Delivery</span>
                    <span className="text-sm">
                      {new Date(
                        order.shipping.estimatedDelivery
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Input
                    value={editedOrder.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setEditedOrder({
                        ...editedOrder,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Enter tags separated by commas"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {order.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    )) || (
                      <span className="text-muted-foreground">No tags</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusUpdate("status", "processing")}
                  disabled={loading || order.status === "processing"}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Mark as Processing
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusUpdate("status", "shipped")}
                  disabled={loading || order.status === "shipped"}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Mark as Shipped
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusUpdate("status", "delivered")}
                  disabled={loading || order.status === "delivered"}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Delivered
                </Button>
                <Separator />
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleStatusUpdate("paymentStatus", "paid")}
                  disabled={loading || order.paymentStatus === "paid"}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Mark Payment as Paid
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
