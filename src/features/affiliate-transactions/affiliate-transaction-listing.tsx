import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./affiliate-transaction-tables/columns";
import { serverAffiliateService } from "@/lib/api/services/server";
import type { QueryParams } from "@/lib/api/types";
import { AffiliateTransaction, AffiliateTransactionType } from "@/types";

export default async function AffiliateTransactionListingPage() {
  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const affiliateId = searchParamsCache.get("affiliateId");
  const transactionType = searchParamsCache.get("transactionType") as AffiliateTransactionType;
  // Build query parameters for the service using new structure
  const queryParams: QueryParams = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    sort: sort && sort.length > 0
      ? sort.map(item => `${item.id},${item.desc ? "desc" : "asc"}`)
      : undefined,
    affiliateId: affiliateId ? parseInt(affiliateId.toString()) : undefined,
    type: transactionType,
  };

  let totalItems = 0;
  let transactions: AffiliateTransaction[] = [];

  try {
    const response = await serverAffiliateService.getAffiliateTransactions(queryParams);
    totalItems = response.pagination?.total || transactions.length;
    transactions = response.items || [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }

  return (
    <DataTableWrapper
      data={transactions}
      totalItems={totalItems}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
