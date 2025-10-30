import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./submission-tables/columns";
import { serverSubmissionService } from "@/lib/api/services/server/extensions/submissions";

export default async function SubmissionListingPage() {
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const name = searchParamsCache.get("name");
  const status = searchParamsCache.get("status");
  const barberName = searchParamsCache.get("barberName");

  const filters = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    name: name?.toString(),
    status: status?.toString(),
    barberName: barberName?.toString(),
    sort: sort
      ? Array.isArray(sort)
        ? [`${sort[0]?.id},${sort[0]?.desc ? "desc" : "asc"}`]
        : [`${(sort as any).id},${(sort as any).desc ? "desc" : "asc"}`]
      : undefined,
  } as any;

  const data = await serverSubmissionService.getSubmissions(filters);
  const totalItems = data.pagination?.total || data.items?.length || 0;
  const submissions = data.items || [];

  return (
    <DataTableWrapper
      data={submissions}
      totalItems={totalItems}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}


