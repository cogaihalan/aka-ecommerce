"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import { formatCurrency } from "@/lib/format";
import { CellAction } from "./cell-action";

const STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Shipping", value: "SHIPPING" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Refunded", value: "REFUNDED" },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "Unpaid", value: "UNPAID" },
  { label: "Paid", value: "PAID" },
  { label: "Failed", value: "FAILED" },
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
      <DataTableColumnHeader column={column} title="Order #" />
    ),
    cell: ({ row }) => {
      const orderCode = row.getValue("code") as string;
      return <div className="font-medium">{orderCode}</div>;
    },
    meta: {
      label: "Order Code",
      placeholder: "Search orders...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
          {status.replace("_", " ")}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Status",
      variant: "select",
      options: STATUS_OPTIONS,
    },
  },
  {
    id: "paymentStatus",
    accessorKey: "paymentStatus",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Payment" />
    ),
    cell: ({ row }) => {
      const paymentStatus = row.getValue("paymentStatus") as string;
      return (
        <Badge
          variant={getStatusBadgeVariant(paymentStatus)}
          className="capitalize"
        >
          {paymentStatus.replace("_", " ")}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Payment Status",
      variant: "select",
      options: PAYMENT_STATUS_OPTIONS,
    },
  },
  {
    id: "total",
    accessorKey: "finalAmount",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const order = row.original;
      const total = order.finalAmount;
      return <div className="font-medium">{formatCurrency(total)}</div>;
    },
    meta: {
      label: "Total Amount",
      variant: "range",
    },
    enableColumnFilter: true,
  },
  {
    id: "items",
    accessorKey: "items",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Items" />
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
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="text-sm">{new Date(date).toLocaleDateString()}</div>
      );
    },
    meta: {
      label: "Date",
      variant: "dateRange",
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
