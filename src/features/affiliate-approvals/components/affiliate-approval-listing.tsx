import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./affiliate-approval-tables/columns";
import { serverAffiliateApprovalService } from "@/lib/api/services/server/extensions/affiliate/affiliate-approval";

export default async function AffiliateApprovalListingPage() {
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const name = searchParamsCache.get("name");
  const status = searchParamsCache.get("status");

  const filters: any = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    name: name?.toString(),
    sort: sort && sort.length > 0
      ? sort.map(item => `${item.id},${item.desc ? "desc" : "asc"}`)
      : undefined,
  };

  if (status) {
    filters.status = status.toString();
  }

  const data = await serverAffiliateApprovalService.getAffiliateApprovals(filters);
  const totalApprovals = data.pagination.total;
  const approvals = data.items;

  return (
    <DataTableWrapper
      data={approvals}
      totalItems={totalApprovals}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}

