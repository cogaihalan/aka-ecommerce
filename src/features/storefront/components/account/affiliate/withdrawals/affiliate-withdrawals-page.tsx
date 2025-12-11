"use client";

import { useState, useEffect } from "react";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { createColumns } from "./affiliate-withdrawals-columns";
import { AffiliateWithdrawal } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AffiliateWithdrawalForm } from "./affiliate-withdrawal-form";
import { CreateAffiliateWithdrawalRequest } from "@/lib/api/types";
import { storefrontAffiliateService } from "@/lib/api/services/storefront/extensions/affiliate/client/affiliate-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { unifiedAffiliatePayoutService } from "@/lib/api/services/unified";

interface AffiliateWithdrawalsPageProps {
  initialWithdrawals: AffiliateWithdrawal[];
  initialTotalItems: number;
}

export default function AffiliateWithdrawalsPage({
  initialWithdrawals,
  initialTotalItems,
}: AffiliateWithdrawalsPageProps) {
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [payoutMethods, setPayoutMethods] =
    useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPayoutMethods = async () => {
      const payoutMethods = await unifiedAffiliatePayoutService.getAffiliatePayoutMethods();
      setPayoutMethods(payoutMethods.items!);
    };
    fetchPayoutMethods();
  }, []);


  const columns = createColumns();

  const handleFormSubmit = async (data: CreateAffiliateWithdrawalRequest) => {
    try {
      await storefrontAffiliateService.createAffiliateWithdrawal(data);
      toast.success("Yêu cầu rút tiền đã được gửi thành công");
      setShowWithdrawalForm(false);
      router.refresh();
    } catch (error) {
      toast.error("Gửi yêu cầu rút tiền thất bại");
      console.error("Error creating withdrawal:", error);
    }
  };

  const handleFormCancel = () => {
    setShowWithdrawalForm(false);
  };

  const handleOpenWithdrawalForm = () => {
    setShowWithdrawalForm((flag) => !flag);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rút tiền Affiliate</h1>
          <p className="text-muted-foreground">
            Xem lịch sử rút tiền affiliate của bạn
          </p>
        </div>
        <Button onClick={handleOpenWithdrawalForm}>
          <Plus className="h-4 w-4 mr-2" />
          Yêu cầu rút tiền
        </Button>
      </div>

      {initialWithdrawals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Bạn chưa có yêu cầu rút tiền nào.
          </p>
        </div>
      ) : (
        <DataTableWrapper
          data={initialWithdrawals}
          totalItems={initialTotalItems}
          columns={columns}
          debounceMs={500}
          shallow={false}
          position="relative"
        />
      )}

      {/* Withdrawal Form Modal */}
      {showWithdrawalForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AffiliateWithdrawalForm
              payoutMethods={payoutMethods}
              balance={0}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
