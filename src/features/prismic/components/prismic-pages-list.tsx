import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./prismic-tables/columns";
import { prismicApiService } from "@/lib/api/prismic-service";

interface PrismicPagesListProps {
  forceRefresh?: boolean;
}

export async function PrismicPagesList({
  forceRefresh = false,
}: PrismicPagesListProps = {}) {
  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name"); // Use 'name' instead of 'title' to match existing search params
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");
  const type = searchParamsCache.get("category"); // Use 'category' as a workaround for type
  const sort = searchParamsCache.get("sort");
  const timestamp = searchParamsCache.get("t"); // Get timestamp parameter for cache busting

  // Build filters object with proper type casting
  const filters: {
    search?: string;
    status?: string;
    type?: string;
    sort?: Array<{ id: string; desc: boolean }>;
  } = {};

  if (search && typeof search === "string") {
    filters.search = search;
  }
  if (status && status !== "all" && typeof status === "string") {
    filters.status = status;
  }
  if (type && type !== "all" && typeof type === "string") {
    filters.type = type;
  }
  if (sort) {
    filters.sort = Array.isArray(sort) ? sort : [sort];
  }

  // Force refresh if timestamp parameter is present or forceRefresh is true
  const shouldForceRefresh = forceRefresh || !!timestamp;

  // Fetch pages from Prismic API with filters
  const data = await prismicApiService.getPages(
    page || 1,
    pageLimit || 10,
    Object.keys(filters).length > 0 ? filters : undefined,
    shouldForceRefresh
  );

  return (
    <DataTableWrapper
      data={data.results}
      totalItems={data.total_results_size}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
