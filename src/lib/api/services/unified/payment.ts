import { apiClient } from "@/lib/api/client";

class UnifiedPaymentService {
  private basePath = "/payment";

  // Get payment link
  async getPaymentLink(orderId: string): Promise<string> {
    const response = await apiClient.get<string>(
      `${this.basePath}/vnpay-create/${orderId}`
    );
    return response.data!;
  }

  async getPaymentResult(): Promise<string> {
    const response = await apiClient.get<string>(
      `${this.basePath}/vnpay-return`
    );
    return response.data!;
  }
}

export const unifiedPaymentService = new UnifiedPaymentService();
