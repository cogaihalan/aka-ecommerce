import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./affiliate-links-tables/columns";
import { serverAffiliateLinkService } from "@/lib/api/services/server/extensions/affiliate/affiliate-link";

export default async function AffiliateLinksListingPage() {
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const name = searchParamsCache.get("name");
  const code = (searchParamsCache as any).get("code");
  const campaignName = (searchParamsCache as any).get("campaignName");

  const filters: any = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    name: name?.toString(),
    code: code?.toString(),
    campaignName: campaignName?.toString(),
    sort: sort && sort.length > 0
      ? sort.map(item => `${item.id},${item.desc ? "desc" : "asc"}`)
      : undefined,
  };

  const data = await serverAffiliateLinkService.getAffiliateLinks(filters);
  const totalItems = data.pagination.total;
  const links = data.items;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Danh sách Affiliate Links</h2>
        <p className="text-sm text-muted-foreground">
          Quản lý tất cả affiliate links trong hệ thống
        </p>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không có affiliate link nào.</p>
        </div>
      ) : (
        <DataTableWrapper
          data={links}
          totalItems={totalItems}
          columns={columns}
          debounceMs={500}
          shallow={false}
        />
      )}
    </div>
  );
}
