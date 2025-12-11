import { Metadata } from "next";
import { Suspense } from "react";
import AffiliateTransactionsPage from "@/features/storefront/components/account/affiliate/transactions/affiliate-transactions-page";
import { storefrontServerAffiliateService } from "@/lib/api/services/storefront";
import { searchParamsCache } from "@/lib/searchparams";
import type { QueryParams } from "@/lib/api/types";
import { AffiliateTransactionType } from "@/types/affiliate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Affiliate Transactions - AKA Store",
  description: "Xem lịch sử giao dịch affiliate của bạn.",
};

interface AffiliateTransactionsPageRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AffiliateTransactionsPageRoute(
  props: AffiliateTransactionsPageRouteProps
) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const transactionType = searchParamsCache.get(
    "transactionType"
  ) as AffiliateTransactionType;

  const queryParams: QueryParams = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    sort:
      sort && sort.length > 0
        ? sort.map((item: any) => `${item.id},${item.desc ? "desc" : "asc"}`)
        : undefined,
    type: transactionType,
  };

  let transactions: any[] = [];
  let totalItems = 0;

  try {
    const response =
      await storefrontServerAffiliateService.getAffiliateTransactions(
        queryParams
      );
    transactions = response.items || [];
    totalItems = response.pagination?.total || 0;
  } catch (error) {
    console.error("Error fetching affiliate transactions:", error);
  }

  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <AffiliateTransactionsPage
        initialTransactions={transactions}
        initialTotalItems={totalItems}
      />
    </Suspense>
  );
}
