"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AffiliateLink } from "@/types";
import { CreateAffiliateLinkRequest } from "@/lib/api/types";

const affiliateLinkSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  targetUrl: z.string().url("URL không hợp lệ").min(1, "URL đích là bắt buộc"),
  campaignName: z.string().min(1, "Tên chiến dịch là bắt buộc"),
  activeByAffiliate: z.boolean().default(true),
});

type AffiliateLinkFormValues = z.infer<typeof affiliateLinkSchema>;

interface AffiliateLinkFormProps {
  link?: AffiliateLink;
  onSubmit: (data: CreateAffiliateLinkRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AffiliateLinkForm({
  link,
  onSubmit,
  onCancel,
  isLoading = false,
}: AffiliateLinkFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AffiliateLinkFormValues>({
    resolver: zodResolver(affiliateLinkSchema),
    defaultValues: {
      name: link?.name || "",
      targetUrl: link?.targetUrl || "",
      campaignName: link?.campaignName || "",
      activeByAffiliate: link?.activeByAffiliate ?? true,
    },
  });

  useEffect(() => {
    if (link) {
      setValue("name", link.name);
      setValue("targetUrl", link.targetUrl);
      setValue("campaignName", link.campaignName);
      setValue("activeByAffiliate", link.activeByAffiliate);
    }
  }, [link, setValue]);

  const watchedActive = watch("activeByAffiliate");

  const handleFormSubmit = async (data: AffiliateLinkFormValues) => {
    try {
      setIsSubmitting(true);
      const formData: CreateAffiliateLinkRequest = {
        ...data,
        activeByAffiliate: data.activeByAffiliate || false,
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
          {link ? "Chỉnh sửa affiliate link" : "Tạo affiliate link mới"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Tên link *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Nhập tên link"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetUrl">URL đích *</Label>
            <Input
              id="targetUrl"
              type="url"
              {...register("targetUrl")}
              placeholder="https://example.com"
            />
            {errors.targetUrl && (
              <p className="text-sm text-red-500">{errors.targetUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaignName">Tên chiến dịch *</Label>
            <Input
              id="campaignName"
              {...register("campaignName")}
              placeholder="Nhập tên chiến dịch"
            />
            {errors.campaignName && (
              <p className="text-sm text-red-500">
                {errors.campaignName.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Kích hoạt</Label>
              <div className="text-sm text-muted-foreground">
                Bật link này để sử dụng
              </div>
            </div>
            <Switch
              checked={watchedActive}
              onCheckedChange={(checked) => {
                setValue("activeByAffiliate", !!checked);
              }}
            />
            {errors.activeByAffiliate && (
              <p className="text-sm text-red-500">
                {errors.activeByAffiliate.message}
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
                : link
                  ? "Cập nhật link"
                  : "Tạo link"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

