import { Metadata } from "next";
import { Suspense } from "react";
import AffiliatePayoutsPage from "@/features/storefront/components/account/affiliate/payouts/affiliate-payouts-page";
import { serverAffiliatePayoutService } from "@/lib/api/services/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Affiliate Payouts - AKA Store",
  description: "Quản lý phương thức thanh toán affiliate của bạn.",
};

export default async function AffiliatePayoutsPageRoute() {
  let payoutMethods: any = [];

  try {
    payoutMethods =
      await serverAffiliatePayoutService.getAffiliatePayoutMethods();
  } catch (error) {
    console.error("Error fetching affiliate payout methods:", error);
  }

  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <AffiliatePayoutsPage initialPayoutMethods={payoutMethods.items!} />
    </Suspense>
  );
}
