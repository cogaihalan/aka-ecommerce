import { serverApiClient } from "@/lib/api/server";
import type {
  Order,
  OrderListResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  QueryParams,
} from "@/lib/api/types";

class ServerUnifiedOrderService {
  private basePath = "/orders";

  async getOrders(params: QueryParams = {}): Promise<OrderListResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await serverApiClient.get<OrderListResponse>(endpoint);
    return response.data!;
  }

  async getOrder(id: number): Promise<Order> {
    const response = await serverApiClient.get<Order>(`${this.basePath}/${id}`);
    return response.data!;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await serverApiClient.get<Order>(
      `${this.basePath}/number/${orderNumber}`
    );
    return response.data!;
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await serverApiClient.post<Order>(this.basePath, data);
    return response.data!;
  }

  async updateOrder(id: number, data: UpdateOrderRequest): Promise<Order> {
    const response = await serverApiClient.put<Order>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const response = await serverApiClient.patch<Order>(
      `${this.basePath}/${id}/status`,
      { status }
    );
    return response.data!;
  }

  async updateOrderPaymentStatus(
    id: number,
    paymentStatus: string
  ): Promise<Order> {
    const response = await serverApiClient.patch<Order>(
      `${this.basePath}/${id}/payment-status`,
      { paymentStatus }
    );
    return response.data!;
  }

  async updateOrderFulfillmentStatus(
    id: number,
    fulfillmentStatus: string
  ): Promise<Order> {
    const response = await serverApiClient.patch<Order>(
      `${this.basePath}/${id}/fulfillment-status`,
      { fulfillmentStatus }
    );
    return response.data!;
  }

  async updateOrderShippingStatus(
    id: number,
    shippingStatus: string
  ): Promise<Order> {
    const response = await serverApiClient.patch<Order>(
      `${this.basePath}/${id}/shipping-status`,
      { shippingStatus }
    );
    return response.data!;
  }

  async addOrderNote(id: number, note: string): Promise<Order> {
    const response = await serverApiClient.post<Order>(
      `${this.basePath}/${id}/notes`,
      { note }
    );
    return response.data!;
  }

  async addOrderComment(id: number, comment: string): Promise<Order> {
    const response = await serverApiClient.post<Order>(
      `${this.basePath}/${id}/comments`,
      { comment }
    );
    return response.data!;
  }

  async updateOrderTracking(id: number, tracking: any): Promise<Order> {
    const response = await serverApiClient.patch<Order>(
      `${this.basePath}/${id}/tracking`,
      tracking
    );
    return response.data!;
  }

  async cancelOrder(id: number, reason?: string): Promise<Order> {
    const response = await serverApiClient.post<Order>(
      `${this.basePath}/${id}/cancel`,
      { reason }
    );
    return response.data!;
  }

  async refundOrder(
    id: number,
    amount?: number,
    reason?: string
  ): Promise<Order> {
    const response = await serverApiClient.post<Order>(
      `${this.basePath}/${id}/refund`,
      { amount, reason }
    );
    return response.data!;
  }

  async updateOrderAddress(id: number, address: any): Promise<Order> {
    const response = await serverApiClient.put<Order>(
      `${this.basePath}/${id}/address`,
      address
    );
    return response.data!;
  }

  async updateOrderShippingAddress(id: number, address: any): Promise<Order> {
    const response = await serverApiClient.put<Order>(
      `${this.basePath}/${id}/shipping-address`,
      address
    );
    return response.data!;
  }

  async deleteOrder(id: number): Promise<void> {
    await serverApiClient.delete(`${this.basePath}/${id}`);
  }

  async duplicateOrder(id: number): Promise<Order> {
    const response = await serverApiClient.post<Order>(
      `${this.basePath}/${id}/duplicate`
    );
    return response.data!;
  }

  async bulkUpdateOrders(
    orderIds: number[],
    updates: Partial<UpdateOrderRequest>
  ): Promise<Order[]> {
    const response = await serverApiClient.patch<Order[]>(
      `${this.basePath}/bulk`,
      {
        orderIds,
        updates,
      }
    );
    return response.data!;
  }

  async bulkUpdateOrderStatus(
    orderIds: number[],
    status: string
  ): Promise<Order[]> {
    const response = await serverApiClient.patch<Order[]>(
      `${this.basePath}/bulk/status`,
      {
        orderIds,
        status,
      }
    );
    return response.data!;
  }

  async getOrderAnalytics(params: QueryParams = {}): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/analytics?${queryString}`
      : `${this.basePath}/analytics`;

    const response = await serverApiClient.get(endpoint);
    return response.data!;
  }

  async getOrderReports(params: QueryParams = {}): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/reports?${queryString}`
      : `${this.basePath}/reports`;

    const response = await serverApiClient.get(endpoint);
    return response.data!;
  }

  async getOrderSummary(params: QueryParams = {}): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/summary?${queryString}`
      : `${this.basePath}/summary`;

    const response = await serverApiClient.get(endpoint);
    return response.data!;
  }

  async getOrderPrintData(id: number, format: string = "pdf"): Promise<Blob> {
    const response = await serverApiClient.get(
      `${this.basePath}/${id}/print?format=${format}`,
      {
        headers: {
          Accept: "application/pdf",
        },
      }
    );
    return response.data!;
  }

  async getOrderShippingLabel(id: number): Promise<Blob> {
    const response = await serverApiClient.get(
      `${this.basePath}/${id}/shipping-label`,
      {
        headers: {
          Accept: "application/pdf",
        },
      }
    );
    return response.data!;
  }
}

export const serverUnifiedOrderService = new ServerUnifiedOrderService();
