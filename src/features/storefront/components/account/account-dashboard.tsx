"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Edit, Mail, Phone, Loader2 } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useUserAddresses } from "@/hooks/use-user-addresses";
import { formatCurrency, formatDate } from "@/lib/format";
import { unifiedOrderService } from "@/lib/api/services/unified";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@/types";

interface DisplayOrder {
  id: string;
  status: string;
  date: string;
  total: number;
  products: number;
  statusColor: string;
}

export default function AccountDashboard() {
  const { user } = useUser();
  const { addresses } = useUserAddresses();
  const router = useRouter();
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get default billing address
  const defaultAddress = addresses.find(
    (addr) => addr.isDefault
  );

  // Helper function to get status color
  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600";
      case "DELIVERED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Helper function to format status for display
  const formatStatus = (status: OrderStatus): string => {
    switch (status) {
      case "PENDING":
        return "PENDING";
      case "DELIVERED":
        return "COMPLETED";
      case "CANCELLED":
        return "CANCELED";
      default:
        return status.toUpperCase();
    }
  };

  // Load orders data
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch recent orders (limit to 7 for display)
        const response = await unifiedOrderService.getOrders({
          page: 1,
          size: 7,
          sort: ["createdAt,desc"],
        });

        // Transform orders for display
        const displayOrders: DisplayOrder[] = response.items.map(
          (order: Order) => ({
            id: order.id.toString(),
            status: formatStatus(order.status),
            date: formatDate(order.createdAt, {
              month: "short",
              day: "numeric",
              year: order.createdAt?.getFullYear()?.toString() as "numeric" | "2-digit" | undefined,
            }),
            total: order.finalAmount,
            products: order.items.length,
            statusColor: getStatusColor(order.status),
          }));

        setOrders(displayOrders);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError("Failed to load order data");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Greeting Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          Hello, {user?.firstName || "User"}
        </h1>
        <p className="text-muted-foreground text-lg">
          From your account dashboard, you can easily check & view your{" "}
          <Link href="/account/orders" className="text-red-600 hover:underline">
            Recent Orders
          </Link>
          , manage your{" "}
          <Link
            href="/account/addresses"
            className="text-red-600 hover:underline"
          >
            Shipping and Billing Addresses
          </Link>{" "}
          and edit your{" "}
          <Link
            href="/account/profile"
            className="text-red-600 hover:underline"
          >
            Password
          </Link>{" "}
          and{" "}
          <Link
            href="/account/profile"
            className="text-red-600 hover:underline"
          >
            Account Details
          </Link>
          .
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              ACCOUNT INFO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.imageUrl || ""} alt={user?.firstName || ""} />
                <AvatarFallback className="text-lg">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-lg">
                  {user?.firstName} {user?.lastName}
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{user?.primaryEmailAddress?.emailAddress || user?.emailAddresses[0]?.emailAddress || "No email available"}</span>
                  </div>
                  {defaultAddress?.recipientPhone && (
                    <div className="flex items-center justify-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{defaultAddress.recipientPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => router.push("/account/profile")}
            >
              <Edit className="mr-2 h-4 w-4" />
              EDIT ACCOUNT
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">ADDRESSES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Billing Address */}
              {defaultAddress && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    DEFAULT ADDRESS
                  </h4>
                  <div className="space-y-1">
                    <h3 className="font-semibold">
                      {defaultAddress.recipientName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {defaultAddress.recipientAddress}
                    </p>
                    {defaultAddress.recipientPhone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4" />
                        <span>{defaultAddress.recipientPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No addresses message */}
              {!defaultAddress && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    No addresses set
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Add addresses to see them here
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              className="w-full border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => router.push("/account/addresses")}
            >
              <Edit className="mr-2 h-4 w-4" />
              MANAGE ADDRESSES
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">RECENT ORDER</CardTitle>
          <button
            onClick={() => router.push("/account/orders")}
            className="text-red-600 hover:underline flex items-center"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ORDER ID</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <TableRow key={`${order.id}-${index}`}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      {formatCurrency(order.total)} ({order.products} Items)
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          router.push(`/account/orders/${order.id}`)
                        }
                        className="text-red-600 hover:underline flex items-center"
                      >
                        View Details <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
