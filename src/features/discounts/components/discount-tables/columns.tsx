"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { DiscountRule, CouponType } from "@/types/discount";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Percent,
  Calendar,
  CheckCircle,
  XCircle,
  Tag,
} from "lucide-react";

export const discountColumns: ColumnDef<DiscountRule>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount Rule" />
    ),
    cell: ({ row }) => {
      const rule = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium">{rule.name}</div>
          {rule.description && (
            <div className="text-sm text-muted-foreground line-clamp-1">
              {rule.description}
            </div>
          )}
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Name",
      placeholder: "Search discounts...",
      variant: "text",
    },
  },
  {
    id: "couponCode",
    accessorKey: "couponCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Coupon Code" />
    ),
    cell: ({ row }) => {
      const code = row.getValue("couponCode") as string;
      if (!code) {
        return <span className="text-muted-foreground">No coupon</span>;
      }
      return (
        <Badge variant="secondary" className="font-mono">
          <Tag className="mr-1 h-3 w-3" />
          {code}
        </Badge>
      );
    },
  },
  {
    id: "couponType",
    accessorKey: "couponType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("couponType") as CouponType;
      const typeLabels: Record<CouponType, string> = {
        no_coupon: "No Coupon",
        specific_coupon: "Specific Coupon",
        auto: "Auto Generated",
      };

      return (
        <Badge variant={type === "no_coupon" ? "outline" : "default"}>
          {typeLabels[type]}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Type",
      variant: "select",
      options: [
        { label: "All Types", value: "all" },
        { label: "No Coupon", value: "no_coupon" },
        { label: "Specific Coupon", value: "specific_coupon" },
        { label: "Auto Generated", value: "auto" },
      ],
    },
  },
  {
    id: "simpleAction",
    accessorKey: "simpleAction",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount" />
    ),
    cell: ({ row }) => {
      const action = row.getValue("simpleAction") as string;
      const amount = row.original.discountAmount;

      const actionLabels: Record<string, string> = {
        by_percent: "Percentage",
        by_fixed: "Fixed Amount",
        cart_fixed: "Cart Fixed",
        buy_x_get_y: "Buy X Get Y",
        buy_x_get_y_percent: "Buy X Get Y %",
        buy_x_get_y_fixed: "Buy X Get Y Fixed",
      };

      return (
        <div className="space-y-1">
          <div className="text-sm font-medium flex items-center gap-1">
            <Percent className="h-3 w-3" />
            {actionLabels[action] || action}
          </div>
          <div className="text-sm text-muted-foreground">
            {action === "by_percent" ? `${amount}%` : `$${amount}`}
          </div>
        </div>
      );
    },
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? (
            <CheckCircle className="mr-1 h-3 w-3" />
          ) : (
            <XCircle className="mr-1 h-3 w-3" />
          )}
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Status",
      variant: "select",
      options: [
        { label: "All", value: "all" },
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  },
  {
    id: "usageCount",
    accessorKey: "usageCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usage" />
    ),
    cell: ({ row }) => {
      const rule = row.original;
      const usageCount = rule.usageCount || 0;
      const usageLimit = rule.usageLimit;

      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">{usageCount}</div>
          {usageLimit && (
            <div className="text-xs text-muted-foreground">of {usageLimit}</div>
          )}
        </div>
      );
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {format(new Date(date), "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const rule = row.original;

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
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(rule.couponCode || "")
              }
            >
              Copy discount ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit discount
            </DropdownMenuItem>
            <DropdownMenuItem>
              {rule.isActive ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete discount
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
