import { apiClient } from "@/lib/api/client";
import { CreatePaymentRequest, PaymentResponse } from "@/lib/api/types";

class UnifiedPaymentService {
  private basePath = "/payments";

  // Get payment link
  async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    const response = await apiClient.post<PaymentResponse>(
      `${this.basePath}/create?orderId=${data.orderId}&gateway=${data.gateway}`
    );
    return response.data!;
  }
}

export const unifiedPaymentService = new UnifiedPaymentService();
