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
  title: "Dashboard: Contests",
  description: "Manage contests and competitions for your platform",
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
            title="Contests"
            description="Manage contests and competitions for your platform."
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
