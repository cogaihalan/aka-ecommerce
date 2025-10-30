"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Category } from "@/types";
import { CellAction } from "./cell-action";
import { Text } from "lucide-react";
import Image from "next/image";

export const columns: ColumnDef<Category>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const category = row.original;
      return <div className="font-medium text-sm w-8">{category.id}</div>;
    },
    size: 32,
    maxSize: 32,
  },
  {
    accessorKey: "image",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const category = row.original;
      const image = category?.thumbnailUrl || "/assets/placeholder-image.jpeg";
      return (
        <div className="relative">
          <Image
            src={image}
            alt={category.name}
            width={60}
            height={60}
            className="rounded-lg aspect-square object-cover"
          />
        </div>
      );
    },
    size: 60,
    maxSize: 60,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên" />
    ),
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center space-x-2">
          <div>
            <div className="font-medium">{category.name}</div>
            <div className="text-sm text-muted-foreground">
              ID: {category.id}
            </div>
          </div>
        </div>
      );
    },
    meta: {
      label: "Tên",
      placeholder: "Tìm danh mục...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[300px] truncate text-sm text-muted-foreground">
          {description || "Không có mô tả"}
        </div>
      );
    },
  },
  {
    accessorKey: "parentId",
    header: "Danh mục cha",
    cell: ({ row }) => {
      const parentId = row.getValue("parentId") as number;
      return (
        <div className="text-sm">
          {!parentId ? (
            <span className="text-muted-foreground">Danh mục gốc</span>
          ) : (
            <span>ID cha: {parentId}</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
