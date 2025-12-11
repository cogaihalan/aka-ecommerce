"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { AffiliatePayoutMethod } from "@/types";
import { CreateAffiliateWithdrawalRequest } from "@/lib/api/types";
import { CreditCard } from "lucide-react";

const withdrawalSchema = z.object({
  amount: z
    .number()
    .min(1, "Số tiền phải lớn hơn 0")
    .positive("Số tiền phải là số dương"),
  payoutMethodId: z.number().min(1, "Vui lòng chọn phương thức thanh toán"),
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

interface AffiliateWithdrawalFormProps {
  payoutMethods: AffiliatePayoutMethod[];
  balance: number;
  onSubmit: (data: CreateAffiliateWithdrawalRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AffiliateWithdrawalForm({
  payoutMethods,
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
    setValue,
    watch,
  } = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      payoutMethodId: 0,
    },
  });

  const watchedPayoutMethodId = watch("payoutMethodId");
  const watchedAmount = watch("amount");

  const handleFormSubmit = async (data: WithdrawalFormValues) => {
    if (data.amount > balance) {
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

  const activePayoutMethods = useMemo(() => payoutMethods.filter(
    (pm) => pm.status === "ACTIVE"
  ), [payoutMethods]);

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
              <span className="text-lg font-bold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(balance)}
              </span>
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
              <p className="text-sm text-muted-foreground">
                Số tiền còn lại sau khi rút:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(balance - watchedAmount)}
              </p>
            )}
          </div>

          {/* Payout Method Selection */}
          <div className="space-y-3">
            <Label>Phương thức thanh toán *</Label>
            {activePayoutMethods.length > 0 ? (
              <RadioGroup
                value={watchedPayoutMethodId?.toString() || ""}
                onValueChange={(value) =>
                  setValue("payoutMethodId", parseInt(value))
                }
                className="space-y-3"
              >
                {activePayoutMethods.map((payoutMethod) => (
                  <div
                    key={payoutMethod.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <RadioGroupItem
                      value={payoutMethod.id.toString()}
                      id={`payout-${payoutMethod.id}`}
                      className="mt-1"
                    />
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
                ))}
              </RadioGroup>
            ) : (
              <div className="text-center py-4 border rounded-lg">
                <p className="text-muted-foreground mb-4">
                  Bạn chưa có phương thức thanh toán nào. Vui lòng thêm phương
                  thức thanh toán trước khi rút tiền.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    window.location.href = "/account/affiliate/payouts";
                  }}
                >
                  Thêm phương thức thanh toán
                </Button>
              </div>
            )}
            {errors.payoutMethodId && (
              <p className="text-sm text-red-500">
                {errors.payoutMethodId.message}
              </p>
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
                activePayoutMethods.length === 0 ||
                watchedAmount > balance ||
                watchedAmount <= 0 ||
                !watchedPayoutMethodId
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
