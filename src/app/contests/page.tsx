import { Metadata } from "next";
import { Suspense } from "react";
import { ContestGrid } from "@/features/storefront/components/contest/contest-grid";
import { ContestFilters } from "@/features/storefront/components/contest/contest-filters";
import { ContestGridSkeleton } from "@/features/storefront/components/contest/contest-grid-skeleton";
import { ContestFiltersSkeleton } from "@/features/storefront/components/contest/contest-filters-skeleton";
import { searchParamsCache } from "@/lib/searchparams";
import { storefrontServerContestService } from "@/lib/api/services/storefront/extensions/contests/contest";
import { QueryParams } from "@/lib/api/types";

export const metadata: Metadata = {
  title: "Cuộc thi",
  description: "Khám phá bộ sưu tập cuộc thi và chương trình thi đua",
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

  const data = await storefrontServerContestService.getContests(contestParams);

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cuộc thi</h1>
        <p className="text-muted-foreground">Khám phá bộ sưu tập cuộc thi và chương trình thi đua</p>
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
