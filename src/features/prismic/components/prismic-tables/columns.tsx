"use client";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { PrismicContent } from "@/types/prismic";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const convertUIDToPageTitle = (uid: string) => {
  return uid.replace(/-/g, " ").replace(/_/g, " ");
};

export const columns: ColumnDef<PrismicContent>[] = [
  {
    id: "name",
    accessorKey: "data.title",
    header: "Tiêu đề",
    cell: ({ row }) => {
      const uid = row.original.uid as string;
      const data = row.original.data as any;
      const title = data?.meta_title || convertUIDToPageTitle(uid);
      return <div className="font-medium max-w-[200px] truncate capitalize">{title}</div>;
    },
  },
  {
    accessorKey: "uid",
    header: "UID (Unique Identifier)",
    cell: ({ row }) => {
      const uid = row.original.uid;
      return (
        <div className="text-primary text-sm">/{uid}</div>
      );
    },
  },
  {
    id: "url",
    accessorKey: "url",
    header: "URL (Uniform Resource Locator)",
    cell: ({ row }) => {
      const url = row.original.url;
      return (
        <div className="text-primary font-medium text-sm">{url}</div>
      );
    },
  },
  {
    id: "last_publication_date",
    accessorKey: "last_publication_date",
    header: ({ column }: { column: Column<PrismicContent, unknown> }) => (
      <DataTableColumnHeader column={column} title="Cập nhật lúc" />
    ),
    cell: ({ row }) => {
      const date = row.original.last_publication_date;
      return (
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(date), { addSuffix: true })}
        </div>
      );
    }
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
                `${process.env.NEXT_PUBLIC_PRISMIC_URL}/builder/pages/${page.id}`,
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
