import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./product-tables/columns";
import { serverUnifiedProductService } from "@/lib/api/services/server";

export default async function ProductListingPage() {
  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");

  // Build query parameters for the service using new structure
  const queryParams = {
    page: page ? parseInt(page.toString()) : 0,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    sort: sort
      ? Array.isArray(sort)
        ? [`${sort[0]?.id},${sort[0]?.desc ? "desc" : "asc"}`]
        : [`${(sort as any).id},${(sort as any).desc ? "desc" : "asc"}`]
      : undefined,
    name: search?.toString(),
  };

  // Fetch products using the unified service
  let result;
  let totalProducts = 0;
  let products: any[] = [];

  try {
    result = await serverUnifiedProductService.getProducts(queryParams);
    totalProducts = result.pagination?.total || result.items?.length || 0;
    products = result.items || [];
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <DataTableWrapper
      data={products}
      totalItems={totalProducts}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
