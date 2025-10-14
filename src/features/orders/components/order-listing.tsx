import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./order-tables/columns";
import { serverUnifiedOrderService } from "@/lib/api/services/server";
import { convertSortToApiParams } from "@/lib/utils/sort-conversion";

export default async function OrderListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("orderNumber");
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");
  const paymentStatus = searchParamsCache.get("paymentStatus");
  const fulfillmentStatus = searchParamsCache.get("fulfillmentStatus");
  const dateFrom = searchParamsCache.get("dateFrom");
  const dateTo = searchParamsCache.get("dateTo");
  const sort = searchParamsCache.get("sort");

  const sortParams = convertSortToApiParams(sort);

  const filters = {
    ...(page && { page: parseInt(page.toString()) }),
    ...(pageLimit && { limit: parseInt(pageLimit.toString()) }),
    ...(search && { search: search.toString() }),
    ...sortParams,
    ...((status ||
      paymentStatus ||
      fulfillmentStatus ||
      dateFrom ||
      dateTo) && {
      filters: {
        ...(status && { status: status as any }),
        ...(paymentStatus && { paymentStatus: paymentStatus as any }),
        ...(fulfillmentStatus && {
          fulfillmentStatus: fulfillmentStatus as any,
        }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      },
    }),
  };

  // Fetch orders from API
  const result = await serverUnifiedOrderService.getOrders(filters);
  const totalOrders = result.pagination?.total || result.orders?.length || 0;
  const orders = result.orders || [];

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
