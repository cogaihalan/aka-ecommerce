import { VideoPlayer } from "@/components/video-player";
import { Course } from "@/types/course";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { formatDuration } from "@/lib/format";

interface CourseVideoDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseVideoDialog({
  course,
  open,
  onOpenChange,
}: CourseVideoDialogProps) {
  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {course.name}
            <Badge variant={course.isActive ? "default" : "secondary"}>
              {course.isActive ? "Active" : "Inactive"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Created {format(new Date(course.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{course.description}</p>

          <div className="aspect-video w-full">
            <VideoPlayer
              src={course.videoUrl}
              title={course.name}
              poster={course.thumbnailUrl}
              controls
              autoPlay={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
