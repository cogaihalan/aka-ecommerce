import { Metadata } from "next";
import { Suspense } from "react";
import { searchParamsCache } from "@/lib/searchparams";
import { DashboardPageProps } from "@/types";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import PageContainer from "@/components/layout/page-container";
import SubmissionListingPage from "@/features/submissions/components/submission-listing";

export const metadata: Metadata = {
  title: "Bài dự thi - Quản trị",
  description: "Xem xét và kiểm duyệt bài dự thi của người dùng",
};

export default async function SubmissionsPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Bài dự thi" description="Xem xét và kiểm duyệt bài dự thi." />
        </div>
        <Separator />
        <Suspense fallback={<DataTableSkeleton columnCount={6} rowCount={8} filterCount={3} />}>
          <SubmissionListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}


