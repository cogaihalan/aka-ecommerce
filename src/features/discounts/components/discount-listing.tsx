import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { discountColumns } from "./discount-tables/columns";
import { unifiedDiscountService } from "@/lib/api/services/unified";
import { DiscountRuleListParams } from "@/types/discount";
import { convertSortToApiParams } from "@/lib/utils/sort-conversion";

export default async function DiscountListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const isActive = searchParamsCache.get("isActive");
  const couponType = searchParamsCache.get("couponType");
  const sort = searchParamsCache.get("sort");

  const sortParams = convertSortToApiParams(sort);

  const filters: DiscountRuleListParams = {
    ...(page && { page: parseInt(page.toString()) }),
    ...(pageLimit && { limit: parseInt(pageLimit.toString()) }),
    ...(search && { search }),
    ...sortParams,
    ...((isActive !== null || couponType) && {
      filters: {
        ...(isActive !== null && { isActive: isActive === "true" }),
        ...(couponType && { couponType: couponType as any }),
      },
    }),
  };

  // Fetch discount rules from API
  const result = await unifiedDiscountService.getDiscountRules(filters);
  const totalDiscounts = result.pagination.total;
  const discounts = result.data;

  return (
    <DataTableWrapper
      data={discounts}
      totalItems={totalDiscounts}
      columns={discountColumns}
      debounceMs={500}
      shallow={false}
    />
  );
}
