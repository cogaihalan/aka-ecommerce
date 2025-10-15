import { serverApiClient } from "@/lib/api/server";
import type {
  OrderListResponse,
  CreateOrderRequest,
  QueryParams,
} from "@/lib/api/types";

import type { Order, OrderStatus } from "@/types";

class ServerUnifiedOrderService {
  private basePath = "/orders";

  // Get all orders with filtering and pagination
  async getOrders(params: QueryParams = {}): Promise<OrderListResponse> {
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

    if (params.name !== undefined)
      searchParams.append("name", params.name.toString());

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
  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const response = await serverApiClient.patch<Order>(
      `${this.basePath}/${id}/status`,
      { status }
    );
    return response.data!;
  }
}

// Export singleton instance
export const serverUnifiedOrderService = new ServerUnifiedOrderService();
