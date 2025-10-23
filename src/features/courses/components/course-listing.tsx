import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./course-tables/columns";
import { serverUnifiedCourseService } from "@/lib/api/services/server";

export default async function CourseListingPage() {
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const name = searchParamsCache.get("name");
  const status = searchParamsCache.get("status");

  const filters = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    name: name?.toString(),
    sort: sort
      ? Array.isArray(sort)
        ? [`${sort[0]?.id},${sort[0]?.desc ? "desc" : "asc"}`]
        : [`${(sort as any).id},${(sort as any).desc ? "desc" : "asc"}`]
      : undefined,
    ...(status && { active: status?.toString() === "ACTIVE" ? true : false }),
  };

  const data = await serverUnifiedCourseService.getCourses(filters);
  const totalCourses = data.pagination.total;
  const courses = data.items;

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
