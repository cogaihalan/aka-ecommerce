import { ServerUnifiedOrderService } from "@/lib/api/services/server/orders";

export class StorefrontServerOrderService extends ServerUnifiedOrderService {
  protected basePath = "/orders";
}

// Export singleton instance
export const storefrontServerOrderService = new StorefrontServerOrderService();
