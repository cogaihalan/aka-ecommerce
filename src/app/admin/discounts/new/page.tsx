import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { Suspense } from "react";
import DiscountViewPage from "@/features/discounts/components/discount-view-page";

export const metadata = {
  title: "Dashboard: Create Discount",
  description: "Create a new discount rule",
};

export default async function NewDiscountPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <DiscountViewPage discountId="new" />
        </Suspense>
      </div>
    </PageContainer>
  );
}
