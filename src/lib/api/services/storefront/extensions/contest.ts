import { ServerUnifiedContestService } from "@/lib/api/services/server/extensions/contest";

export class StorefrontContestService extends ServerUnifiedContestService {
  protected basePath = "/contests";
}

// Export singleton instance
export const storefrontUnifiedContestService = new StorefrontContestService();
