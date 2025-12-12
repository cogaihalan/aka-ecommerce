import { Metadata } from "next";
import AffiliateAccountPage from "@/features/storefront/components/account/affiliate/affiliate-account-page";
import { storefrontServerAffiliateApprovalService, storefrontServerAffiliateService } from "@/lib/api/services/storefront";
import { AffiliateAccount } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Affiliate - AKA Store",
  description: "Quản lý affiliate links và trạng thái duyệt của bạn.",
};

export default async function AffiliateAccountPageRoute() {
  let account: AffiliateAccount | null = null;
  const approvalResponse =
    await storefrontServerAffiliateApprovalService.getAffiliateApprovals({
      page: 1,
      size: 1,
    });

  if (approvalResponse.items?.[0] && approvalResponse.items[0]!.status === "APPROVED") {
    account =
      await storefrontServerAffiliateService.getCurrentAffiliateAccount();
  }

  return <AffiliateAccountPage approval={approvalResponse.items[0]!} account={account!} />;

}
