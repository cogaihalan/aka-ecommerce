"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { AffiliateApprovalStatus, AffiliateUserAccount, AffiliateWithdrawal, AffiliateWithdrawalStatus } from "@/types";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MoreVertical } from "lucide-react";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { unifiedAffiliateService } from "@/lib/api/services/unified";
import { Price } from "@/components/ui/price";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
    { label: "Chờ duyệt", value: AffiliateWithdrawalStatus.PENDING },
    { label: "Đã duyệt", value: AffiliateWithdrawalStatus.COMPLETED },
];

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
        id: "affiliate",
        accessorKey: "affiliate",
        header: "Người dùng",
        cell: ({ row }) => {
            const affiliate = row.getValue("affiliate") as AffiliateUserAccount;
            return <p>{affiliate.email}</p>;
        },
    },
    {
        id: "amount",
        accessorKey: "amount",
        header: ({ column }: { column: Column<AffiliateWithdrawal, unknown> }) => (
            <DataTableColumnHeader column={column} title="Số tiền" />
        ),
        cell: ({ row }) => {
            const amount = row.getValue("amount") as number;
            return <Price price={amount} size="sm" weight="semibold" showCurrency={true} currency="đ" />
        },
    },
    {
        id: "status",
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.getValue("status") as AffiliateWithdrawalStatus;
            return <Badge variant={status === AffiliateWithdrawalStatus.PENDING ? "secondary" : status === AffiliateWithdrawalStatus.COMPLETED ? "default" : "destructive"}>
                {STATUS_OPTIONS.find(option => option.value === status)?.label}
                </Badge>;
        },
        meta: {
            label: "Trạng thái",
            placeholder: "Lọc theo trạng thái...",
            variant: "select",
            options: [
                { label: "Chờ duyệt", value: AffiliateWithdrawalStatus.PENDING },
                { label: "Đã duyệt", value: AffiliateWithdrawalStatus.COMPLETED },
            ],
        },
        enableColumnFilter: true,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const affiliateId = row.original.id;
            const router = useRouter();
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
                            try {
                                await unifiedAffiliateService.updateAffiliateWithdrawalStatus(affiliateId);
                                toast.success("Đã duyệt yêu cầu rút tiền");
                                router.refresh();
                            } catch (error) {
                                toast.error("Duyệt yêu cầu rút tiền thất bại");
                                console.error("Error updating affiliate withdrawal status:", error);
                            }
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
