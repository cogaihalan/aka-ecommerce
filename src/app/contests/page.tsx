import { Metadata } from "next";
import { Suspense } from "react";
import { ContestGrid } from "@/features/storefront/components/contest/contest-grid";
import { ContestFilters } from "@/features/storefront/components/contest/contest-filters";
import { ContestGridSkeleton } from "@/features/storefront/components/contest/contest-grid-skeleton";
import { ContestFiltersSkeleton } from "@/features/storefront/components/contest/contest-filters-skeleton";
import { searchParamsCache } from "@/lib/searchparams";
import { serverUnifiedContestService } from "@/lib/api/services/server";
import { QueryParams } from "@/lib/api/types";

export const metadata: Metadata = {
  title: "Contests",
  description: "Browse our collection of contests and competitions",
};

interface ContestPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    perPage?: string;
    sort?: string;
  }>;
}

export default async function ContestPage({ searchParams }: ContestPageProps) {
  const params = await searchParams;
  searchParamsCache.parse(params);

  const contestParams: QueryParams = {
    page: params.page ? parseInt(params.page) : 1,
    size: params.perPage ? parseInt(params.perPage) : 10,
    sort: params.sort ? [params.sort] : ["createdAt,desc"],
    name: params.search?.toString(),
    active: true,
  };

  const data = await serverUnifiedContestService.getContests(contestParams);


  console.log(data);
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contests</h1>
        <p className="text-muted-foreground">
          Discover our collection of contests and competitions
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <Suspense fallback={<ContestFiltersSkeleton />}>
            <ContestFilters />
          </Suspense>
        </div>

        <div className="lg:w-3/4">
          <Suspense fallback={<ContestGridSkeleton />}>
            <ContestGrid contests={data.items} total={data.pagination.total} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
