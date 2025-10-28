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

const STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Shipping", value: "SHIPPING" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Refunded", value: "REFUNDED" },
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
    toast.success("Order cancelled successfully");
    window.location.reload();
  } else {
    toast.error("Failed to cancel order");
  }
};

export const columns: ColumnDef<Order>[] = [
  {
    id: "orderCode",
    accessorKey: "orderCode",
    header: ({ column }: { column: Column<Order, unknown> }) => (
      <DataTableColumnHeader column={column} title="Order Code" />
    ),
    cell: ({ row }) => {
      const orderCode = row.original.code as string;
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
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as string;
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
    header: "Payment Status",
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
  },
  {
    id: "paymentMethod",
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const paymentMethod = row.original.paymentMethod as string;
      return <div className="font-medium">{paymentMethod}</div>;
    },
  },
  {
    id: "total",
    accessorKey: "finalAmount",
    header: "Total",
    cell: ({ row }) => {
      const finalAmount = row.original.finalAmount;
      return <div className="font-medium">{formatCurrency(finalAmount)}</div>;
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
      return <div className="text-sm">{formatDate(date)}</div>;
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
      const id = row.original.id as number;

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
