import { apiClient } from "@/lib/api/client";
import type { AddToCartRequest, UpdateCartItemRequest } from "@/lib/api/types";
import { Cart } from "@/types";

class UnifiedCartService {
  private basePath = "/cart";

  async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>(`${this.basePath}`);
    return response.data!;
  }

  async createCart(data: AddToCartRequest): Promise<Cart> {
    const response = await apiClient.post<Cart>(this.basePath, data);
    return response.data!;
  }

  async updateProduct(id: number, data: UpdateCartItemRequest): Promise<Cart> {
    const response = await apiClient.put<Cart>(`${this.basePath}/${id}`, data);
    return response.data!;
  }

  async removeCartItem(id: number): Promise<Cart> {
    const response = await apiClient.delete<Cart>(`${this.basePath}/${id}`);
    return response.data!;
  }

  async clearCart(): Promise<Cart> {
    const response = await apiClient.delete<Cart>(`${this.basePath}/clear`);
    return response.data!;
  }
}

export const unifiedCartService = new UnifiedCartService();
