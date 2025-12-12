"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AffiliatePayoutMethod } from "@/types";
import { CreateAffiliatePayoutMethodRequest } from "@/lib/api/types";

const payoutMethodSchema = z.object({
  displayName: z.string().min(1, "Tên hiển thị là bắt buộc"),
  bankName: z.string().min(1, "Tên ngân hàng là bắt buộc"),
  accountHolder: z.string().min(1, "Tên chủ tài khoản là bắt buộc"),
  identifier: z.string().min(1, "Số tài khoản là bắt buộc"),
});

type PayoutMethodFormValues = z.infer<typeof payoutMethodSchema>;

interface AffiliatePayoutFormProps {
  payoutMethod?: AffiliatePayoutMethod;
  onSubmit: (data: CreateAffiliatePayoutMethodRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AffiliatePayoutForm({
  payoutMethod,
  onSubmit,
  onCancel,
  isLoading = false,
}: AffiliatePayoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PayoutMethodFormValues>({
    resolver: zodResolver(payoutMethodSchema),
    defaultValues: {
      displayName: payoutMethod?.displayName || "",
      bankName: payoutMethod?.bankName || "",
      accountHolder: payoutMethod?.accountHolder || "",
      identifier: payoutMethod?.identifier || "",
    },
  });

  useEffect(() => {
    if (payoutMethod) {
      setValue("displayName", payoutMethod.displayName);
      setValue("bankName", payoutMethod.bankName);
      setValue("accountHolder", payoutMethod.accountHolder);
      setValue("identifier", payoutMethod.identifier);
    }
  }, [payoutMethod, setValue]);

  const handleFormSubmit = async (data: PayoutMethodFormValues) => {
    try {
      setIsSubmitting(true);
      const formData: CreateAffiliatePayoutMethodRequest = {
        type: "BANK",
        ...data,
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
        <CardTitle>
          {payoutMethod
            ? "Chỉnh sửa phương thức thanh toán"
            : "Thêm phương thức thanh toán mới"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Tên hiển thị *</Label>
            <Input
              id="displayName"
              {...register("displayName")}
              placeholder="Ví dụ: Tài khoản chính"
            />
            {errors.displayName && (
              <p className="text-sm text-red-500">
                {errors.displayName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Tên ngân hàng *</Label>
            <Input
              id="bankName"
              {...register("bankName")}
              placeholder="Ví dụ: Vietcombank"
            />
            {errors.bankName && (
              <p className="text-sm text-red-500">{errors.bankName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountHolder">Tên chủ tài khoản *</Label>
            <Input
              id="accountHolder"
              {...register("accountHolder")}
              placeholder="Nhập tên chủ tài khoản"
            />
            {errors.accountHolder && (
              <p className="text-sm text-red-500">
                {errors.accountHolder.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="identifier">Số tài khoản *</Label>
            <Input
              id="identifier"
              {...register("identifier")}
              placeholder="Nhập số tài khoản"
            />
            {errors.identifier && (
              <p className="text-sm text-red-500">
                {errors.identifier.message}
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
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting
                ? "Đang lưu..."
                : payoutMethod
                  ? "Cập nhật"
                  : "Thêm mới"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
