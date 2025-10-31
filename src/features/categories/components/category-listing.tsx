import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./category-tables/columns";
import { serverUnifiedCategoryService } from "@/lib/api/services/server";
import { Category } from "@/types/app";

export default async function CategoryListingPage() {
  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");

  // Build query parameters for the service using new structure
  const queryParams = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    sort: sort && sort.length > 0
      ? sort.map(item => `${item.id},${item.desc ? "desc" : "asc"}`)
      : undefined,
    name: search?.toString(),
  };

  // Fetch categories using the unified service
  let categories: Category[] = [];
  let totalCategories = 0;

  try {
    const categoriesResponse =
      await serverUnifiedCategoryService.getCategories(queryParams);
    categories = categoriesResponse.items;
    totalCategories = categoriesResponse.pagination.total;
  } catch (error: unknown) {
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
