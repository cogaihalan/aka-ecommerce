"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  CreditCard,
  Truck,
  Download,
  Printer,
} from "lucide-react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Order } from "@/lib/api/types";
import { formatCurrency } from "@/lib/format";
import { CellAction } from "./cell-action";

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
  { label: "Partially Refunded", value: "partially_refunded" },
];

const FULFILLMENT_STATUS_OPTIONS = [
  { label: "Unfulfilled", value: "unfulfilled" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Partially Fulfilled", value: "partially_fulfilled" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
];

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
      return "outline";
    default:
      return "outline";
  }
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "orderNumber",
    accessorKey: "orderNumber",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Order #" />
    ),
    cell: ({ row }) => {
      const orderNumber = row.getValue("orderNumber") as string;
      return <div className="font-medium">{orderNumber}</div>;
    },
    meta: {
      label: "Order Number",
      placeholder: "Search orders...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "customer",
    accessorKey: "customer",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const order = row.original;
      const customer = order.customer;
      return (
        <div className="space-y-1">
          <div className="font-medium">
            {customer?.firstName} {customer?.lastName}
          </div>
          <div className="text-sm text-muted-foreground">{customer?.email}</div>
        </div>
      );
    },
    meta: {
      label: "Customer",
      placeholder: "Search customers...",
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
    id: "fulfillmentStatus",
    accessorKey: "fulfillmentStatus",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Fulfillment" />
    ),
    cell: ({ row }) => {
      const fulfillmentStatus = row.getValue("fulfillmentStatus") as string;
      return (
        <Badge
          variant={getStatusBadgeVariant(fulfillmentStatus)}
          className="capitalize"
        >
          {fulfillmentStatus.replace("_", " ")}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Fulfillment Status",
      variant: "select",
      options: FULFILLMENT_STATUS_OPTIONS,
    },
  },
  {
    id: "total",
    accessorKey: "pricing.total",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const order = row.original;
      const total = order.pricing.total;
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
      label: "Order Date",
      variant: "dateRange",
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
