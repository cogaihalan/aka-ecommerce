"use client";

import { Course } from "@/types/extensions/course";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play } from "lucide-react";
import { formatDuration } from "@/lib/format";
import Image from "next/image";

interface CourseCardProps {
  course: Course;
  onWatch: () => void;
}

export function CourseCard({ course, onWatch }: CourseCardProps) {
  return (
    <Card disableBlockPadding={true} className="group hover:shadow-lg transition-shadow">
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        <Image
          src={course.thumbnailUrl || "/assets/placeholder-image.jpeg"}
          alt={course.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/40 transition-colors cursor-pointer">
          <Button
            variant="default"
            size="sm"
            onClick={onWatch}
            disabled={!course.active}
          >
            <Play className="h-6 w-6 text-white" />
          </Button>
        </div>
        
        {course.duration && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/80 text-white">
              <Clock className="h-3 w-3 mr-1" />
              {formatDuration(course.duration)}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-2">{course.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {course.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
