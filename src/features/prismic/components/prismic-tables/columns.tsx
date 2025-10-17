"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { PrismicContent } from "@/types/prismic";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, FileText, Calendar, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const STATUS_OPTIONS = [
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
];

const TYPE_OPTIONS = [
  { label: "Page", value: "page" },
  { label: "Static Page", value: "static_page" },
];

export const columns: ColumnDef<PrismicContent>[] = [
  {
    id: "title",
    accessorKey: "data.title",
    header: ({ column }: { column: Column<PrismicContent, unknown> }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const data = row.original.data as any;
      const title = data?.title || data?.name || "Untitled";
      return <div className="font-medium max-w-[200px] truncate">{title}</div>;
    },
    meta: {
      label: "name",
      placeholder: "Search pages...",
      variant: "text",
      icon: FileText,
    },
    enableColumnFilter: true,
  },
  {
    id: "uid",
    accessorKey: "uid",
    header: ({ column }: { column: Column<PrismicContent, unknown> }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
    cell: ({ row }) => {
      const uid = row.original.uid;
      return (
        <div className="text-muted-foreground font-mono text-sm">/{uid}</div>
      );
    },
    meta: {
      label: "Slug",
      placeholder: "Search slugs...",
      variant: "text",
      icon: Tag,
    },
    enableColumnFilter: true,
  },
  {
    id: "status",
    accessorKey: "data.status",
    header: ({ column }: { column: Column<PrismicContent, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const data = row.original.data as any;
      const status = data?.status || "draft";
      return (
        <Badge
          variant={status === "published" ? "default" : "secondary"}
          className="capitalize"
        >
          {status}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Status",
      variant: "select",
      options: STATUS_OPTIONS,
    },
  },
  {
    id: "type",
    accessorKey: "type",
    header: ({ column }: { column: Column<PrismicContent, unknown> }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <Badge variant="outline" className="capitalize">
          {type}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "category",
      variant: "select",
      options: TYPE_OPTIONS,
    },
  },
  {
    id: "last_publication_date",
    accessorKey: "last_publication_date",
    header: ({ column }: { column: Column<PrismicContent, unknown> }) => (
      <DataTableColumnHeader column={column} title="Last Modified" />
    ),
    cell: ({ row }) => {
      const date = row.original.last_publication_date;
      return (
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </div>
      );
    },
    meta: {
      label: "Last Modified",
      variant: "date",
      icon: Calendar,
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const page = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const baseUrl = window.location.origin;
              window.open(`${baseUrl}${page.url}`, "_blank");
            }}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              window.open(
                `${process.env.NEXT_PUBLIC_PRISMIC_URL}/builder/pagesdo/${page.id}`,
                "_blank"
              )
            }
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
