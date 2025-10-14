import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./course-tables/columns";
import { serverUnifiedCourseService } from "@/lib/api/services/server";
import { convertSortToApiParams } from "@/lib/utils/sort-conversion";

export default async function CourseListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name"); // Use 'name' instead of 'search'
  const pageLimit = searchParamsCache.get("perPage");
  const isActive = searchParamsCache.get("isActive");
  const sort = searchParamsCache.get("sort");

  const sortParams = convertSortToApiParams(sort);

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search: search.toString() }),
    ...(isActive !== null && { isActive: isActive === "true" }),
    ...sortParams,
  };

  // Fetch courses from API
  const data = await serverUnifiedCourseService.getCourses(filters);
  const totalCourses = data.total;
  const courses = data.courses;

  return (
    <DataTableWrapper
      data={courses}
      totalItems={totalCourses}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
