"use client";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Product, ProductImage, ProductStatus } from "@/types";
import { Column, ColumnDef } from "@tanstack/react-table";
import {
  Text,
  CheckCircle,
  XCircle,
  Archive,
  AlertCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { CellAction } from "./cell-action";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Product>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }: { column: Column<Product, unknown> }) => (
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
    header: "Image",
    cell: ({ row }) => {
      const images = row.getValue("images") as ProductImage[];
      const primaryImage = images.find((image) => image.primary);

      return (
        <div className="relative aspect-square">
          <Image
            src={primaryImage?.url || "/assets/placeholder-image.jpeg"}
            alt={row.getValue("name")}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      );
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Product["name"]>()}</div>,
    meta: {
      label: "Name",
      placeholder: "Search products...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "stock",
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      return <div className="font-medium">{stock || 0}</div>;
    },
  },
  {
    id: "price",
    accessorKey: "price",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      const discountPrice = row.original.discountPrice;
      return (
        <div className="space-y-1">
          <div className="font-medium">{formatPrice(price || 0)}</div>
          {!!discountPrice && discountPrice > 0 && (
            <div className="text-sm text-green-600">
              {formatPrice(discountPrice)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ProductStatus;

      const statusConfig = {
        DRAFT: { label: "Draft", variant: "secondary" as const, icon: Clock },
        ACTIVE: {
          label: "Active",
          variant: "default" as const,
          icon: CheckCircle,
        },
        INACTIVE: {
          label: "Inactive",
          variant: "destructive" as const,
          icon: XCircle,
        },
        ARCHIVED: {
          label: "Archived",
          variant: "outline" as const,
          icon: Archive,
        },
        OUT_OF_STOCK: {
          label: "Out of Stock",
          variant: "destructive" as const,
          icon: AlertCircle,
        },
      };

      const config = statusConfig[status];
      const Icon = config.icon;

      return (
        <Badge variant={config.variant} className="flex items-center gap-1">
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
    meta: {
      label: "Status",
      placeholder: "Filter by status...",
      variant: "select",
      options: [
        { label: "Draft", value: "DRAFT" },
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
        { label: "Archived", value: "ARCHIVED" },
        { label: "Out of Stock", value: "OUT_OF_STOCK" },
      ],
    },
    enableColumnFilter: true,
    size: 120,
    maxSize: 150,
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-50 line-clamp-4 text-sm text-muted-foreground whitespace-normal">
          {description || "No description"}
        </div>
      );
    },
    size: 200,
    maxSize: 250,
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 32,
    maxSize: 32,
  },
];
