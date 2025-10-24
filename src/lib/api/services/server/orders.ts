import { serverApiClient } from "@/lib/api/server";
import type {
  OrderListResponse,
  CreateOrderRequest,
  OrderQueryParams,
} from "@/lib/api/types";
import type { Order } from "@/types";

class ServerUnifiedOrderService {
  private basePath = "/admin/orders";

  // Get all orders with filtering and pagination
  async getOrders(params: OrderQueryParams = {}): Promise<OrderListResponse> {
    const searchParams = new URLSearchParams();

    // Handle pagination
    if (params.page !== undefined)
      searchParams.append("page", params.page.toString());
    if (params.size !== undefined)
      searchParams.append("size", params.size.toString());

    // Handle sorting
    if (params.sort && params.sort.length > 0) {
      params.sort.forEach((sortItem: string) => {
        searchParams.append("sort", sortItem);
      });
    }

    if (params.status !== undefined)
      searchParams.append("status", params.status.toString());

    if (params.paymentMethod !== undefined)
      searchParams.append("paymentMethod", params.paymentMethod.toString());

    if (params.paymentStatus !== undefined)
      searchParams.append("paymentStatus", params.paymentStatus.toString());

    if (params.recipientName !== undefined)
      searchParams.append("recipientName", params.recipientName.toString());

    if (params.recipientPhone !== undefined)
      searchParams.append("recipientPhone", params.recipientPhone.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await serverApiClient.get<OrderListResponse>(endpoint);

    return response.data!;
  }

  // Get a single order by ID
  async getOrder(id: number): Promise<Order> {
    const response = await serverApiClient.get<Order>(`${this.basePath}/${id}`);
    return response.data!;
  }

  // Create a new order
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await serverApiClient.post<Order>(this.basePath, data);
    return response.data!;
  }

  // Order status management
  async updateOrderShippingStatus(id: number, note?: string): Promise<Order> {
    const queryString = note ? `?note=${note}` : "";
    const response = await serverApiClient.put<Order>(
      `${this.basePath}/${id}/shipping${queryString}`
    );
    return response.data!;
  }

  async markDeliveredOrder(id: number, note?: string): Promise<Order> {
    const queryString = note ? `?note=${note}` : "";
    const response = await serverApiClient.put<Order>(
      `${this.basePath}/${id}/delivered${queryString}`
    );
    return response.data!;
  }

  async refundOrder(id: number, note?: string): Promise<Order> {
    const queryString = note ? `?note=${note}` : "";
    const response = await serverApiClient.put<Order>(
      `${this.basePath}/${id}/refund${queryString}`
    );
    return response.data!;
  }

  async confirmOrder(id: number, note?: string): Promise<Order> {
    const queryString = note ? `?note=${note}` : "";
    const response = await serverApiClient.put<Order>(
      `${this.basePath}/${id}/confirm${queryString}`
    );
    return response.data!;
  }

  protected async cancelOrder(id: number, reason?: string): Promise<Order> {
    const queryString = reason ? `?reason=${reason}` : "";
    const response = await serverApiClient.put<Order>(
      `${this.basePath}/${id}/cancel${queryString}`
    );
    return response.data!;
  }
}

// Export singleton instance
export const serverUnifiedOrderService = new ServerUnifiedOrderService();
