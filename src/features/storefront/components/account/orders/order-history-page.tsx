import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./order-history-columns";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types";
import { searchParamsCache } from "@/lib/searchparams";
import { storefrontServerOrderService } from "@/lib/api/services/storefront/orders";

export default async function OrderHistoryPage() {
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
    sort: sort && sort.length > 0
      ? sort.map(item => `${item.id},${item.desc ? "desc" : "asc"}`)
      : undefined,
    orderCode: orderCode?.toString(),
    status: status ? (status as OrderStatus) : undefined,
    paymentMethod: paymentMethod ? (paymentMethod as PaymentMethod) : undefined,
    paymentStatus: paymentStatus ? (paymentStatus as PaymentStatus) : undefined,
    recipientName: recipientName?.toString(),
    recipientPhone: recipientPhone?.toString(),
  };

  // Fetch orders from API
  const result = await storefrontServerOrderService.getOrders(orderQueryParams);
  const totalOrders = result.pagination?.total || result.items?.length || 0;
  const orders = result.items || [];


  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lịch sử đơn hàng</h1>
          <p className="text-muted-foreground">Xem và theo dõi đơn hàng của bạn</p>
        </div>
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy đơn hàng</h3>
            <p>Bạn chưa đặt đơn hàng nào.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Lịch sử đơn hàng</h1>
        <p className="text-muted-foreground">
          Xem và theo dõi đơn hàng của bạn ({totalOrders} tổng)
        </p>
      </div>

      <DataTableWrapper
        data={orders}
        totalItems={totalOrders}
        columns={columns}
        debounceMs={500}
        shallow={false}
        position="relative"
      />
    </div>
  );
}
