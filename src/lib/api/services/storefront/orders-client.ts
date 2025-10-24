import { UnifiedOrderService } from "@/lib/api/services/unified/orders";
import type { Order } from "@/types";
import { apiClient } from "@/lib/api/client";

export class StorefrontOrderService extends UnifiedOrderService {
  protected basePath = "/orders";

  async cancelOrder(id: number): Promise<Order> {
    const response = await apiClient.put<Order>(
      `${this.basePath}/${id}/cancel`
    );
    return response.data!;
  }
}

// Export singleton instance
export const storefrontOrderService = new StorefrontOrderService();