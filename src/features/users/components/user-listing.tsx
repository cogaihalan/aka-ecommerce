import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./user-tables/columns";
import { serverUnifiedUserService } from "@/lib/api/services/server";

export default async function UserListingPage() {
  const page = searchParamsCache.get("page");
  const name = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");

  const filters = {
    page,
    size: pageLimit,
    ...(name && { name }),
  };

  // Fetch users from API using the same pattern
  const data = await serverUnifiedUserService.getUsers(filters);
  const totalUsers = data.pagination.total;
  const users = data.items;

  return (
    <DataTableWrapper
      data={users}
      totalItems={totalUsers}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
