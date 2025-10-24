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
import {
  MoreHorizontal,
  Eye,
  X,
} from "lucide-react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Order, OrderItem } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import Link from "next/link";

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipping", value: "shipping" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
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
 
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "code",
    accessorKey: "code",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Order #" />
    ),
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return <div className="font-medium">{code}</div>;
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
  },
  {
    id: "total",
    accessorKey: "finalAmount",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const finalAmount = row.getValue("finalAmount") as number;
      return <div className="font-medium">{formatCurrency(finalAmount)}</div>;
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
      const items = row.getValue("items") as OrderItem[];
      const itemCount = items?.length || 0;
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
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-sm">{formatDate(date)}</div>
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
      const id = row.getValue("id") as number;

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
                <Link href={`/account/orders/${id}`}>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCancelOrder(id)}>
              <X className="mr-2 h-4 w-4 text-destructive" /> Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
