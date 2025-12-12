import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./affiliate-tables/columns";
import { serverAffiliateService } from "@/lib/api/services/server";
import type { QueryParams } from "@/lib/api/types";
import { AffiliateAccount } from "@/types";

export default async function AffiliateListingPage() {
  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const affiliateId = searchParamsCache.get("affiliateId");
  const affiliateCode = searchParamsCache.get("affiliateCode");

  // Build query parameters for the service using new structure
  const queryParams: QueryParams = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    sort: sort && sort.length > 0
      ? sort.map(item => `${item.id},${item.desc ? "desc" : "asc"}`)
      : undefined,
    affiliateId: affiliateId ? parseInt(affiliateId.toString()) : undefined,
    affiliateCode: affiliateCode?.toString(),
  };

  let totalItems = 0;
  let affiliates: AffiliateAccount[] = [];

  try {
    const response = await serverAffiliateService.getAffiliateAccount(queryParams);
    totalItems = response.pagination?.total || affiliates.length;
    affiliates = response.items || [];
  } catch (error) {
    console.error("Error fetching affiliates:", error);
  }

  return (
    <DataTableWrapper
      data={affiliates}
      totalItems={totalItems}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
