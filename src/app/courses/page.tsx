import { Metadata } from "next";
import { Suspense } from "react";
import { CourseGrid } from "@/features/storefront/components/course/course-grid";
import { CourseFilters } from "@/features/storefront/components/course/course-filters";
import { CourseGridSkeleton } from "@/features/storefront/components/course/course-grid-skeleton";
import { CourseFiltersSkeleton } from "@/features/storefront/components/course/course-filters-skeleton";
import { searchParamsCache } from "@/lib/searchparams";
import { serverUnifiedCourseService } from "@/lib/api/services/server";
import { CourseListParams } from "@/types/course";

export const metadata: Metadata = {
  title: "Courses",
  description: "Browse our collection of video courses and tutorials",
};

interface CoursesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    isActive?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  searchParamsCache.parse(params);

  const courseParams: CourseListParams = {
    page: params.page ? parseInt(params.page) : 1,
    search: params.search,
    sortBy: params.sortBy || "createdAt",
    sortOrder: (params.sortOrder as "asc" | "desc") || "desc",
    filters: {
      isActive: true, // Always show only active courses
    },
  };

  const data = await serverUnifiedCourseService.getCourses(courseParams);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Courses</h1>
        <p className="text-muted-foreground">
          Discover our collection of video courses and tutorials
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <Suspense fallback={<CourseFiltersSkeleton />}>
            <CourseFilters />
          </Suspense>
        </div>

        <div className="lg:w-3/4">
          <Suspense fallback={<CourseGridSkeleton />}>
            <CourseGrid courses={data.courses} total={data.total} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
