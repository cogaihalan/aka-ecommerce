"use client";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Product, ProductImage } from "@/types";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Text } from "lucide-react";
import Image from "next/image";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Product>[] = [
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
            src={primaryImage?.url || images[0].url}
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
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
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
          <div className="font-medium">${price?.toFixed(2) || "0.00"}</div>
          {discountPrice && discountPrice > 0 && (
            <div className="text-sm text-green-600">
              ${discountPrice.toFixed(2)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "description",
    accessorKey: "description",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-50 line-clamp-4 text-sm text-muted-foreground whitespace-normal">
          {description || "No description"}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
