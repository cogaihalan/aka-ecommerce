"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Submission } from "@/types";

const submissionSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
    // contestId: z
    //   .string()
    //   .min(1, "Contest ID is required")
    //   .transform((val) => parseInt(val, 10))
    //   .refine((v) => !Number.isNaN(v), { message: "Contest ID must be a number" }),
  barberName: z.string().min(1, "Tên barber là bắt buộc"),
  barberAddress: z.string().min(1, "Địa chỉ barber là bắt buộc"),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;

interface SubmissionFormProps {
  submission?: Submission;
  onSubmit: (data: SubmissionFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SubmissionForm({
  submission,
  onSubmit,
  onCancel,
  isLoading = false,
}: SubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      name: submission?.name || "",
      description: submission ? (submission as any).description || "" : "",
      barberName: submission?.barberName || "",
      barberAddress: submission?.barberAddress || "",
    } as any,
  });

  const handleFormSubmit = async (data: SubmissionFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên *</Label>
        <Input id="name" placeholder="Nhập tên bài dự thi" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả *</Label>
        <Textarea
          id="description"
          placeholder="Nhập mô tả bài dự thi"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="barberName">Tên barber *</Label>
        <Input
          id="barberName"
          placeholder="Nhập tên barber"
          {...register("barberName")}
        />
        {errors.barberName && (
          <p className="text-sm text-red-500">{errors.barberName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="barberAddress">Địa chỉ barber *</Label>
        <Input
          id="barberAddress"
          placeholder="Nhập địa chỉ barber"
          {...register("barberAddress")}
        />
        {errors.barberAddress && (
          <p className="text-sm text-red-500">{errors.barberAddress.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? "Đang lưu..." : submission ? "Lưu" : "Tạo"}
        </Button>
      </div>
    </form>
  );
}


