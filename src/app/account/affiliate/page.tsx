import { Metadata } from "next";
import AffiliateAccountPage from "@/features/storefront/components/account/affiliate/affiliate-account-page";

export const metadata: Metadata = {
  title: "Affiliate - AKA Store",
  description: "Quản lý affiliate links và trạng thái duyệt của bạn.",
};

export default function AffiliateAccountPageRoute() {
  return <AffiliateAccountPage />;
}

