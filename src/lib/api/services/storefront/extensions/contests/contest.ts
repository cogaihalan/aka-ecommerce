import { ServerUnifiedContestService } from "@/lib/api/services/server/extensions/contest";

export class StorefrontServerContestService extends ServerUnifiedContestService {
  protected basePath = "/user/contests";
}

// Export singleton instance
export const storefrontServerContestService = new StorefrontServerContestService();
