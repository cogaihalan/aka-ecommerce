"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import { formatCurrency } from "@/lib/format";
import { CellAction } from "./cell-action";

const STATUS_OPTIONS = [
  { label: "Chờ xử lý", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang giao", value: "SHIPPING" },
  { label: "Đã giao", value: "DELIVERED" },
  { label: "Đã hủy", value: "CANCELLED" },
  { label: "Đã hoàn tiền", value: "REFUNDED" },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "Chưa thanh toán", value: "UNPAID" },
  { label: "Đã thanh toán", value: "PAID" },
  { label: "Thất bại", value: "FAILED" },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status.toUpperCase()) {
    case "DELIVERED":
    case "PAID":
      return "default";
    case "SHIPPING":
    case "CONFIRMED":
      return "secondary";
    case "CANCELLED":
    case "FAILED":
    case "REFUNDED":
      return "destructive";
    case "PENDING":
    case "UNPAID":
      return "outline";
    default:
      return "outline";
  }
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "orderCode",
    accessorKey: "orderCode",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Mã đơn" />
    ),
    cell: ({ row }) => {
      const orderCode = row.getValue("code") as string;
      return <div className="font-medium">{orderCode}</div>;
    },
    meta: {
      label: "Mã đơn hàng",
      placeholder: "Tìm đơn hàng...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusMap: Record<string, string> = {
        PENDING: "Chờ xử lý",
        CONFIRMED: "Đã xác nhận",
        SHIPPING: "Đang giao",
        DELIVERED: "Đã giao",
        CANCELLED: "Đã hủy",
        REFUNDED: "Đã hoàn tiền",
      };
      return (
        <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
          {statusMap[status.toUpperCase()] ?? status.replace("_", " ")}
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
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Thanh toán" />
    ),
    cell: ({ row }) => {
      const paymentStatus = row.getValue("paymentStatus") as string;
      const payMap: Record<string, string> = {
        UNPAID: "Chưa thanh toán",
        PAID: "Đã thanh toán",
        FAILED: "Thất bại",
      };
      return (
        <Badge
          variant={getStatusBadgeVariant(paymentStatus)}
          className="capitalize"
        >
          {payMap[paymentStatus.toUpperCase()] ?? paymentStatus.replace("_", " ")}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Trạng thái thanh toán",
      variant: "select",
      options: PAYMENT_STATUS_OPTIONS,
    },
  },
  {
    id: "total",
    accessorKey: "finalAmount",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Tổng" />
    ),
    cell: ({ row }) => {
      const order = row.original;
      const total = order.finalAmount;
      return <div className="font-medium">{formatCurrency(total)}</div>;
    },
    meta: {
      label: "Tổng tiền",
      variant: "range",
    },
    enableColumnFilter: true,
  },
  {
    id: "items",
    accessorKey: "items",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Sản phẩm" />
    ),
    cell: ({ row }) => {
      const order = row.original;
      const itemCount = order.items?.length || 0;
      return (
        <div className="text-center">
          <span className="font-medium">{itemCount}</span>
        </div>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Ngày" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="text-sm">{new Date(date).toLocaleDateString()}</div>
      );
    },
    meta: {
      label: "Ngày",
      variant: "dateRange",
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
