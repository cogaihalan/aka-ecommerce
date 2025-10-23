import { UnifiedCourseService } from "@/lib/api/services/unified/extensions/courses";

export class StorefrontCourseService extends UnifiedCourseService {
  protected basePath = "/courses";
}

// Export singleton instance
export const storefrontCourseService = new StorefrontCourseService();
