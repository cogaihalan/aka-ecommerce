"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { storefrontUserService } from "@/lib/api/services/storefront/user";
import { useAuthUser } from "@/stores/auth-store";
import type { UpdateUserRequest } from "@/lib/api/types";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Tên là bắt buộc và phải có ít nhất 2 ký tự"),
  email: z.string().email("Vui lòng nhập địa chỉ email hợp lệ"),
  phoneNumber: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function GeneralProfileForm() {
  const user = useAuthUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.clerkId) {
      toast.error("Không tìm thấy người dùng. Vui lòng thử lại.");
      return;
    }

    setIsLoading(true);
    try {
      const updateData: UpdateUserRequest = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      };

      await storefrontUserService.updateUserProfile(updateData);

      toast.success("Thông tin cá nhân đã được cập nhật thành công.");
      form.reset();
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin cá nhân. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
        <p className="text-muted-foreground">
          Cập nhật thông tin cá nhân và chi tiết liên hệ.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email của bạn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập số điện thoại của bạn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
