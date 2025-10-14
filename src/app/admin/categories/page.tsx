import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import CategoryListingPage from "@/features/categories/components/category-listing";
import { searchParamsCache } from "@/lib/searchparams";
import { cn } from "@/lib/utils";
import { Plus, TreePine } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { DashboardPageProps } from "@/types";

export const metadata = {
  title: "Dashboard: Categories",
  description: "Manage product categories and their hierarchy",
};

export default async function Page(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Categories"
            description="Manage product categories and their hierarchy"
          />
          <div className="flex items-center space-x-2">
            <Link
              href="/admin/categories/tree"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "text-xs md:text-sm"
              )}
            >
              <TreePine className="mr-2 h-4 w-4" />
              Tree View
            </Link>
            <Link
              href="/admin/categories/new"
              className={cn(buttonVariants(), "text-xs md:text-sm")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </div>
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={8} rowCount={8} filterCount={3} />
          }
        >
          <CategoryListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
