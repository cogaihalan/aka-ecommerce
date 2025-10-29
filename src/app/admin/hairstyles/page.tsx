import { Metadata } from "next";
import { Suspense } from "react";
import { AddHairstyleButton } from "@/features/hairstyles/components/add-hairstyle-button";
import HairstyleListingPage from "@/features/hairstyles/components/hairstyle-listing";
import PageContainer from "@/components/layout/page-container";
import { searchParamsCache } from "@/lib/searchparams";
import { DashboardPageProps } from "@/types";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

export const metadata: Metadata = {
  title: "Hairstyles",
  description: "Manage hairstyles and barber content for your platform",
};

export default async function HairstylesPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Hairstyles"
            description="Manage hairstyles and barber content for your platform."
          />
          <AddHairstyleButton />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={3} />
          }
        >
          <HairstyleListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
