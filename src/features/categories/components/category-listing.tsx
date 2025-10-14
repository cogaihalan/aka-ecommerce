import { serverUnifiedCategoryService } from "@/lib/api/services/server";
import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "@/features/categories/components/category-tables/columns";
import { convertSortToApiParams } from "@/lib/utils/sort-conversion";

type CategoryListingPage = {};

export default async function CategoryListingPage({}: CategoryListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const isActive = searchParamsCache.get("isActive");
  const parentId = searchParamsCache.get("parentId");
  const sort = searchParamsCache.get("sort");

  const sortParams = convertSortToApiParams(sort);

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...sortParams,
    ...(isActive !== undefined && {
      filters: { isActive: isActive === "true" },
    }),
    ...(parentId && { filters: { parentId: parseInt(parentId, 10) } }),
  };

  const data = await serverUnifiedCategoryService.getCategories(filters);
  const totalCategories = Array.isArray(data)
    ? data.length
    : data.pagination.total;
  const categories = Array.isArray(data) ? data : data.categories;

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
