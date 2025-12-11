import { Metadata } from "next";
import { Suspense } from "react";
import AffiliateLinksPage from "@/features/storefront/components/account/affiliate/links/affiliate-links-page";
import {
  storefrontServerAffiliateApprovalService,
  storefrontServerAffiliateLinkService,
} from "@/lib/api/services/storefront";
import { AffiliateApprovalStatus } from "@/types/affiliate";
import { searchParamsCache } from "@/lib/searchparams";
import type { QueryParams } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Affiliate Links - AKA Store",
  description: "Quản lý affiliate links của bạn.",
};

interface AffiliateLinksPageRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AffiliateLinksPageRoute(
  props: AffiliateLinksPageRouteProps
) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  // Check approval status
  const approvalResponse =
    await storefrontServerAffiliateApprovalService.getAffiliateApprovals({
      page: 1,
      size: 1,
    });

  const approval = approvalResponse.items?.[0];
  const canManageLinks = approval?.status === AffiliateApprovalStatus.APPROVED;

  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const name = searchParamsCache.get("name");
  const code = searchParamsCache.get("code");
  const campaignName = searchParamsCache.get("campaignName");

  const queryParams: QueryParams = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    sort:
      sort && sort.length > 0
        ? sort.map((item: any) => `${item.id},${item.desc ? "desc" : "asc"}`)
        : undefined,
    name: name?.toString(),
    code: code?.toString(),
    campaignName: campaignName?.toString(),
  };

  let links: any[] = [];
  let totalItems = 0;

  if (canManageLinks) {
    try {
      const response =
        await storefrontServerAffiliateLinkService.getAffiliateLinks(
          queryParams
        );
      links = response.items || [];
      totalItems = response.pagination?.total || 0;
    } catch (error) {
      console.error("Error fetching affiliate links:", error);
    }
  }

  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <AffiliateLinksPage
        approval={approval}
        initialLinks={links}
        initialTotalItems={totalItems}
        canManageLinks={canManageLinks}
      />
    </Suspense>
  );
}
