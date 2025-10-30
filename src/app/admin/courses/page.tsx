import { Metadata } from "next";
import { Suspense } from "react";
import { AddCourseButton } from "@/features/courses/components/add-course-button";
import CourseListingPage from "@/features/courses/components/course-listing";
import PageContainer from "@/components/layout/page-container";
import { searchParamsCache } from "@/lib/searchparams";
import { DashboardPageProps } from "@/types";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

export const metadata: Metadata = {
  title: "Bảng quản trị: Khoá học",
  description: "Quản lý khoá học và nội dung video cho nền tảng",
};

export default async function CoursesPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Khoá học"
            description="Quản lý khoá học và nội dung video cho nền tảng."
          />
          <AddCourseButton />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <CourseListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
