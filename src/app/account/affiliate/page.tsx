import { Metadata } from "next";
import AffiliateAccountPage from "@/features/storefront/components/account/affiliate/affiliate-account-page";
import { storefrontServerAffiliateApprovalService, storefrontServerAffiliateLinkService } from "@/lib/api/services/storefront";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Affiliate - AKA Store",
  description: "Quản lý affiliate links và trạng thái duyệt của bạn.",
};

export default async function AffiliateAccountPageRoute() {
  const approvalResponse = await storefrontServerAffiliateApprovalService.getAffiliateApprovals({
    page: 1,
    size: 1
  });


  const linksResponse = await storefrontServerAffiliateLinkService.getAffiliateLinks({
    page: 1,
    size: 100,
  });

  return <AffiliateAccountPage approval={approvalResponse.items?.[0]!} links={linksResponse.items || []} />;
}

