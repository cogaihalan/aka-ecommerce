import { Metadata } from "next";
import { Suspense } from "react";
import { AddCategoryButton } from "@/features/categories/components/add-category-button";
import PageContainer from "@/components/layout/page-container";
import { searchParamsCache } from "@/lib/searchparams";
import { DashboardPageProps } from "@/types";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import CategoryListingPage from "@/features/categories/components/category-listing";

export const metadata: Metadata = {
  title: "Dashboard: Categories",
  description: "Manage categories for your store",
};

export default async function Page(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Categories"
            description="Manage categories for your store."
          />
          <AddCategoryButton />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <CategoryListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
