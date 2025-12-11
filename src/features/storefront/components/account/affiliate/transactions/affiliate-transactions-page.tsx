"use client";

import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { createColumns } from "./affiliate-transactions-columns";
import { AffiliateTransaction } from "@/types";

interface AffiliateTransactionsPageProps {
  initialTransactions: AffiliateTransaction[];
  initialTotalItems: number;
}

export default function AffiliateTransactionsPage({
  initialTransactions,
  initialTotalItems,
}: AffiliateTransactionsPageProps) {
  const columns = createColumns();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Giao dịch Affiliate</h1>
        <p className="text-muted-foreground">
          Xem lịch sử giao dịch affiliate của bạn
        </p>
      </div>

      {initialTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Bạn chưa có giao dịch nào.</p>
        </div>
      ) : (
        <DataTableWrapper
          data={initialTransactions}
          totalItems={initialTotalItems}
          columns={columns}
          debounceMs={500}
          shallow={false}
          position="relative"
        />
      )}
    </div>
  );
}
