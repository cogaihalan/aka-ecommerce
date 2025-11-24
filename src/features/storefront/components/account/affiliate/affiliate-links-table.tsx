import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { createColumns } from "./affiliate-links-columns";
import { storefrontServerAffiliateLinkService } from "@/lib/api/services/storefront";

interface AffiliateLinksTableProps {
  onEdit?: (link: any) => void;
}

export default async function AffiliateLinksTable({ onEdit }: AffiliateLinksTableProps) {
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const name = searchParamsCache.get("name");
  const code = (searchParamsCache as any).get("code");
  const campaignName = (searchParamsCache as any).get("campaignName");

  const filters: any = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 100, // Get all links for now
    name: name?.toString(),
    code: code?.toString(),
    campaignName: campaignName?.toString(),
    sort: sort && sort.length > 0
      ? sort.map(item => `${item.id},${item.desc ? "desc" : "asc"}`)
      : undefined,
  };

  const response = await storefrontServerAffiliateLinkService.getAffiliateLinks(filters);
  const links = response.items || [];
  const totalItems = response.pagination?.total || 0;

  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Bạn chưa có affiliate link nào. Hãy tạo link đầu tiên!</p>
      </div>
    );
  }

  const columns = createColumns(onEdit);

  return (
    <DataTableWrapper
      data={links}
      totalItems={totalItems}
      columns={columns}
      debounceMs={500}
      shallow={false}
      position="relative"
    />
  );
}
