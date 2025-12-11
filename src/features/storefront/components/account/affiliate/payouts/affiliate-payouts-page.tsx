"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CreditCard } from "lucide-react";
import { AffiliatePayoutForm } from "./affiliate-payout-form";
import { AffiliatePayoutMethod } from "@/types";
import { CreateAffiliatePayoutMethodRequest } from "@/lib/api/types";
import { toast } from "sonner";
import { unifiedAffiliatePayoutService } from "@/lib/api/services/unified";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface AffiliatePayoutsPageProps {
  initialPayoutMethods: AffiliatePayoutMethod[];
}

export default function AffiliatePayoutsPage({
  initialPayoutMethods,
}: AffiliatePayoutsPageProps) {
  const [payoutMethods, setPayoutMethods] =
    useState<AffiliatePayoutMethod[]>(initialPayoutMethods);
  const [showForm, setShowForm] = useState(false);
  const [deletingPayoutMethod, setDeletingPayoutMethod] =
    useState<AffiliatePayoutMethod | null>(null);
  const router = useRouter();

  useEffect(() => {
    setPayoutMethods(initialPayoutMethods);
  }, [initialPayoutMethods]);

  const handleAddPayoutMethod = () => {
    setShowForm(true);
  };

  const handleDeletePayoutMethod = (payoutMethod: AffiliatePayoutMethod) => {
    setDeletingPayoutMethod(payoutMethod);
  };

  const handleFormSubmit = async (data: CreateAffiliatePayoutMethodRequest) => {
    try {
      const newPayoutMethod =
        await unifiedAffiliatePayoutService.createAffiliatePayoutMethod(data);
      setPayoutMethods([...payoutMethods, newPayoutMethod]);
      toast.success("Thêm phương thức thanh toán thành công");
      setShowForm(false);
      router.refresh();
    } catch (error) {
      toast.error("Lưu phương thức thanh toán thất bại");
      console.error("Error saving payout method:", error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPayoutMethod) return;

    try {
      await unifiedAffiliatePayoutService.deleteAffiliatePayoutMethod(
        deletingPayoutMethod.id
      );
      setPayoutMethods(
        payoutMethods.filter((pm) => pm.id !== deletingPayoutMethod.id)
      );
      toast.success("Xóa phương thức thanh toán thành công");
      setDeletingPayoutMethod(null);
      router.refresh();
    } catch (error) {
      toast.error("Xóa phương thức thanh toán thất bại");
      console.error("Error deleting payout method:", error);
    }
  };

  const handleSetActive = async (payoutMethod: AffiliatePayoutMethod) => {
    try {
      await unifiedAffiliatePayoutService.updateAffiliatePayoutMethod(
        payoutMethod.id
      );
      // Update local state
      setPayoutMethods(
        payoutMethods.map((pm) => ({
          ...pm,
          status: pm.id === payoutMethod.id ? "ACTIVE" : "INACTIVE",
        }))
      );
      toast.success("Cập nhật phương thức thanh toán mặc định thành công");
      router.refresh();
    } catch (error) {
      toast.error("Cập nhật phương thức thanh toán thất bại");
      console.error("Error setting active payout method:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Thanh toán Affiliate</h1>
          <p className="text-muted-foreground">
            Quản lý phương thức thanh toán affiliate của bạn
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleAddPayoutMethod}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm phương thức thanh toán
          </Button>
        )}
      </div>

      {showForm ? (
        <AffiliatePayoutForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : payoutMethods.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có phương thức thanh toán nào
          </h3>
          <p className="text-gray-500 mb-4">
            Thêm phương thức thanh toán đầu tiên để nhận tiền hoa hồng.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {payoutMethods.map((payoutMethod) => (
            <Card key={payoutMethod.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  {payoutMethod.status === "ACTIVE" && (
                    <Badge variant="default">Hoạt động</Badge>
                  )}
                  {payoutMethod.status === "INACTIVE" && (
                    <Badge variant="secondary">Không hoạt động</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{payoutMethod.displayName}</p>
                  <p className="text-gray-600">
                    <span className="font-medium">Ngân hàng:</span>{" "}
                    {payoutMethod.bankName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Chủ tài khoản:</span>{" "}
                    {payoutMethod.accountHolder}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Số tài khoản:</span>{" "}
                    <code className="px-2 py-1 bg-muted rounded text-sm">
                      {payoutMethod.identifier}
                    </code>
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  {payoutMethod.status === "INACTIVE" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetActive(payoutMethod)}
                    >
                      Đặt làm mặc định
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDeletePayoutMethod(payoutMethod)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!deletingPayoutMethod}
        onOpenChange={() => setDeletingPayoutMethod(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa phương thức thanh toán</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phương thức thanh toán này? Thao tác này
              không thể được hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
