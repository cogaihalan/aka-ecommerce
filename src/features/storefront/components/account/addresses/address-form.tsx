"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Address } from "@/types";
import { useI18n } from "@/components/providers/i18n-provider";

const addressSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientAddress: z.string().min(1, "Address is required"),
  recipientPhone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^(\+84|84|0)[1-9][0-9]{8,9}$/,
      "Please enter a valid Vietnamese phone number"
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
  const { t } = useI18n();
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
        <CardTitle>{address ? t("address.editTitle") : t("address.addTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="space-y-2">
            <Label htmlFor="recipientName">{t("address.recipientName")} *</Label>
            <Input
              id="recipientName"
              {...register("recipientName")}
              placeholder={t("address.recipientNamePlaceholder")}
            />
            {errors.recipientName && (
              <p className="text-sm text-red-500">
                {errors.recipientName.message}
              </p>
            )}
          </div>

          {/* Address Fields */}
          <div className="space-y-2">
            <Label htmlFor="recipientAddress">{t("address.address")} *</Label>
            <Input
              id="recipientAddress"
              {...register("recipientAddress")}
              placeholder={t("address.addressPlaceholder")}
            />
            {errors.recipientAddress && (
              <p className="text-sm text-red-500">
                {errors.recipientAddress.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="recipientPhone">{t("address.phone")} *</Label>
            <Input
              id="recipientPhone"
              {...register("recipientPhone")}
              placeholder={t("address.phonePlaceholder")}
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
            <Label htmlFor="isDefault">{t("address.setDefault")}</Label>
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
              {t("common.close")}
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting
                ? t("address.saving")
                : address
                  ? t("address.update")
                  : t("address.add")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
