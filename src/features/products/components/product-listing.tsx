import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./product-tables/columns";
import { serverUnifiedProductService } from "@/lib/api/services/server";
import { ProductStatus } from "@/types";

export default async function ProductListingPage() {
  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const status = searchParamsCache.get("status");

  // Build query parameters for the service using new structure
  const queryParams = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    sort: sort && sort.length > 0
      ? sort.map(item => `${item.id},${item.desc ? "desc" : "asc"}`)
      : undefined,
    name: search?.toString(),
    statuses: status?.toString() ? [status?.toString()] : undefined,
  };

  // Fetch products using the unified service
  let totalProducts = 0;
  let products: any[] = [];

  try {
    const response = await serverUnifiedProductService.getProducts(queryParams);
    totalProducts = response.pagination?.total || response.items?.length || 0;
    products = response.items || [];
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
