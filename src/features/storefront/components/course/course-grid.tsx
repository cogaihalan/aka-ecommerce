"use client";

import { useState } from "react";
import { Course } from "@/types/course";
import { CourseCard } from "./course-card";
import { CourseVideoDialog } from "./course-video-dialog";

interface CourseGridProps {
  courses: Course[];
  total: number;
}

export function CourseGrid({ courses, total }: CourseGridProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {courses.length} of {total} courses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onWatch={() => setSelectedCourse(course)}
          />
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No courses found</p>
        </div>
      )}

      <CourseVideoDialog
        course={selectedCourse}
        open={!!selectedCourse}
        onOpenChange={(open) => !open && setSelectedCourse(null)}
      />
    </div>
  );
}
