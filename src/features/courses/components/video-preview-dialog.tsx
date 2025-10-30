"use client";

import { useState } from "react";
import type { Course } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoPlayer } from "../../../components/video-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Play } from "lucide-react";
import { format } from "date-fns";
import { formatDuration } from "@/lib/format";

interface VideoPreviewDialogProps {
  course: Course;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoPreviewDialog({
  course,
  open,
  onOpenChange,
}: VideoPreviewDialogProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handlePlayClick = () => {
    setIsVideoLoaded(true);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setIsVideoLoaded(false); // Reset when dialog closes
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {course.name}
            <Badge variant={course.active ? "default" : "secondary"}>
              {course.active ? "Active" : "Inactive"}
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
              <span>Tạo {format(new Date(course.createdAt), "MMM dd, yyyy")}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">{course.description}</p>
          
          <div className="aspect-video w-full relative bg-black rounded-lg overflow-hidden">
            {!isVideoLoaded ? (
              // Show thumbnail with play button
              <div className="relative w-full h-full group cursor-pointer" onClick={handlePlayClick}>
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Xem video</p>
                    </div>
                  </div>
                )}
                
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <Button
                    size="lg"
                    className="rounded-full bg-white/90 hover:bg-white text-black shadow-lg hover:shadow-xl transition-all"
                  >
                    <Play className="h-6 w-6 mr-2" />
                    Phát video
                  </Button>
                </div>
              </div>
            ) : (
              // Show video player
              <VideoPlayer
                src={course.videoUrl}
                title={course.name}
                poster={course.thumbnailUrl}
                controls
                autoPlay={true}
                onTimeUpdate={(time) => console.log("Current time:", time)}
                onDurationChange={(duration) => console.log("Duration:", duration)}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
