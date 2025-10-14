import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./user-tables/columns";
import { serverUnifiedUserService } from "@/lib/api/services/server";
import { UserRole } from "@/types/auth";

export default async function UserListingPage() {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const role = searchParamsCache.get("role") as UserRole | undefined;
  const isActive = searchParamsCache.get("isActive");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(role && { role }),
    ...(isActive !== null && { isActive: isActive === "true" }),
  };

  // Fetch users from API using the same pattern
  const data = await serverUnifiedUserService.getUsers(filters);
  const totalUsers = data.total;
  const users = data.users;

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
