"use client";

import { Course } from "@/types/course";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Lock } from "lucide-react";
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
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Play className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
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
      
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <Badge variant={course.isActive ? "default" : "secondary"}>
            {course.isActive ? "Available" : "Coming Soon"}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onWatch}
            disabled={!course.isActive}
          >
            {!course.isActive ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Locked
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Watch
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
