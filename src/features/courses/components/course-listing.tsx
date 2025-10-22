import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./course-tables/columns";
import { serverUnifiedCourseService } from "@/lib/api/services/server";
import { convertSortToApiParams } from "@/lib/utils/sort-conversion";

export default async function CourseListingPage() {
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const name = searchParamsCache.get("name");
  const status = searchParamsCache.get("status");
  const sortParams = convertSortToApiParams(sort);

  const filters = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    name: name?.toString(),
    active: status?.toString() === "ACTIVE" ? true : false,
    ...sortParams,
  };

  const data = await serverUnifiedCourseService.getCourses(filters);
  const totalCourses = data.pagination.total;
  const courses = data.items;

  console.log(courses, filters);

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
