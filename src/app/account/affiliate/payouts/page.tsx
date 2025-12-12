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
    const response =
      await serverAffiliatePayoutService.getAffiliatePayoutMethods();
    payoutMethods = response.items!.filter(item => item.status !== "DELETED");

    return (
      <Suspense fallback={<div>Đang tải...</div>}>
        <AffiliatePayoutsPage initialPayoutMethods={payoutMethods} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching affiliate payout methods:", error);
  }
}
