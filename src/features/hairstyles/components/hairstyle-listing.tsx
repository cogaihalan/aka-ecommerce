import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./hairstyle-tables/columns";
import { serverUnifiedHairstyleService } from "@/lib/api/services/server";

export default async function HairstyleListingPage() {
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const name = searchParamsCache.get("name");
  const gender = searchParamsCache.get("gender");
  const barberName = searchParamsCache.get("barberName");

  const filters = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    name: name?.toString(),
    gender: gender?.toString(),
    barberName: barberName?.toString(),
    sort: sort
      ? Array.isArray(sort)
        ? [`${sort[0]?.id},${sort[0]?.desc ? "desc" : "asc"}`]
        : [`${(sort as any).id},${(sort as any).desc ? "desc" : "asc"}`]
      : undefined,
  };

  const data = await serverUnifiedHairstyleService.getHairstyles(filters);
  const totalHairstyles = data.pagination.total;
  const hairstyles = data.items;

  return (
    <DataTableWrapper
      data={hairstyles}
      totalItems={totalHairstyles}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
