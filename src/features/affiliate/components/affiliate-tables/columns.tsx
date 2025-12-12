"use client";

import { Price } from "@/components/ui/price";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { AffiliateAccount, AffiliateUserAccount } from "@/types";
import { Column, ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<AffiliateAccount>[] = [
    {
        id: "id",
        accessorKey: "id",
        header: ({ column }: { column: Column<AffiliateAccount, unknown> }) => (
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
        id: "code",
        accessorKey: "affiliate.code",
        header: "Mã affiliate",
        cell: ({ row }) => {
            const affiliate = row.getValue("affiliate") as AffiliateUserAccount;
            return <div className="font-medium text-sm w-4">{affiliate.code}</div>;
        },
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
        id: "balance",
        accessorKey: "balance",
        header: ({ column }: { column: Column<AffiliateAccount, unknown> }) => (
            <DataTableColumnHeader column={column} title="Số dư" />
        ),
        cell: ({ row }) => {
            const balance = row.getValue("balance") as number;
            return <div className="font-medium text-sm w-4"><Price price={balance} size="base" weight="semibold" showCurrency={true} currency="đ" color="primary" /></div>;
        },
    },
    {
        id: "commissionRate",
        accessorKey: "affiliate.commissionRate",
        header: "Tỷ lệ hoa hồng",
        cell: ({ row }) => {
            const affiliate = row.getValue("affiliate") as AffiliateUserAccount;
            return <div className="font-medium text-sm w-4"><Price price={affiliate.commissionRate} size="base" weight="semibold" showCurrency={true} currency="%" color="primary" /></div>;
        },
    },
];
