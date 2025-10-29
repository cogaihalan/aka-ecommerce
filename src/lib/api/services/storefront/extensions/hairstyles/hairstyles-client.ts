import { apiClient } from "@/lib/api/client";
import { UnifiedHairstyleService } from "@/lib/api/services/unified/extensions/hairstyles";
import { Hairstyle } from "@/types";

export class StorefrontHairstyleService extends UnifiedHairstyleService {
  protected basePath = "/user/hairstyles";

  async toggleFavoriteHairstyle(id: number): Promise<Hairstyle> {
    const response = await apiClient.post<Hairstyle>(`${this.basePath}/${id}/favorite`);
    return response.data!;
  }
}

// Export singleton instance
export const storefrontHairstyleService = new StorefrontHairstyleService();
