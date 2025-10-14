import { serverApiClient } from "@/lib/api/server";

class ServerUnifiedDiscountService {
  private basePath = "/discounts";

  async getDiscounts(): Promise<any> {
    const response = await serverApiClient.get(`${this.basePath}`);
    return response.data!;
  }

  async createDiscount(discount: any): Promise<any> {
    const response = await serverApiClient.post(`${this.basePath}`, discount);
    return response.data!;
  }

  async updateDiscount(id: number, discount: any): Promise<any> {
    const response = await serverApiClient.put(
      `${this.basePath}/${id}`,
      discount
    );
    return response.data!;
  }

  async deleteDiscount(id: number): Promise<void> {
    await serverApiClient.delete(`${this.basePath}/${id}`);
  }
}

export const serverUnifiedDiscountService = new ServerUnifiedDiscountService();
