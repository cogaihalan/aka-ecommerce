"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { AffiliateTransaction, AffiliateTransactionType, AffiliateUserAccount } from "@/types";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Price } from "@/components/ui/price";

export const columns: ColumnDef<AffiliateTransaction>[] = [
    {
        id: "id",
        accessorKey: "id",
        header: ({ column }: { column: Column<AffiliateTransaction, unknown> }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: ({ row }) => {
            const id = row.getValue("id") as number;
            return <div className="font-medium text-sm w-4">{id}</div>;
        },  
        size: 16,
        maxSize: 16,
    },
    {
        id: "affiliate",
        accessorKey: "affiliate",
        header: "Người dùng",
        cell: ({ row }) => {
            const affiliate = row.getValue("affiliate") as AffiliateUserAccount;
            return <div className="font-medium text-sm w-4">{affiliate.fullName || affiliate.userName}</div>;
        },
    },
    {
        id: "amount",
        accessorKey: "amount",
        header: ({ column }: { column: Column<AffiliateTransaction, unknown> }) => (
            <DataTableColumnHeader column={column} title="Số tiền" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue("amount") as number;
            return <Price price={amount} size="base" weight="semibold" showCurrency={true} currency="đ" />
        },
    },
    {
        id: "type",
        accessorKey: "type",
        header: "Loại giao dịch",
        cell: ({ row }) => {
            const type = row.getValue("type") as AffiliateTransactionType;
            return <Badge variant="outline">{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
        },
        meta: {
            label: "Loại giao dịch",
            placeholder: "Lọc theo loại giao dịch...",
            variant: "select",
            options: [
                { label: "Commission", value: AffiliateTransactionType.COMMISSION },
                { label: "Withdrawal", value: AffiliateTransactionType.WITHDRAWAL },
                { label: "Adjustment", value: AffiliateTransactionType.ADJUSTMENT },
            ],
        },
        enableColumnFilter: true,
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }: { column: Column<AffiliateTransaction, unknown> }) => (
            <DataTableColumnHeader column={column} title="Ngày tạo" />
        ),
        cell: ({ row }) => {
            const createdAt = row.getValue("createdAt") as Date;
            return <div className="font-medium text-sm w-4">{createdAt.toLocaleDateString()}</div>;
        },
        meta: {
            label: "Ngày tạo",
            variant: "date",
            icon: Calendar,
        },
        enableColumnFilter: true,
    },
];
