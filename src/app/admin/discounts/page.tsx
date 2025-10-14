import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import DiscountListing from "@/features/discounts/components/discount-listing";
import { searchParamsCache } from "@/lib/searchparams";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardPageProps } from "@/types";

export const metadata = {
  title: "Dashboard: Discounts",
  description: "Manage discount rules and promotional codes",
};

export default async function DiscountsPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Discounts"
            description="Manage discount rules and promotional codes"
          />
          <div className="flex items-center space-x-2">
            <Link
              href="/admin/discounts/new"
              className={cn(buttonVariants(), "text-xs md:text-sm")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Discount
            </Link>
          </div>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={8} rowCount={8} filterCount={3} />
          }
        >
          <DiscountListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
