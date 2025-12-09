import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./affiliate-withdrawal-tables/columns";
import { serverAffiliateService } from "@/lib/api/services/server";
import type { QueryParams } from "@/lib/api/types";
import { AffiliateApprovalStatus, AffiliateWithdrawal } from "@/types";

export default async function AffiliateWithdrawalListingPage() {
  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const affiliateId = searchParamsCache.get("affiliateId");
  const status = searchParamsCache.get("status");
  // Build query parameters for the service using new structure
  const queryParams: QueryParams = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    sort: sort && sort.length > 0
      ? sort.map(item => `${item.id},${item.desc ? "desc" : "asc"}`)
      : undefined,
    affiliateId: affiliateId ? parseInt(affiliateId.toString()) : undefined,
    status: status ? status.toString() as AffiliateApprovalStatus : undefined,
  };

  let totalItems = 0;
  let withdrawals: AffiliateWithdrawal[] = [];

  try {
    const response = await serverAffiliateService.getAffiliateWithdrawals(queryParams);
    totalItems = response.pagination?.total || withdrawals.length;
    withdrawals = response.items || [];
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
  }

  return (
    <DataTableWrapper
      data={withdrawals}
      totalItems={totalItems}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
