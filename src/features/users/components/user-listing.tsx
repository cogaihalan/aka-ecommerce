import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./user-tables/columns";
import { serverUnifiedUserService } from "@/lib/api/services/server";

export default async function UserListingPage() {
  const page = searchParamsCache.get("page");
  const name = searchParamsCache.get("name");
  const email = searchParamsCache.get("email");
  const phoneNumber = searchParamsCache.get("phoneNumber");
  const pageLimit = searchParamsCache.get("perPage");

  const filters = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    name: name?.toString(),
    email: email?.toString(),
    phoneNumber: phoneNumber?.toString(),
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
