"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { AffiliateApprovalStatus, AffiliateWithdrawal } from "@/types";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function createColumns(): ColumnDef<AffiliateWithdrawal>[] {
  return [
    {
      id: "id",
      accessorKey: "id",
      header: ({
        column,
      }: {
        column: Column<AffiliateWithdrawal, unknown>;
      }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => {
        const id = row.getValue("id") as number;
        return <div className="font-medium text-sm w-8">{id}</div>;
      },
      size: 32,
      maxSize: 32,
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: ({
        column,
      }: {
        column: Column<AffiliateWithdrawal, unknown>;
      }) => <DataTableColumnHeader column={column} title="Số tiền" />,
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return (
          <div className="font-medium">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(amount)}
          </div>
        );
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({
        column,
      }: {
        column: Column<AffiliateWithdrawal, unknown>;
      }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as AffiliateApprovalStatus;
        const statusConfig: Record<
          AffiliateApprovalStatus,
          { label: string; variant: "default" | "secondary" | "destructive" }
        > = {
          PENDING: { label: "Chờ duyệt", variant: "secondary" },
          APPROVED: { label: "Đã duyệt", variant: "default" },
          REJECTED: { label: "Từ chối", variant: "destructive" },
        };
        const config = statusConfig[status] || {
          label: status,
          variant: "secondary" as const,
        };
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
      meta: {
        label: "Trạng thái",
        placeholder: "Lọc theo trạng thái...",
        variant: "select",
        options: [
          { label: "Chờ duyệt", value: AffiliateApprovalStatus.PENDING },
          { label: "Đã duyệt", value: AffiliateApprovalStatus.APPROVED },
          { label: "Từ chối", value: AffiliateApprovalStatus.REJECTED },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({
        column,
      }: {
        column: Column<AffiliateWithdrawal, unknown>;
      }) => <DataTableColumnHeader column={column} title="Ngày tạo" />,
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as Date;
        return (
          <div className="text-sm">
            {format(new Date(createdAt), "dd/MM/yyyy HH:mm")}
          </div>
        );
      },
      size: 120,
      maxSize: 150,
    },
  ];
}
