import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { Suspense } from "react";
import DiscountViewPage from "@/features/discounts/components/discount-view-page";

export const metadata = {
  title: "Dashboard: Edit Discount",
  description: "Edit discount rule",
};

type PageProps = { params: Promise<{ discountId: string }> };

export default async function EditDiscountPage(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable={false}>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <DiscountViewPage discountId={params.discountId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
