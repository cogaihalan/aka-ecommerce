export interface Course {
  id: number;
  name: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy?: number;
}

export interface CourseCreateRequest {
  name: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  isActive?: boolean;
}

export interface CourseUpdateRequest {
  name?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  isActive?: boolean;
}

export interface CourseFilters {
  search?: string;
  isActive?: boolean;
  createdBy?: number;
}

export interface CourseListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: CourseFilters;
}

export interface CourseListResponse {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
}

export interface CourseAccess {
  hasAccess: boolean;
  reason?: string;
  purchaseRequired?: boolean;
}
