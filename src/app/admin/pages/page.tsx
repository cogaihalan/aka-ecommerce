import { Suspense } from "react";
import { DashboardPageProps } from "@/types";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { PrismicPagesList } from "@/features/prismic/components/prismic-pages-list";
import { PrismicRefreshButton } from "@/features/prismic/components/prismic-refresh-button";
import { searchParamsCache } from "@/lib/searchparams";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

export const metadata = {
  title: "Content Pages",
  description: "Manage static pages and content using Prismic CMS",
};

export default async function PrismicPagesPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Content Pages"
            description="Manage static pages and content using Prismic CMS"
          />
          <PrismicRefreshButton />
        </div>
        <Separator />

        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <PrismicPagesList />
        </Suspense>
      </div>
    </PageContainer>
  );
}
