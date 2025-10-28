import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./order-tables/columns";
import { serverUnifiedOrderService } from "@/lib/api/services/server";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types";

export default async function OrderListingPage() {
  const page = searchParamsCache.get("page");
  const orderCode = searchParamsCache.get("orderCode");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");
  const paymentStatus = searchParamsCache.get("paymentStatus");
  const paymentMethod = searchParamsCache.get("paymentMethod");
  const recipientName = searchParamsCache.get("recipientName");
  const recipientPhone = searchParamsCache.get("recipientPhone");
  const sort = searchParamsCache.get("sort");

  const orderQueryParams = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    sort: sort
      ? Array.isArray(sort)
        ? [`${sort[0]?.id},${sort[0]?.desc ? "desc" : "asc"}`]
        : [`${(sort as any).id},${(sort as any).desc ? "desc" : "asc"}`]
      : undefined,
    orderCode: orderCode?.toString(),
    status: status ? (status as OrderStatus) : undefined,
    paymentMethod: paymentMethod ? (paymentMethod as PaymentMethod) : undefined,
    paymentStatus: paymentStatus ? (paymentStatus as PaymentStatus) : undefined,
    recipientName: recipientName?.toString(),
    recipientPhone: recipientPhone?.toString(),
  };

  // Fetch orders from API
  const result = await serverUnifiedOrderService.getOrders(orderQueryParams);
  const totalOrders = result.pagination?.total || result.items?.length || 0;
  const orders = result.items || [];

  return (
    <DataTableWrapper
      data={orders}
      totalItems={totalOrders}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
