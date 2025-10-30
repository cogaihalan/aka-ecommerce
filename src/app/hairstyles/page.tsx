import { Metadata } from "next";
import { Suspense } from "react";
import { HairstyleGrid } from "@/features/storefront/components/hairstyle/hairstyle-grid";
import { HairstyleFilters } from "@/features/storefront/components/hairstyle/hairstyle-filters";
import { HairstyleGridSkeleton } from "@/features/storefront/components/hairstyle/hairstyle-grid-skeleton";
import { HairstyleFiltersSkeleton } from "@/features/storefront/components/hairstyle/hairstyle-filters-skeleton";
import { searchParamsCache } from "@/lib/searchparams";
import { storefrontServerHairstyleService } from "@/lib/api/services/storefront/extensions/hairstyles/hairstyles";
import { QueryParams } from "@/lib/api/types";

export const metadata: Metadata = {
  title: "Kiểu tóc",
  description: "Khám phá bộ sưu tập kiểu tóc và tác phẩm barber",
};

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
    sort: params.sort ? [params.sort] : [""],
    name: params.search?.toString(),
    gender: params.gender?.toString(),
    barberName: params.barberName?.toString(),
  };

  const data =
    await storefrontServerHairstyleService.getHairstyles(hairstyleParams);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Kiểu tóc</h1>
        <p className="text-muted-foreground">Khám phá bộ sưu tập kiểu tóc và tác phẩm barber</p>
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
