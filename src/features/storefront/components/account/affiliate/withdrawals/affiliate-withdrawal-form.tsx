"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AffiliatePayoutMethod } from "@/types";
import { CreateAffiliateWithdrawalRequest } from "@/lib/api/types";
import { CreditCard } from "lucide-react";
import { Price } from "@/components/ui/price";

const withdrawalSchema = z.object({
  amount: z
    .number()
    .min(1, "Số tiền phải lớn hơn 0")
    .positive("Số tiền phải là số dương"),
  payoutMethodId: z.number().min(1, "Vui lòng chọn phương thức thanh toán"),
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

interface AffiliateWithdrawalFormProps {
  payoutMethod: AffiliatePayoutMethod;
  balance: number;
  onSubmit: (data: CreateAffiliateWithdrawalRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AffiliateWithdrawalForm({
  payoutMethod,
  balance,
  onSubmit,
  onCancel,
  isLoading = false,
}: AffiliateWithdrawalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      payoutMethodId: payoutMethod?.id,
    },
  });

  const watchedAmount = watch("amount");

  const handleFormSubmit = async (data: WithdrawalFormValues) => {
    if (data.amount > balance || !data.payoutMethodId) {
      return;
    }
    try {
      setIsSubmitting(true);
      const formData: CreateAffiliateWithdrawalRequest = {
        amount: data.amount,
        payoutMethodId: data.payoutMethodId,
      };
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yêu cầu rút tiền</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Balance Display */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Số dư khả dụng:
              </span>
              <Price price={balance} size="base" weight="semibold" showCurrency={true} currency="đ" />
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền rút (VND) *</Label>
            <Input
              id="amount"
              type="number"
              {...register("amount", { valueAsNumber: true })}
              placeholder="Nhập số tiền muốn rút"
              min={1}
              max={balance}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
            {watchedAmount > balance && (
              <p className="text-sm text-red-500">
                Số tiền rút không được vượt quá số dư khả dụng
              </p>
            )}
            {watchedAmount > 0 && watchedAmount <= balance && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                Số tiền còn lại sau khi rút:{" "}
                <Price price={balance - watchedAmount} size="sm" weight="semibold" showCurrency={true} currency="đ" />
              </p>
            )}
          </div>

          {/* Payout Method Selection */}
          <div className="space-y-3">
            <Label>Tài khoản nhận tiền</Label>
            {payoutMethod ? (
                <div
                  key={payoutMethod.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor={`payout-${payoutMethod.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {payoutMethod.displayName}
                        </Label>
                        {payoutMethod.status === "ACTIVE" && (
                          <Badge variant="default" className="text-xs">
                            Hoạt động
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          <span className="font-medium">Ngân hàng:</span>{" "}
                          {payoutMethod.bankName}
                        </p>
                        <p>
                          <span className="font-medium">Chủ tài khoản:</span>{" "}
                          {payoutMethod.accountHolder}
                        </p>
                        <p>
                          <span className="font-medium">Số tài khoản:</span>{" "}
                          <code className="px-1 py-0.5 bg-muted rounded text-xs">
                            {payoutMethod.identifier}
                          </code>
                        </p>
                      </div>
                  </div>
                </div>
            ) : (
              <div className="text-center py-4 border rounded-lg">
                <p className="text-muted-foreground mb-4">
                  Bạn chưa có tài khoản nhận tiền nào.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    window.location.href = "/account/affiliate/payouts";
                  }}
                >
                  Thêm tài khoản
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Đóng
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                isLoading ||
                !payoutMethod ||
                watchedAmount > balance ||
                watchedAmount <= 0 ||
                !payoutMethod.id
              }
            >
              {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu rút tiền"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
