"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { Course } from "@/types/course";
import {
  MoreHorizontal,
  Play,
  Edit,
  Trash2,
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
import { unifiedCourseService } from "@/lib/api/services/unified";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const columns: ColumnDef<Course>[] = [
  {
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
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? (
            <>
              <Eye className="mr-1 h-3 w-3" />
              Active
            </>
          ) : (
            <>
              <EyeOff className="mr-1 h-3 w-3" />
              Inactive
            </>
          )}
        </Badge>
      );
    },
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
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const course = row.original;
      const [showVideoPreview, setShowVideoPreview] = useState(false);
      const [showEditDialog, setShowEditDialog] = useState(false);
      const router = useRouter();

      const handleDeleteCourse = async () => {
        if (
          window.confirm(
            `Are you sure you want to delete "${course.name}"? This action cannot be undone.`
          )
        ) {
          try {
            await unifiedCourseService.deleteCourse(course.id);
            toast.success("Course deleted successfully");
            router.refresh();
          } catch (error) {
            toast.error("Failed to delete course");
            console.error("Error deleting course:", error);
          }
        }
      };

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
              <DropdownMenuItem
                onClick={handleDeleteCourse}
                className="cursor-pointer text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Course
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
