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
import { Address } from "@/lib/api/types";

const addressSchema = z.object({
  type: z.enum(["shipping", "billing"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  phone: z
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
      type: address?.type || "shipping",
      firstName: address?.firstName || "",
      lastName: address?.lastName || "",
      address1: address?.address1 || "",
      address2: address?.address2 || "",
      phone: address?.phone || "",
      isDefault: address?.isDefault ?? false, // Use nullish coalescing to ensure false for new addresses
    },
  });

  const watchedType = watch("type");
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
          {/* Address Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Address Type</Label>
            <Select
              value={watchedType}
              onValueChange={(value) =>
                setValue("type", value as "shipping" | "billing")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shipping">Shipping Address</SelectItem>
                <SelectItem value="billing">Billing Address</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Address Fields */}
          <div className="space-y-2">
            <Label htmlFor="address1">Address Line 1 *</Label>
            <Input
              id="address1"
              {...register("address1")}
              placeholder="Enter street address"
            />
            {errors.address1 && (
              <p className="text-sm text-red-500">{errors.address1.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address2">Address Line 2 (Optional)</Label>
            <Input
              id="address2"
              {...register("address2")}
              placeholder="Apartment, suite, etc."
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Phone number (e.g., 0123456789)"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
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
            <Label htmlFor="isDefault">Set as default {watchedType} address</Label>
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
