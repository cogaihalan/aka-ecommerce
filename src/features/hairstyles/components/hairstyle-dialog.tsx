"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateHairstyleRequest,
  UpdateHairstyleRequest,
} from "@/lib/api/types";
import { unifiedHairstyleService } from "@/lib/api/services/unified/extensions/hairstyles";
import type { Hairstyle } from "@/types";

const hairstyleSchema = z.object({
  name: z.string().min(1, "Tên kiểu tóc là bắt buộc"),
  barberName: z.string().min(1, "Tên thợ cắt tóc là bắt buộc"),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Vui lòng chọn giới tính",
  }),
});

type HairstyleFormValues = z.infer<typeof hairstyleSchema>;

interface HairstyleDialogProps {
  hairstyle?: Hairstyle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function HairstyleDialog({
  hairstyle,
  open,
  onOpenChange,
  onSuccess,
}: HairstyleDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!hairstyle;

  const form = useForm<HairstyleFormValues>({
    resolver: zodResolver(hairstyleSchema),
    defaultValues: {
      name: "",
      barberName: "",
      gender: "MALE",
    },
  });

  // Reset form when hairstyle changes or dialog opens
  useEffect(() => {
    if (open) {
      if (isEditMode && hairstyle) {
        form.reset({
          name: hairstyle.name,
          barberName: hairstyle.barberName,
          gender: hairstyle.gender,
        });
      } else {
        form.reset({
          name: "",
          barberName: "",
          gender: "MALE",
        });
      }
    }
  }, [open, isEditMode, hairstyle, form]);

  const onSubmit = async (values: HairstyleFormValues) => {
    setIsLoading(true);
    try {
      if (isEditMode && hairstyle) {
        const updateData: UpdateHairstyleRequest = {
          name: values.name,
          barberName: values.barberName,
          gender: values.gender,
        };

        await unifiedHairstyleService.updateHairstyle(hairstyle.id, updateData);
        toast.success("Cập nhật kiểu tóc thành công");
      } else {
        const createData: CreateHairstyleRequest = {
          name: values.name,
          barberName: values.barberName,
          gender: values.gender,
        };

        const newHairstyle =
          await unifiedHairstyleService.createHairstyles(createData);
        toast.success("Tạo kiểu tóc thành công");
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving hairstyle:", error);
      toast.error("Lưu kiểu tóc thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa kiểu tóc" : "Thêm kiểu tóc mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin kiểu tóc."
              : "Tạo kiểu tóc mới với thông tin chi tiết."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên kiểu tóc</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên kiểu tóc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barberName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên thợ cắt tóc</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên thợ cắt tóc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Nam</SelectItem>
                      <SelectItem value="FEMALE">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Đang lưu..."
                  : isEditMode
                    ? "Cập nhật kiểu tóc"
                    : "Tạo kiểu tóc"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
