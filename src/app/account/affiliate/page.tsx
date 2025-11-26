import { Metadata } from "next";
import AffiliateAccountPage from "@/features/storefront/components/account/affiliate/affiliate-account-page";
import { storefrontServerAffiliateApprovalService, storefrontServerAffiliateLinkService } from "@/lib/api/services/storefront";
import { AffiliateApprovalStatus, AffiliateLink } from "@/types/affiliate";

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

  let links: AffiliateLink[] = [];
  if(approvalResponse.items && approvalResponse.items.length > 0 && approvalResponse.items[0]?.status === AffiliateApprovalStatus.APPROVED) {
    links = await storefrontServerAffiliateLinkService.getAffiliateLinks({
      page: 1,
      size: 100,
    }).then(response => response.items || []);
  }

  return <AffiliateAccountPage approval={approvalResponse.items[0]!} links={links} />;
}

