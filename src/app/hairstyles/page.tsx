import { Metadata } from "next";
import { Suspense } from "react";
import { HairstyleGrid } from "@/features/storefront/components/hairstyle/hairstyle-grid";
import { HairstyleFilters } from "@/features/storefront/components/hairstyle/hairstyle-filters";
import { HairstyleGridSkeleton } from "@/features/storefront/components/hairstyle/hairstyle-grid-skeleton";
import { HairstyleFiltersSkeleton } from "@/features/storefront/components/hairstyle/hairstyle-filters-skeleton";
import { searchParamsCache } from "@/lib/searchparams";
import { serverStorefrontHairstyleService } from "@/lib/api/services/server/extensions/storefront-hairstyles";
import { QueryParams } from "@/lib/api/types";

interface HairstylesPageProps {
  searchParams: Promise<{
    page?: string;
    perPage?: string;
    search?: string;
    gender?: string;
    barberName?: string;
    sort?: string;
  }>;
}

export default async function HairstylesPage({
  searchParams,
}: HairstylesPageProps) {
  const params = await searchParams;
  searchParamsCache.parse(params);

  const hairstyleParams: QueryParams = {
    page: params.page ? parseInt(params.page) : 1,
    size: params.perPage ? parseInt(params.perPage) : 12,
    sort: params.sort ? [params.sort] : ["createdAt,desc"],
    name: params.search?.toString(),
    gender: params.gender?.toString(),
    barberName: params.barberName?.toString(),
  };

  const data =
    await serverStorefrontHairstyleService.getHairstyles(hairstyleParams);

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hairstyles</h1>
        <p className="text-muted-foreground">
          Discover our collection of hairstyles and barber work
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <Suspense fallback={<HairstyleFiltersSkeleton />}>
            <HairstyleFilters />
          </Suspense>
        </div>

        <div className="lg:w-3/4">
          <Suspense fallback={<HairstyleGridSkeleton />}>
            <HairstyleGrid
              hairstyles={data.items}
              total={data.pagination.total}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
