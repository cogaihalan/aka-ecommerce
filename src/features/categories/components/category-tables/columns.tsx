"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Category } from "@/lib/api/types";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export const columns: ColumnDef<Category>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const category = row.original;
      const level = category.level;
      const indent = level * 20; // 20px per level

      return (
        <div className="flex items-center space-x-2">
          <div style={{ marginLeft: `${indent}px` }}>
            {level > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            {category.image && (
              <img
                src={category.image.url}
                alt={category.name}
                className="h-8 w-8 rounded object-cover"
              />
            )}
            <div>
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-muted-foreground">
                {category.slug}
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[300px] truncate text-sm text-muted-foreground">
          {description || "No description"}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "productCount",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Products" />
  //   ),
  //   cell: ({ row }) => {
  //     const count = row.getValue("productCount") as number;
  //     return (
  //       <Badge variant="secondary" className="font-mono">
  //         {count || 0}
  //       </Badge>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "isActive",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const isActive = row.getValue("isActive") as boolean;
  //     return (
  //       <Badge variant={isActive ? "default" : "secondary"}>
  //         {isActive ? "Active" : "Inactive"}
  //       </Badge>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "includeInMenu",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Menu" />
  //   ),
  //   cell: ({ row }) => {
  //     const includeInMenu = row.getValue("includeInMenu") as boolean;
  //     return (
  //       <Badge variant={includeInMenu ? "outline" : "secondary"}>
  //         {includeInMenu ? "Included" : "Hidden"}
  //       </Badge>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "level",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Level" />
  //   ),
  //   cell: ({ row }) => {
  //     const level = row.getValue("level") as number;
  //     return <span className="text-sm">{level}</span>;
  //   },
  // },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Created" />
  //   ),
  //   cell: ({ row }) => {
  //     const date = row.getValue("createdAt") as string;
  //     return (
  //       <div className="text-sm text-muted-foreground">
  //         {format(new Date(date), "MMM dd, yyyy")}
  //       </div>
  //     );
  //   },
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(category.id.toString())
              }
            >
              Copy category ID
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/categories/${category.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/categories/${category.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit category
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/categories/${category.id}/products`}>
                <Package className="mr-2 h-4 w-4" />
                Manage products
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
