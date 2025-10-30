"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Contest } from "@/types/extensions/contest";
import { MoreHorizontal, Edit, Text, Calendar, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState } from "react";
import { ContestDialog } from "../contest-dialog";
import Image from "next/image";

export const columns: ColumnDef<Contest>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }: { column: Column<Contest, unknown> }) => (
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
      <DataTableColumnHeader column={column} title="Contest Name" />
    ),
    cell: ({ row }) => {
      const contest = row.original;
      return (
        <div className="max-w-45 font-medium line-clamp-2 whitespace-normal">
          {contest.name}
        </div>
      );
    },
    meta: {
      label: "Contest Name",
      placeholder: "Search contests...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
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
    id: "status",
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.active;
      const now = new Date();
      const startDate = new Date(row.original.startDate);
      const endDate = new Date(row.original.endDate);

      let statusText = isActive ? "Active" : "Inactive";
      let variant: "default" | "secondary" | "destructive" | "outline" =
        isActive ? "default" : "secondary";

      if (isActive) {
        if (now < startDate) {
          statusText = "Upcoming";
          variant = "outline";
        } else if (now > endDate) {
          statusText = "Ended";
          variant = "secondary";
        } else {
          statusText = "Live";
          variant = "default";
        }
      }

      return <Badge variant={variant}>{statusText}</Badge>;
    },
    meta: {
      label: "Status",
      variant: "select",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
      ],
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const date = row.getValue("startDate") as string;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(date), "MMM dd, yyyy")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const date = row.getValue("endDate") as string;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(date), "MMM dd, yyyy")}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contest = row.original;
      const [showEditDialog, setShowEditDialog] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowEditDialog(true)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Contest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ContestDialog
            contest={contest}
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
