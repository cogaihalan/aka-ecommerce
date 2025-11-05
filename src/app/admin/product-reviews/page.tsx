import { Metadata } from "next";
import { Suspense } from "react";
import { searchParamsCache } from "@/lib/searchparams";
import { DashboardPageProps } from "@/types";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import PageContainer from "@/components/layout/page-container";
import ProductReviewsListingPage from "@/features/product-reviews/components/product-reviews-listing";

export const metadata: Metadata = {
  title: "Đánh giá sản phẩm - Quản trị",
  description: "Quản lý và kiểm duyệt đánh giá sản phẩm",
};

export default async function ProductReviewsPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Đánh giá sản phẩm"
            description="Quản lý và kiểm duyệt đánh giá sản phẩm của người dùng."
          />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={7} rowCount={8} filterCount={3} />
          }
        >
          <ProductReviewsListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}

