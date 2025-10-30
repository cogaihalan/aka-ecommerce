import { Metadata } from "next";
import { Suspense } from "react";
import { AddContestButton } from "@/features/contests/components/add-contest-button";
import ContestListingPage from "@/features/contests/components/contest-listing";
import PageContainer from "@/components/layout/page-container";
import { searchParamsCache } from "@/lib/searchparams";
import { DashboardPageProps } from "@/types";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

export const metadata: Metadata = {
  title: "Bảng quản trị: Cuộc thi",
  description: "Quản lý các cuộc thi và chương trình thi đua cho nền tảng",
};

export default async function ContestPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Cuộc thi"
            description="Quản lý các cuộc thi và chương trình thi đua cho nền tảng."
          />
          <AddContestButton />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
          }
        >
          <ContestListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
