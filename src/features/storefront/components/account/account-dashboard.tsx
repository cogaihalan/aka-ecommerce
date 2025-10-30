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
import { ArrowRight, Edit, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useUserAddresses } from "@/hooks/use-user-addresses";
import { formatCurrency, formatDate } from "@/lib/format";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@/types";

export default function AccountDashboard({ orders }: { orders: Order[] }) {
  const { user } = useUser();
  const { addresses } = useUserAddresses();
  const router = useRouter();

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

  return (
    <div className="space-y-8">
      {/* Greeting Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          Chào mừng, {user?.firstName || "Người dùng"}
        </h1>
        <p className="text-muted-foreground text-lg">
          Từ bảng điều khiển tài khoản của bạn, bạn có thể dễ dàng kiểm tra & xem đơn hàng{" "}
          <Link href="/account/orders" className="text-red-600 hover:underline">
            Gần đây
          </Link>
          , manage your{" "}
          <Link
            href="/account/addresses"
            className="text-red-600 hover:underline"
          >
            Địa chỉ giao hàng và thanh toán
          </Link>{" "}
          và chỉnh sửa{" "}
          <Link
            href="/account/profile"
            className="text-red-600 hover:underline"
          >
            Mật khẩu
          </Link>{" "}
          và{" "}
          <Link
            href="/account/profile"
            className="text-red-600 hover:underline"
          >
            Chi tiết tài khoản
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
              THÔNG TIN TÀI KHOẢN
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
                    <span>{user?.primaryEmailAddress?.emailAddress || user?.emailAddresses[0]?.emailAddress || "Không có email"}</span>
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
              CHỈNH SỬA TÀI KHOẢN
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">ĐỊA CHỈ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* Billing Address */}
              {defaultAddress && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    ĐỊA CHỈ MẶC ĐỊNH
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
                    Không có địa chỉ
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Thêm địa chỉ để mua hàng
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
              QUẢN LÝ ĐỊA CHỈ
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">ĐƠN HÀNG GẦN ĐÂY</CardTitle>
          <button
            onClick={() => router.push("/account/orders")}
            className="text-red-600 hover:underline flex items-center"
          >
            Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MÃ ĐƠN HÀNG</TableHead>
                <TableHead>TRẠNG THÁI</TableHead>
                <TableHead>NGÀY</TableHead>
                <TableHead>TỔNG</TableHead>
                <TableHead>HÀNH ĐỘNG</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <TableRow key={`${order.code}-${index}`}>
                    <TableCell className="font-medium">{order.code}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      {formatCurrency(order.finalAmount)} ({order.items.length} Items)
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          router.push(`/account/orders/${order.id}`)
                        }
                        className="text-red-600 hover:underline flex items-center"
                      >
                        Xem chi tiết <ArrowRight className="ml-1 h-4 w-4" />
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
                    Không tìm thấy đơn hàng
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
