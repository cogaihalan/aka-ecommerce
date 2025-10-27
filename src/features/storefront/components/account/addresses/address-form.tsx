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
        <CardTitle>{address ? "Edit Address" : "Add New Address"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="space-y-2">
            <Label htmlFor="recipientName">Recipient Name *</Label>
            <Input
              id="recipientName"
              {...register("recipientName")}
              placeholder="Enter recipient name"
            />
            {errors.recipientName && (
              <p className="text-sm text-red-500">
                {errors.recipientName.message}
              </p>
            )}
          </div>

          {/* Address Fields */}
          <div className="space-y-2">
            <Label htmlFor="recipientAddress">Address *</Label>
            <Input
              id="recipientAddress"
              {...register("recipientAddress")}
              placeholder="Enter address"
            />
            {errors.recipientAddress && (
              <p className="text-sm text-red-500">
                {errors.recipientAddress.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="recipientPhone">Phone Number *</Label>
            <Input
              id="recipientPhone"
              {...register("recipientPhone")}
              placeholder="Enter phone number"
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
            <Label htmlFor="isDefault">Set as default address</Label>
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
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting
                ? "Saving..."
                : address
                  ? "Update Address"
                  : "Add Address"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
