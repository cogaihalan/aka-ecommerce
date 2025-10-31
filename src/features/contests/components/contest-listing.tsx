import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./contest-tables/columns";
import { serverUnifiedContestService } from "@/lib/api/services/server";

export default async function ContestListingPage() {
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const name = searchParamsCache.get("name");
  const status = searchParamsCache.get("status");

  const filters = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    name: name?.toString(),
    sort: sort && sort.length > 0
      ? sort.map(item => `${item.id},${item.desc ? "desc" : "asc"}`)
      : undefined,
    ...(status && { active: status?.toString() === "ACTIVE" ? true : false }),
  };

  const data = await serverUnifiedContestService.getContests(filters);
  const totalContests = data.pagination.total;
  const contests = data.items;

  return (
    <DataTableWrapper
      data={contests}
      totalItems={totalContests}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
