import { Metadata } from "next";
import { Suspense } from "react";
import { CourseGrid } from "@/features/storefront/components/course/course-grid";
import { CourseFilters } from "@/features/storefront/components/course/course-filters";
import { CourseGridSkeleton } from "@/features/storefront/components/course/course-grid-skeleton";
import { CourseFiltersSkeleton } from "@/features/storefront/components/course/course-filters-skeleton";
import { searchParamsCache } from "@/lib/searchparams";
import { serverUnifiedCourseService } from "@/lib/api/services/server";
import { QueryParams } from "@/lib/api/types";

export const metadata: Metadata = {
  title: "Courses",
  description: "Browse our collection of video courses and tutorials",
};

interface CoursesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    perPage?: string;
    sort?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  searchParamsCache.parse(params);

  const courseParams: QueryParams = {
    page: params.page ? parseInt(params.page) : 1,
    size: params.perPage ? parseInt(params.perPage) : 10,
    sort: params.sort ? [`${params.sort},desc`] : ["createdAt,desc"],
    name: params.search?.toString(),
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
            <CourseGrid courses={data.items} total={data.pagination.total} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
