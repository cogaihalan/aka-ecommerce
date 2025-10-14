import { notFound } from "next/navigation";
import DiscountForm from "./discount-form";
import { unifiedDiscountService } from "@/lib/api/services/unified";

type TDiscountViewPageProps = {
  discountId: string;
};

export default async function DiscountViewPage({
  discountId,
}: TDiscountViewPageProps) {
  let discount = null;
  let pageTitle = "Create New Discount";

  if (discountId !== "new") {
    try {
      discount = await unifiedDiscountService.getDiscountRule(
        Number(discountId)
      );
      pageTitle = `Edit Discount: ${discount.name}`;
    } catch (error) {
      console.error("Error fetching discount:", error);
      notFound();
    }
  }

  return (
    <DiscountForm
      initialData={discount}
      pageTitle={pageTitle}
      discountId={discountId}
    />
  );
}
