"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  MoreHorizontal,
  XCircle,
  Clock,
  Star,
  Text,
} from "lucide-react";
import { Product, ProductReview, ProductReviewStatus } from "@/types/product";
import { unifiedProductReviewService } from "@/lib/api/services/unified";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Column } from "@tanstack/react-table";

function StatusBadge({ status }: { status: ProductReviewStatus }) {
  const config = {
    PENDING: { label: "Đang chờ", variant: "outline" as const, icon: Clock },
    APPROVED: {
      label: "Đã duyệt",
      variant: "default" as const,
      icon: CheckCircle2,
    },
    REJECTED: {
      label: "Từ chối",
      variant: "secondary" as const,
      icon: XCircle,
    },
  };

  const { label, variant, icon: Icon } = config[status];

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{rating}</span>
    </div>
  );
}

export const columns: ColumnDef<ProductReview>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }: { column: Column<ProductReview, unknown> }) => (
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
    accessorKey: "user",
    header: "Người dùng",
    cell: ({ row }) => {
      const review = row.original;
      const user = review.user;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{user?.fullName || user?.username}</div>
          </div>
        </div>
      );
    }
  },
  {
    id: "rating",
    accessorKey: "rating",
    header: ({ column }: { column: Column<ProductReview, unknown> }) => (
      <DataTableColumnHeader column={column} title="Đánh giá" />
    ),
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return <RatingStars rating={rating} />;
    },
    enableColumnFilter: true,
    meta: {
      label: "Đánh giá",
      placeholder: "Lọc theo đánh giá...",
      variant: "select",
      options: [
        { label: "1 sao", value: "1" },
        { label: "2 sao", value: "2" },
        { label: "3 sao", value: "3" },
        { label: "4 sao", value: "4" },
        { label: "5 sao", value: "5" },
      ],
    },
  },
  {
    id: "product",
    accessorKey: "product",
    header: "Sản phẩm",
    cell: ({ row }) => {
      const product = row.getValue("product") as Product;
      return <div>{product.name}</div>;
    },
  },
  {
    id: "comment",
    accessorKey: "comment",
    header: "Bình luận",
    cell: ({ row }) => {
      const comment = row.getValue("comment") as string;
      return (
        <div className="max-w-96 line-clamp-2 text-sm text-muted-foreground whitespace-normal">
          {comment || "Không có bình luận"}
        </div>
      );
    },
    size: 300,
    maxSize: 400,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <StatusBadge status={row.getValue("status") as ProductReviewStatus} />
    ),
    enableColumnFilter: true,
    meta: {
      label: "Trạng thái",
      placeholder: "Lọc theo trạng thái...",
      variant: "multiSelect",
      options: [
        { label: "Đang chờ", value: "PENDING" },
        { label: "Đã duyệt", value: "APPROVED" },
        { label: "Từ chối", value: "REJECTED" },
      ],
    },
    size: 120,
    maxSize: 150,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }: { column: Column<ProductReview, unknown> }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </div>
      );
    },
    size: 120,
    maxSize: 150,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const review = row.original;
      const [open, setOpen] = useState(false);
      const isPending = review.status === "PENDING";

      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={!isPending}
              onClick={async () => {
                try {
                  await unifiedProductReviewService.updateProductReviewStatus(
                    review.id,
                    { id: review.id, status: "APPROVED" }
                  );
                  toast.success("Đã duyệt đánh giá");
                  window.location.reload();
                } catch (e) {
                  toast.error("Duyệt đánh giá thất bại");
                }
              }}
            >
              <CheckCircle2 className="mr-2 text-green-500 h-4 w-4" /> Duyệt
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!isPending}
              onClick={async () => {
                try {
                  await unifiedProductReviewService.updateProductReviewStatus(
                    review.id,
                    { id: review.id, status: "REJECTED" }
                  );
                  toast.success("Đã từ chối đánh giá");
                  window.location.reload();
                } catch (e) {
                  toast.error("Từ chối đánh giá thất bại");
                }
              }}
            >
              <XCircle className="mr-2 text-red-500 h-4 w-4" /> Từ chối
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 32,
    maxSize: 32,
  },
];

