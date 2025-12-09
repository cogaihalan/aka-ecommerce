"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { AffiliateAccount, AffiliateUserAccount } from "@/types";
import { Column, ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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
        id: "affiliateId",
        accessorKey: "affiliateId",
        header: ({ column }: { column: Column<AffiliateAccount, unknown> }) => (
            <DataTableColumnHeader column={column} title="ID người dùng" />
        ),
    },
    {
        id: "balance",
        accessorKey: "balance",
        header: ({ column }: { column: Column<AffiliateAccount, unknown> }) => (
            <DataTableColumnHeader column={column} title="Số dư" />
        ),
        cell: ({ row }) => {
            const balance = row.getValue("balance") as number;
            return <div className="font-medium text-sm w-4">{balance}</div>;
        },
    },
    {
        id: "affiliate",
        accessorKey: "affiliate",
        header: ({ column }: { column: Column<AffiliateAccount, unknown> }) => (
            <DataTableColumnHeader column={column} title="Người dùng" />
        ),
        cell: ({ row }) => {
            const affiliate = row.getValue("affiliate") as AffiliateUserAccount;
            return <div className="font-medium text-sm w-4">{affiliate.fullName || affiliate.userName}</div>;
        },
    },
    {
        id: "commissionRate",
        accessorKey: "commissionRate",
        header: ({ column }: { column: Column<AffiliateAccount, unknown> }) => (
            <DataTableColumnHeader column={column} title="Tỷ lệ hoa hồng" />
        ),
        cell: ({ row }) => {
            const commissionRate = row.getValue("commissionRate") as number;
            return <div className="font-medium text-sm w-4">{commissionRate}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const affiliateId = row.original.affiliateId;
            return (
                <Link href={`/admin/affiliate/${affiliateId}`}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
            );
        },
    }
];
