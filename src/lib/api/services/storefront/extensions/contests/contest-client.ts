import { UnifiedContestService } from "@/lib/api/services/unified/extensions/contest";

export class StorefrontContestService extends UnifiedContestService {
  protected basePath = "/user/contests";
}

// Export singleton instance
export const storefrontContestService = new StorefrontContestService();
