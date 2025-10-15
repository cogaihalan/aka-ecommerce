import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./category-tables/columns";
import { serverUnifiedCategoryService } from "@/lib/api/services/server";

export default async function CategoryListingPage() {
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

  // Fetch categories using the unified service
  let categories: any[] = [];
  let totalCategories = 0;

  try {
    categories = await serverUnifiedCategoryService.getCategories(queryParams);
    totalCategories = categories.length;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <DataTableWrapper
      data={categories}
      totalItems={totalCategories}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
