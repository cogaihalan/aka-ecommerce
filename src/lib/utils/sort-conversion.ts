import { ExtendedColumnSort } from "@/types/data-table";

/**
 * Convert sort array to sortBy and sortOrder parameters for API compatibility
 */
export function convertSortToApiParams(
  sort: ExtendedColumnSort<any>[] | undefined
) {
  if (!sort || sort.length === 0) {
    return {};
  }

  // Use the first sort item for API compatibility
  const firstSort = sort[0];
  return {
    sortBy: firstSort.id,
    sortOrder: firstSort.desc ? "desc" : ("asc" as "asc" | "desc"),
  };
}

/**
 * Convert sort array to multiple sort parameters for advanced APIs
 */
export function convertSortToAdvancedApiParams(
  sort: ExtendedColumnSort<any>[] | undefined
) {
  if (!sort || sort.length === 0) {
    return {};
  }

  const sortParams: Record<string, any> = {};

  sort.forEach((sortItem, index) => {
    sortParams[`sort[${index}][id]`] = sortItem.id;
    sortParams[`sort[${index}][desc]`] = sortItem.desc.toString();
  });

  return sortParams;
}
