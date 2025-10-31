"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Course } from "@/types/extensions/course";
import {
  MoreHorizontal,
  Play,
  Edit,
  Text,
  Clock,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { formatDuration } from "@/lib/format";
import { useState } from "react";
import { VideoPreviewDialog } from "../video-preview-dialog";
import { CourseDialog } from "../course-dialog";
import Image from "next/image";

export const columns: ColumnDef<Course>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }: { column: Column<Course, unknown> }) => (
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
    id: "images",
    accessorKey: "images",
    header: "Thumbnail",
    cell: ({ row }) => {
      const thumbnail = row.original.thumbnailUrl;

      return (
        <div className="relative">
          <Image
            width={80}
            height={80}
            src={thumbnail || "/assets/placeholder-image.jpeg"}
            alt={row.getValue("name")}
            className="rounded-lg aspect-square object-cover"
          />
        </div>
      );
    },
    size: 80,
    maxSize: 80,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên khoá học" />
    ),
    cell: ({ row }) => {
      const course = row.original;
      return (
        <div className="max-w-45 font-medium line-clamp-2 whitespace-normal">
          {course.name}
        </div>
      );
    },
    meta: {
        label: "Tên khoá học",
      placeholder: "Tìm kiếm khoá học...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <div className="max-w-60 line-clamp-4 text-sm text-muted-foreground whitespace-normal">
          {description}
        </div>
      );
    },
    size: 200,
    maxSize: 250,
  },
  {
    accessorKey: "duration",
    header: "Thời lượng",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number;
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{formatDuration(duration)}</span>
        </div>
      );
    },
  },
  {
    id: "status",
    accessorKey: "active",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.original.active;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    meta: {
      label: "Trạng thái",
      variant: "select",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
      ],
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(date).toLocaleDateString('vi-VN')}</span>
        </div>
      );
    },
    meta: {
      label: "Tạo lúc",
      variant: "date",
      icon: Calendar,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cập nhật lúc" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as string;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(date).toLocaleDateString('vi-VN')}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;
      const [showVideoPreview, setShowVideoPreview] = useState(false);
      const [showEditDialog, setShowEditDialog] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setShowVideoPreview(true)}
                className="cursor-pointer"
              >
                <Play className="mr-2 h-4 w-4" />
                Xem video
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowEditDialog(true)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa khoá học
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <VideoPreviewDialog
            course={course}
            open={showVideoPreview}
            onOpenChange={setShowVideoPreview}
          />

          <CourseDialog
            course={course}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            onSuccess={() => {
              // Refresh the page or refetch data
              window.location.reload();
            }}
          />
        </>
      );
    },
  },
];
