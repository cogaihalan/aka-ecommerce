"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { AffiliateLink } from "@/types";
import { Copy, ExternalLink, ToggleLeft, ToggleRight, Edit, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { unifiedAffiliateLinkService } from "@/lib/api/services/unified/extensions/affiliate/affiliate-link";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<AffiliateLink>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }: { column: Column<AffiliateLink, unknown> }) => (
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
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên" />
    ),
    cell: ({ row }) => {
      const link = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium">{link.name}</div>
          {link.campaignName && (
            <div className="text-sm text-muted-foreground">{link.campaignName}</div>
          )}
        </div>
      );
    },
    meta: {
      label: "Tên",
      placeholder: "Tìm kiếm theo tên...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "code",
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã" />
    ),
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return (
        <div className="flex items-center gap-2">
          <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{code}</code>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => {
              navigator.clipboard.writeText(code);
              toast.success("Đã sao chép mã");
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
    meta: {
      label: "Mã",
      placeholder: "Tìm kiếm theo mã...",
      variant: "text",
    },
    enableColumnFilter: true,
  },
  {
    id: "targetUrl",
    accessorKey: "targetUrl",
    header: "URL đích",
    cell: ({ row }) => {
      const url = row.getValue("targetUrl") as string;
      return (
        <div className="flex items-center gap-2 max-w-xs">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline truncate"
          >
            {url}
          </a>
          <ExternalLink className="h-3 w-3 text-muted-foreground" />
        </div>
      );
    },
  },
  {
    id: "status",
    accessorKey: "activeByAdmin",
    header: "Trạng thái",
    cell: ({ row }) => {
      const link = row.original;
      const isActive = link.activeByAdmin && link.activeByAffiliate;
      
      if (isActive) {
        return (
          <Badge variant="default" className="flex items-center gap-1 w-fit">
            <ToggleRight className="h-3 w-3" />
            Hoạt động
          </Badge>
        );
      } else {
        return (
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <ToggleLeft className="h-3 w-3" />
            Tắt
          </Badge>
        );
      }
    },
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
          {format(new Date(date), "dd/MM/yyyy")}
        </div>
      );
    },
    size: 120,
    maxSize: 150,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const link = row.original;
      const [isLoading, setIsLoading] = useState(false);
      const router = useRouter();

      const handleToggleActive = async () => {
        setIsLoading(true);
        try {
          await unifiedAffiliateLinkService.toggleActiveAffiliateLink(link.id);
          toast.success("Đã cập nhật trạng thái");
          router.refresh();
        } catch (error) {
          toast.error("Cập nhật trạng thái thất bại");
          console.error("Error toggling affiliate link:", error);
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
              <span className="sr-only">Mở menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleToggleActive}
              className="cursor-pointer"
            >
              {link.activeByAdmin ? (
                <>
                  <ToggleLeft className="mr-2 h-4 w-4" />
                  Tắt
                </>
              ) : (
                <>
                  <ToggleRight className="mr-2 h-4 w-4" />
                  Bật
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 32,
    maxSize: 32,
  },
];

