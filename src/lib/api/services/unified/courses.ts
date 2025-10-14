import { apiClient } from "@/lib/api/client";
import type {
  Course,
  CourseListResponse,
  CourseCreateRequest,
  CourseUpdateRequest,
  CourseListParams,
  CourseAccess,
} from "@/types/course";

class UnifiedCourseService {
  private basePath = "/api/courses";

  async getCourses(params: CourseListParams = {}): Promise<CourseListResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await apiClient.get<CourseListResponse>(endpoint);
    return response.data!;
  }

  async getCourse(id: number): Promise<Course> {
    const response = await apiClient.get<Course>(`${this.basePath}/${id}`);
    return response.data!;
  }

  async createCourse(data: CourseCreateRequest): Promise<Course> {
    const response = await apiClient.post<Course>(this.basePath, data);
    return response.data!;
  }

  async updateCourse(id: number, data: CourseUpdateRequest): Promise<Course> {
    const response = await apiClient.put<Course>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  async deleteCourse(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  async checkCourseAccess(courseId: number): Promise<CourseAccess> {
    const response = await apiClient.get<CourseAccess>(
      `${this.basePath}/${courseId}/access`
    );
    return response.data!;
  }
}

export const unifiedCourseService = new UnifiedCourseService();
