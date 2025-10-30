"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Address } from "@/types";

const addressSchema = z.object({
  recipientName: z.string().min(1, "Tên người nhận là bắt buộc"),
  recipientAddress: z.string().min(1, "Địa chỉ là bắt buộc"),
  recipientPhone: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(
      /^(\+84|84|0)[1-9][0-9]{8,9}$/,
      "Vui lòng nhập số điện thoại hợp lệ"
    ),
  isDefault: z.boolean().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  address?: Address;
  onSubmit: (data: AddressFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AddressForm({
  address,
  onSubmit,
  onCancel,
  isLoading = false,
}: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      recipientName: address?.recipientName || "",
      recipientAddress: address?.recipientAddress || "",
      recipientPhone: address?.recipientPhone || "",
      isDefault: address?.isDefault ?? false, // Use nullish coalescing to ensure false for new addresses
    },
  });

  const watchedIsDefault = watch("isDefault");

  const handleFormSubmit = async (data: AddressFormValues) => {
    try {
      setIsSubmitting(true);
      // Ensure isDefault is explicitly set to false if not checked
      const formData = {
        ...data,
        isDefault: data.isDefault || false,
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
          {address ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="space-y-2">
            <Label htmlFor="recipientName">Tên người nhận *</Label>
            <Input
              id="recipientName"
              {...register("recipientName")}
              placeholder="Nhập tên người nhận"
            />
            {errors.recipientName && (
              <p className="text-sm text-red-500">
                {errors.recipientName.message}
              </p>
            )}
          </div>

          {/* Address Fields */}
          <div className="space-y-2">
            <Label htmlFor="recipientAddress">Địa chỉ *</Label>
            <Input
              id="recipientAddress"
              {...register("recipientAddress")}
              placeholder="Nhập địa chỉ"
            />
            {errors.recipientAddress && (
              <p className="text-sm text-red-500">
                {errors.recipientAddress.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="recipientPhone">Số điện thoại *</Label>
            <Input
              id="recipientPhone"
              {...register("recipientPhone")}
              placeholder="Nhập số điện thoại"
            />
            {errors.recipientPhone && (
              <p className="text-sm text-red-500">
                {errors.recipientPhone.message}
              </p>
            )}
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={watchedIsDefault}
              onCheckedChange={(checked) => {
                setValue("isDefault", !!checked);
              }}
            />
            <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
            {errors.isDefault && (
              <p className="text-sm text-red-500">{errors.isDefault.message}</p>
            )}
          </div>

          {/* Form Actions */}
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
                : address
                  ? "Cập nhật địa chỉ"
                  : "Thêm địa chỉ"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
