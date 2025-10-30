import { Suspense } from "react";
import { Metadata } from "next";
import { searchParamsCache } from "@/lib/searchparams";
import { storefrontServerSubmissionService } from "@/lib/api/services/storefront/extensions/submissions/submissions";
import type { QueryParams } from "@/lib/api/types";
import { SubmissionFilters } from "@/features/storefront/components/submission/submission-filters";
import SubmissionFiltersSkeleton from "@/features/storefront/components/submission/submission-filters-skeleton";
import { SubmissionGrid } from "@/features/storefront/components/submission/submission-grid";
import SubmissionGridSkeleton from "@/features/storefront/components/submission/submission-grid-skeleton";

export const metadata: Metadata = {
  title: "Bài dự thi - AKA Store",
  description: "Khám phá bài dự thi từ cộng đồng và bình chọn mục yêu thích.",
};

interface SubmissionsPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function SubmissionsPage({ searchParams }: SubmissionsPageProps) {
  const params = await searchParams;
  searchParamsCache.parse(params as any);

  const query: QueryParams = {
    page: params.page ? parseInt(params.page) : 1,
    size: params.perPage ? parseInt(params.perPage) : 12,
    sort: params.sort ? [params.sort] : ["voteCount,desc"],
    name: params.search?.toString(),
    status: params.status && params.status !== "all" ? params.status : undefined,
  } as any;

  const data = await storefrontServerSubmissionService.getSubmissions(query);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bài dự thi</h1>
        <p className="text-muted-foreground">Khám phá bài dự thi từ cộng đồng và bình chọn mục yêu thích</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <Suspense fallback={<SubmissionFiltersSkeleton />}>
            <SubmissionFilters />
          </Suspense>
        </div>

        <div className="lg:w-3/4">
          <Suspense fallback={<SubmissionGridSkeleton />}>
            <SubmissionGrid submissions={data.items} total={data.pagination.total} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}


