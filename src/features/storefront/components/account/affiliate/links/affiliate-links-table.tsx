import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { createColumns } from "./affiliate-links-columns";
import { AffiliateLink } from "@/types";

interface AffiliateLinksTableProps {
  links: AffiliateLink[];
  totalItems: number;
  onEdit?: (link: AffiliateLink) => void;
}

export default function AffiliateLinksTable({
  links,
  totalItems,
  onEdit,
}: AffiliateLinksTableProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Bạn chưa có affiliate link nào. Hãy tạo link đầu tiên!
        </p>
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
