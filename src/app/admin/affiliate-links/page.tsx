import { Metadata } from "next";
import { Suspense } from "react";
import AffiliateLinksListingPage from "@/features/affiliate-links/components/affiliate-links-listing";
import PageContainer from "@/components/layout/page-container";
import { searchParamsCache } from "@/lib/searchparams";
import { DashboardPageProps } from "@/types";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

export const metadata: Metadata = {
  title: "Bảng quản trị: Affiliate Links",
  description: "Quản lý affiliate links",
};

export default async function Page(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Affiliate Links"
            description="Quản lý affiliate links của hệ thống."
          />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
          }
        >
          <AffiliateLinksListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}

