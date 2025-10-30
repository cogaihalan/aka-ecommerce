import { Metadata } from "next";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import PageContainer from "@/components/layout/page-container";
import { searchParamsCache } from "@/lib/searchparams";
import { DashboardPageProps } from "@/types";
import OrderListingPage from "@/features/orders/components/order-listing";

export const metadata: Metadata = {
  title: "Bảng quản trị: Đơn hàng",
  description: "Quản lý đơn hàng, theo dõi thực hiện và xử lý đổi trả",
};

export default async function OrdersPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Đơn hàng"
            description="Quản lý đơn hàng, theo dõi thực hiện và xử lý đổi trả"
          />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={8} rowCount={10} filterCount={3} />
          }
        >
          <OrderListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
