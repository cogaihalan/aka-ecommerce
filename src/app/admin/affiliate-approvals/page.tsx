import { Metadata } from "next";
import { Suspense } from "react";
import AffiliateApprovalListingPage from "@/features/affiliate-approvals/components/affiliate-approval-listing";
import PageContainer from "@/components/layout/page-container";
import { searchParamsCache } from "@/lib/searchparams";
import { DashboardPageProps } from "@/types";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

export const metadata: Metadata = {
  title: "Bảng quản trị: Duyệt Affiliate",
  description: "Quản lý và duyệt các yêu cầu affiliate",
};

export default async function Page(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Duyệt Affiliate"
            description="Quản lý và duyệt các yêu cầu đăng ký affiliate."
          />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={2} />
          }
        >
          <AffiliateApprovalListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}

