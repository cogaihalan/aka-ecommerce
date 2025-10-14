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
  Package,
  CreditCard,
  Truck,
  Download,
  RefreshCw,
} from "lucide-react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Order } from "@/lib/api/types";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
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
    header: "Items",
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
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/account/orders/${order.id}`}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Link>
            </DropdownMenuItem>

            {order.status === "delivered" && (
              <DropdownMenuItem asChild>
                <Link href={`/account/orders/${order.id}/review`}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Leave Review
                </Link>
              </DropdownMenuItem>
            )}

            {order.status === "shipped" && (
              <DropdownMenuItem asChild>
                <Link href={`/account/orders/${order.id}/track`}>
                  <Truck className="mr-2 h-4 w-4" /> Track Package
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem asChild>
              <Link href={`/account/orders/${order.id}/invoice`}>
                <Download className="mr-2 h-4 w-4" /> Download Invoice
              </Link>
            </DropdownMenuItem>

            {order.status === "pending" && (
              <DropdownMenuItem asChild>
                <Link href={`/checkout/payment/${order.id}`}>
                  <CreditCard className="mr-2 h-4 w-4" /> Complete Payment
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
