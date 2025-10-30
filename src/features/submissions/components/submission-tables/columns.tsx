"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, MoreHorizontal, XCircle } from "lucide-react";
import { Submission, SubmissionPhoto, SubmissionStatus } from "@/types";
import { unifiedSubmissionService } from "@/lib/api/services/unified/extensions/submissions";
import { toast } from "sonner";
import Image from "next/image";

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const variant =
    status === "APPROVED" ? "default" : status === "REJECTED" ? "secondary" : "outline";
  return <Badge variant={variant as any}>{status}</Badge>;
}

export const columns: ColumnDef<Submission>[] = [
  {
    id: "photos",
    accessorKey: "photos",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const photos = row.getValue("photos") as SubmissionPhoto[];
      const primaryPhoto = photos?.find((photo) => photo.primary)?.url || "/assets/placeholder-image.jpeg";
      return <div><Image src={primaryPhoto} alt={row.original.name} width={80} height={80} className="rounded-lg object-cover" /></div>;
    },
    size: 80,
    maxSize: 80,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => {
      const sub = row.original;
      return (
        <div>
          <div className="font-medium">{sub.name}</div>
          <div className="text-xs text-muted-foreground">#{sub.id}</div>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Tên",
      placeholder: "Tìm bài dự thi...",
      variant: "text",
    },
  },
  {
    id: "barberName",
    accessorKey: "barberName",
    header: "Thợ cắt tóc",
    cell: ({ row }) => row.getValue("barberName") as string,
    enableColumnFilter: true,
    meta: {
      label: "Thợ cắt tóc",
      placeholder: "Lọc theo tên thợ cắt tóc",
      variant: "text",
    },
  },
  {
    id: "barberAddress",
    accessorKey: "barberAddress",
    header: "Địa chỉ tiệm",
    cell: ({ row }) => row.getValue("barberAddress") as string
  },
  {
    id: "voteCount",
    accessorKey: "voteCount",
    header: "Lượt bình chọn",
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <StatusBadge status={row.getValue("status") as SubmissionStatus} />,
    enableColumnFilter: true,
    meta: {
      label: "Trạng thái",
      placeholder: "Tất cả trạng thái",
      variant: "select",
      options: [
        { label: "Đang chờ", value: "PENDING" },
        { label: "Đã duyệt", value: "APPROVED" },
        { label: "Từ chối", value: "REJECTED" },
      ],
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const sub = row.original;
      const [open, setOpen] = useState(false);
      const isPending = sub.status === "PENDING";

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
                  await unifiedSubmissionService.adminUpdateSubmissionStatus({ id: sub.id, status: "APPROVED" });
                  toast.success("Đã duyệt bài dự thi");
                  window.location.reload();
                } catch (e) {
                  toast.error("Duyệt bài dự thi thất bại");
                }
              }}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Duyệt
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!isPending}
              onClick={async () => {
                try {
                  await unifiedSubmissionService.adminUpdateSubmissionStatus({ id: sub.id, status: "REJECTED" });
                  toast.success("Đã từ chối bài dự thi");
                  window.location.reload();
                } catch (e) {
                  toast.error("Từ chối bài dự thi thất bại");
                }
              }}
            >
              <XCircle className="mr-2 h-4 w-4" /> Từ chối
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 32,
    maxSize: 32,
  },
];


