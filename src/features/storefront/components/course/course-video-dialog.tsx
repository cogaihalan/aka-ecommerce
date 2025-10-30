import { VideoPlayer } from "@/components/video-player";
import { Course } from "@/types/extensions/course";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left max-w-4/5">
            {course.name}
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
                Ngày tạo: {format(new Date(course.createdAt), "MMM dd, yyyy")}
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
