"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { AffiliateApproval, AffiliateApprovalStatus } from "@/types";
import { CheckCircle, XCircle, Clock, User, Text } from "lucide-react";
import { format } from "date-fns";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<AffiliateApproval>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }: { column: Column<AffiliateApproval, unknown> }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
      return <div className="font-medium text-sm w-8">{id}</div>;
    },
    size: 32,
    maxSize: 32,
  },
  {
    id: "user",
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const approval = row.original;
      return <div className="text-sm text-muted-foreground">{approval.user?.email}</div>;
    },
    meta: {
      label: "Người dùng",
      placeholder: "Tìm kiếm người dùng...",
      variant: "text",
      icon: User,
    },
    enableColumnFilter: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as AffiliateApprovalStatus;

      const statusConfig = {
        PENDING: {
          label: "Chờ duyệt",
          variant: "secondary" as const,
          icon: Clock,
        },
        APPROVED: {
          label: "Đã duyệt",
          variant: "default" as const,
          icon: CheckCircle,
        },
        REJECTED: {
          label: "Từ chối",
          variant: "destructive" as const,
          icon: XCircle,
        },
      };

      const config = statusConfig[status];
      const Icon = config.icon;

      return (
        <Badge variant={config.variant} className="flex items-center gap-1">
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
    meta: {
      label: "Trạng thái",
      placeholder: "Lọc theo trạng thái...",
      variant: "multiSelect",
      options: [
        { label: "Chờ duyệt", value: "PENDING" },
        { label: "Đã duyệt", value: "APPROVED" },
        { label: "Từ chối", value: "REJECTED" },
      ],
    },
    enableColumnFilter: true,
    size: 120,
    maxSize: 150,
  },
  {
    id: "reason",
    accessorKey: "reason",
    header: "Lý do",
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;
      return (
        <div className="max-w-80 line-clamp-2 text-sm text-muted-foreground whitespace-normal">
          {reason || "Không có lý do"}
        </div>
      );
    },
    size: 200,
    maxSize: 250,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-sm">
          {format(new Date(date), "dd/MM/yyyy HH:mm")}
        </div>
      );
    },
    size: 150,
    maxSize: 180,
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cập nhật" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      return (
        <div className="text-sm">
          {format(new Date(date), "dd/MM/yyyy HH:mm")}
        </div>
      );
    },
    size: 150,
    maxSize: 180,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 32,
    maxSize: 32,
  },
];

