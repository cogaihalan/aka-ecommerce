import { apiClient } from "@/lib/api/client";
import type {
  Order,
  OrderListResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  QueryParams,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
} from "@/lib/api/types";

class UnifiedOrderService {
  private basePath = "/orders";

  // Get all orders with filtering and pagination
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

    const response = await apiClient.get<OrderListResponse>(endpoint);
    return response.data!;
  }

  // Get a single order by ID
  async getOrder(id: number): Promise<Order> {
    const response = await apiClient.get<Order>(`${this.basePath}/${id}`);
    return response.data!;
  }

  // Get order by order number
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await apiClient.get<Order>(
      `${this.basePath}/number/${orderNumber}`
    );
    return response.data!;
  }

  // Create a new order
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<Order>(this.basePath, data);
    return response.data!;
  }

  // Update an existing order
  async updateOrder(id: number, data: UpdateOrderRequest): Promise<Order> {
    const response = await apiClient.put<Order>(`${this.basePath}/${id}`, data);
    return response.data!;
  }

  // Partially update an order
  async patchOrder(
    id: number,
    data: Partial<UpdateOrderRequest>
  ): Promise<Order> {
    const response = await apiClient.patch<Order>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  // Delete an order (soft delete)
  async deleteOrder(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  // Order status management
  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const response = await apiClient.patch<Order>(
      `${this.basePath}/${id}/status`,
      { status }
    );
    return response.data!;
  }

  async updatePaymentStatus(id: number, status: PaymentStatus): Promise<Order> {
    const response = await apiClient.patch<Order>(
      `${this.basePath}/${id}/payment-status`,
      { status }
    );
    return response.data!;
  }

  async updateFulfillmentStatus(
    id: number,
    status: FulfillmentStatus
  ): Promise<Order> {
    const response = await apiClient.patch<Order>(
      `${this.basePath}/${id}/fulfillment-status`,
      { status }
    );
    return response.data!;
  }

  // Order cancellation
  async cancelOrder(id: number, reason?: string): Promise<Order> {
    const response = await apiClient.patch<Order>(
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
    const response = await apiClient.post<Order>(
      `${this.basePath}/${id}/refund`,
      { amount, reason }
    );
    return response.data!;
  }

  // Order fulfillment
  async fulfillOrder(
    id: number,
    trackingNumber?: string,
    carrier?: string
  ): Promise<Order> {
    const response = await apiClient.post<Order>(
      `${this.basePath}/${id}/fulfill`,
      {
        trackingNumber,
        carrier,
      }
    );
    return response.data!;
  }

  async updateTracking(
    id: number,
    trackingNumber: string,
    carrier?: string
  ): Promise<Order> {
    const response = await apiClient.patch<Order>(
      `${this.basePath}/${id}/tracking`,
      {
        trackingNumber,
        carrier,
      }
    );
    return response.data!;
  }

  // Order items management
  async addOrderItem(
    orderId: number,
    item: {
      productId: number;
      variantId?: number;
      quantity: number;
      price?: number;
    }
  ): Promise<Order> {
    const response = await apiClient.post<Order>(
      `${this.basePath}/${orderId}/items`,
      item
    );
    return response.data!;
  }

  async updateOrderItem(
    orderId: number,
    itemId: number,
    data: {
      quantity?: number;
      price?: number;
    }
  ): Promise<Order> {
    const response = await apiClient.put<Order>(
      `${this.basePath}/${orderId}/items/${itemId}`,
      data
    );
    return response.data!;
  }

  async removeOrderItem(orderId: number, itemId: number): Promise<Order> {
    const response = await apiClient.delete<Order>(
      `${this.basePath}/${orderId}/items/${itemId}`
    );
    return response.data!;
  }

  // Order notes
  async addOrderNote(
    orderId: number,
    note: string,
    isInternal: boolean = false
  ): Promise<Order> {
    const response = await apiClient.post<Order>(
      `${this.basePath}/${orderId}/notes`,
      {
        note,
        isInternal,
      }
    );
    return response.data!;
  }

  async updateOrderNote(
    orderId: number,
    noteId: number,
    note: string
  ): Promise<Order> {
    const response = await apiClient.put<Order>(
      `${this.basePath}/${orderId}/notes/${noteId}`,
      { note }
    );
    return response.data!;
  }

  async deleteOrderNote(orderId: number, noteId: number): Promise<Order> {
    const response = await apiClient.delete<Order>(
      `${this.basePath}/${orderId}/notes/${noteId}`
    );
    return response.data!;
  }

  // Order addresses
  async updateShippingAddress(orderId: number, address: any): Promise<Order> {
    const response = await apiClient.put<Order>(
      `${this.basePath}/${orderId}/shipping-address`,
      address
    );
    return response.data!;
  }

  async updateBillingAddress(orderId: number, address: any): Promise<Order> {
    const response = await apiClient.put<Order>(
      `${this.basePath}/${orderId}/billing-address`,
      address
    );
    return response.data!;
  }

  // Bulk operations
  async bulkUpdateOrders(
    updates: Array<{ id: number; data: Partial<UpdateOrderRequest> }>
  ): Promise<Order[]> {
    const response = await apiClient.patch<Order[]>(`${this.basePath}/bulk`, {
      updates,
    });
    return response.data!;
  }

  async bulkUpdateStatus(ids: number[], status: OrderStatus): Promise<Order[]> {
    const response = await apiClient.patch<Order[]>(
      `${this.basePath}/bulk/status`,
      { ids, status }
    );
    return response.data!;
  }

  // Order analytics
  async getOrderAnalytics(period?: string): Promise<any> {
    const endpoint = period
      ? `${this.basePath}/analytics?period=${period}`
      : `${this.basePath}/analytics`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  async getOrderMetrics(period?: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
    refundRate: number;
  }> {
    const endpoint = period
      ? `${this.basePath}/metrics?period=${period}`
      : `${this.basePath}/metrics`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  // Order search and filtering
  async searchOrders(
    query: string,
    filters?: QueryParams
  ): Promise<OrderListResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append("q", query);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `${this.basePath}/search?${queryString}`;

    const response = await apiClient.get<OrderListResponse>(endpoint);
    return response.data!;
  }

  // Export orders
  async exportOrders(
    format: "csv" | "xlsx" = "csv",
    filters?: QueryParams
  ): Promise<Blob> {
    const searchParams = new URLSearchParams();
    searchParams.append("format", format);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/export?${queryString}`
      : `${this.basePath}/export`;

    const response = await fetch(apiClient["buildUrl"](endpoint), {
      headers: await apiClient["getAuthHeaders"](),
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // Order printing
  async printOrder(id: number, format: "pdf" | "html" = "pdf"): Promise<Blob> {
    const response = await fetch(
      apiClient["buildUrl"](`${this.basePath}/${id}/print?format=${format}`),
      {
        headers: await apiClient["getAuthHeaders"](),
      }
    );

    if (!response.ok) {
      throw new Error(`Print failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async printShippingLabel(id: number): Promise<Blob> {
    const response = await fetch(
      apiClient["buildUrl"](`${this.basePath}/${id}/shipping-label`),
      {
        headers: await apiClient["getAuthHeaders"](),
      }
    );

    if (!response.ok) {
      throw new Error(`Shipping label print failed: ${response.statusText}`);
    }

    return response.blob();
  }
}

// Export singleton instance
export const unifiedOrderService = new UnifiedOrderService();
