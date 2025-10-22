import { apiClient } from "@/lib/api/client";
import type { Course } from "@/types";
import type { QueryParams, CourseListResponse, CourseCreateRequest, CourseUpdateRequest, CourseMediaUploadRequest } from "@/lib/api/types";


class UnifiedCourseService {
  private basePath = "/admin/courses";

  async getCourses(params: QueryParams = {}): Promise<CourseListResponse> {
    const searchParams = new URLSearchParams();

    // Handle pagination
    if (params.page !== undefined) searchParams.append("page", params.page.toString());
    if (params.size !== undefined) searchParams.append("size", params.size.toString());

    // Handle sorting
    if (params.sort && params.sort.length > 0) {
      params.sort.forEach((sortItem) => {
        searchParams.append("sort", sortItem);
      });
    }

    // Handle search
    if (params.name !== undefined) searchParams.append("name", params.name.toString());

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

  async uploadCourseThumbnail(data: CourseMediaUploadRequest): Promise<Course> {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    formData.append("file", data.file);
    const response = await apiClient.post<Course>(`${this.basePath}/${data.id}/upload-image`, formData);
    return response.data!;
  }

  async uploadCourseVideo(data: CourseMediaUploadRequest): Promise<Course> {
    const formData = new FormData();
    formData.append("id", data.id.toString());
    formData.append("file", data.file);
    const response = await apiClient.post<Course>(`${this.basePath}/${data.id}/upload-video`, formData);
    return response.data!;
  }
}

export const unifiedCourseService = new UnifiedCourseService();
