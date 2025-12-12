import { Metadata } from "next";
import { Suspense } from "react";
import AffiliateWithdrawalsPage from "@/features/storefront/components/account/affiliate/withdrawals/affiliate-withdrawals-page";
import { storefrontServerAffiliateService } from "@/lib/api/services/storefront";
import { searchParamsCache } from "@/lib/searchparams";
import type { QueryParams } from "@/lib/api/types";
import { AffiliateApprovalStatus } from "@/types/affiliate";
import { serverAffiliatePayoutService } from "@/lib/api/services/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Affiliate Withdrawals - AKA Store",
  description: "Xem lịch sử rút tiền affiliate của bạn.",
};

interface AffiliateWithdrawalsPageRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AffiliateWithdrawalsPageRoute(
  props: AffiliateWithdrawalsPageRouteProps
) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const status = searchParamsCache.get("status");

  const queryParams: QueryParams = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    sort:
      sort && sort.length > 0
        ? sort.map((item: any) => `${item.id},${item.desc ? "desc" : "asc"}`)
        : undefined,
    status: status ? (status.toString() as AffiliateApprovalStatus) : undefined,
  };

  let withdrawals: any[] = [];
  let totalItems = 0;
  let payoutMethod: any | null = null;
  let balance = 0;
  try {
    const [withdrawalsResponse, payoutMethodResponse, accountResponse] = await Promise.all([storefrontServerAffiliateService.getAffiliateWithdrawals(queryParams), serverAffiliatePayoutService.getAffiliatePayoutMethods(), storefrontServerAffiliateService.getCurrentAffiliateAccount()]);

    withdrawals = withdrawalsResponse.items || [];
    totalItems = withdrawalsResponse.pagination?.total || 0;
    payoutMethod = payoutMethodResponse.items?.find(item => item.status === "ACTIVE") || null;
    balance = accountResponse.balance || 0;

    return (
      <Suspense fallback={<div>Đang tải...</div>}>
        <AffiliateWithdrawalsPage
          initialWithdrawals={withdrawals}
          initialTotalItems={totalItems}
          payoutMethod={payoutMethod}
          balance={balance}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching affiliate data:", error);
  }
}
