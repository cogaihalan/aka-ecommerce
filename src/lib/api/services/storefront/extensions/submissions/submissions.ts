import { ServerSubmissionService } from "@/lib/api/services/server/extensions/submissions";

export class StorefrontServerSubmissionService extends ServerSubmissionService {
  protected basePath = "/submissions";
}

export const storefrontServerSubmissionService = new StorefrontServerSubmissionService();


