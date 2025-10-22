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
  Eye,
  EyeOff,
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
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Course Name" />
    ),
    cell: ({ row }) => {
      const course = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="font-medium">{course.name}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </div>
        </div>
      );
    },
    meta: {
      label: "Course Name",
      placeholder: "Search courses...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
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
    accessorKey: "status",
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue("active") as string;
      return <Badge variant={isActive === "ACTIVE" ? "default" : "secondary"}>{isActive === "ACTIVE" ? "Active" : "Inactive"}</Badge>;
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(date), "MMM dd, yyyy")}</span>
        </div>
      );
    },
    meta: {
      label: "Created",
      variant: "date",
      icon: Calendar,
    },
    enableColumnFilter: true,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as string;
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
      const course = row.original;
      const [showVideoPreview, setShowVideoPreview] = useState(false);
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
              <DropdownMenuItem
                onClick={() => setShowVideoPreview(true)}
                className="cursor-pointer"
              >
                <Play className="mr-2 h-4 w-4" />
                Preview Video
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowEditDialog(true)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Course
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
          />
        </>
      );
    },
  },
];
