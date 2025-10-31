"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, X } from "lucide-react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import Link from "next/link";
import { storefrontOrderService } from "@/lib/api/services/storefront/orders-client";
import { toast } from "sonner";
import { getStatusText } from "@/lib/utils";

const STATUS_OPTIONS = [
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Xác nhận", value: "CONFIRMED" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã hủy", value: "CANCELLED" },
  { label: "Đã hoàn tiền", value: "REFUNDED" },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
    case "paid":
      return "default";
    case "shipping":
    case "confirmed":
      return "secondary";
    case "cancelled":
    case "failed":
    case "refunded":
      return "destructive";
    case "pending":
      return "outline";
    default:
      return "outline";
  }
};

const handleCancelOrder = async (id: number) => {
  const response = await storefrontOrderService.cancelOrder(id);
  if (response) {
    toast.success("Đơn hàng đã được hủy thành công");
    window.location.reload();
  } else {
    toast.error("Lỗi khi hủy đơn hàng");
  }
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "orderCode",
    accessorKey: "orderCode",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Mã đơn hàng" />
    ),
    cell: ({ row }) => {
      const orderCode = row.original.code as string;
      return <div className="font-medium">{orderCode}</div>;
    },
    meta: {
      label: "Mã đơn hàng",
      placeholder: "Tìm kiếm đơn hàng...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status as string;
      return (
        <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
          {getStatusText(status)}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Trạng thái",
      variant: "select",
      options: STATUS_OPTIONS,
    },
  },
  {
    id: "paymentStatus",
    accessorKey: "paymentStatus",
    header: "Trạng thái thanh toán",
    cell: ({ row }) => {
      const paymentStatus = row.getValue("paymentStatus") as string;
      return (
        <Badge
          variant={getStatusBadgeVariant(paymentStatus)}
          className="capitalize"
        >
          {getStatusText(paymentStatus)}
        </Badge>
      );
    },
  },
  {
    id: "paymentMethod",
    accessorKey: "paymentMethod",
    header: "Phương thức thanh toán",
    cell: ({ row }) => {
      const paymentMethod = row.original.paymentMethod as string;
      return <div className="font-medium">{paymentMethod}</div>;
    },
  },
  {
    id: "total",
    accessorKey: "finalAmount",
    header: "Tổng",
    cell: ({ row }) => {
      const finalAmount = row.original.finalAmount;
      return <div className="font-medium">{formatCurrency(finalAmount)}</div>;
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Ngày" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return <div className="text-sm">{formatDate(date)}</div>;
    },
    meta: {
      label: "Ngày",
      variant: "dateRange",
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id as number;
      const status = row.original.status as string;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/account/orders/${id}`}>
                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleCancelOrder(id)}
              disabled={status === "CANCELLED"}
            >
              <X className="mr-2 h-4 w-4 text-destructive" /> Hủy đơn hàng
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
