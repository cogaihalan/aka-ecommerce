"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { AffiliateApprovalStatus, AffiliateUserAccount, AffiliateWithdrawal } from "@/types";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MoreVertical } from "lucide-react";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { unifiedAffiliateService } from "@/lib/api/services/unified";

export const columns: ColumnDef<AffiliateWithdrawal>[] = [
    {
        id: "id",
        accessorKey: "id",
        header: ({ column }: { column: Column<AffiliateWithdrawal, unknown> }) => (
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
        id: "amount",
        accessorKey: "amount",
        header: ({ column }: { column: Column<AffiliateWithdrawal, unknown> }) => (
            <DataTableColumnHeader column={column} title="Số tiền" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue("amount") as number;
            return <div className="font-medium text-sm w-4">{amount}</div>;
        },
    },
    {
        id: "affiliate",
        accessorKey: "affiliate",
        header: ({ column }: { column: Column<AffiliateWithdrawal, unknown> }) => (
            <DataTableColumnHeader column={column} title="Người dùng" />
        ),
        cell: ({ row }) => {
            const affiliate = row.getValue("affiliate") as AffiliateUserAccount;
            return <div className="font-medium text-sm w-4">{affiliate.fullName || affiliate.userName}</div>;
        },
    },
    {
        id: "status",
        accessorKey: "status",
        header: ({ column }: { column: Column<AffiliateWithdrawal, unknown> }) => (
            <DataTableColumnHeader column={column} title="Trạng thái" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as AffiliateApprovalStatus;
            return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
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
        id: "actions",
        cell: ({ row }) => {
            const affiliateId = row.original.id;
            return (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick= {async () => {
                            await unifiedAffiliateService.updateAffiliateWithdrawalStatus(affiliateId);
                        }}>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Duyệt
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
];
