"use client";

import { useState, useEffect } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateCategoryRequest, UpdateCategoryRequest } from "@/lib/api/types";
import { unifiedCategoryService } from "@/lib/api/services/unified";
import { useAppStore } from "@/stores/app-store";
import { toast } from "sonner";
import { Category } from "@/types";
import { useApp } from "@/components/providers/app-provider";
import { FileUploader } from "@/components/file-uploader";
import { Progress } from "@/components/ui/progress";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  parentId: z.number().default(0),
});

type FormData = z.infer<typeof formSchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category; // For editing
  onSuccess?: () => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [isUploading, setIsUploading] = useState(false);
  const { categories } = useApp();
  const { addCategory, updateCategory } = useAppStore();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      parentId: category?.parentId || 0,
    },
  });

  const handleImageUpload = async (files: File[]) => {
    if (!category || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];

    try {
      // Simulate progress
      setUploadProgress({ [file.name]: 0 });

      const interval = setInterval(() => {
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: Math.min(prev[file.name] + 10, 90),
        }));
      }, 100);

      const updatedCategory = await unifiedCategoryService.uploadCategoryImage({
        id: category.id,
        file: file,
      });

      clearInterval(interval);
      setUploadProgress({ [file.name]: 100 });

      // Update the category immediately in the store
      updateCategory(updatedCategory);

      // Update the local category state to reflect changes immediately
      Object.assign(category, updatedCategory);

      toast.success("Ảnh danh mục đã được tải lên thành công");

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress({});
      }, 1000);
    } catch (error) {
      toast.error("Failed to upload thumbnail");
      console.error("Error uploading thumbnail:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteThumbnail = async () => {
    if (!category) return;

    try {
      await unifiedCategoryService.deleteCategoryThumbnail(category.id);
      const updatedCategory = { ...category, thumbnailUrl: "" };

      // Update the category immediately in the store
      updateCategory(updatedCategory);

      // Update the local category state to reflect changes immediately
      Object.assign(category, updatedCategory);

      toast.success("Ảnh danh mục đã được xóa thành công");
    } catch (error) {
      toast.error("Lỗi khi xóa ảnh danh mục");
      console.error("Error deleting thumbnail:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (category) {
        // Update existing category
        const updateData: UpdateCategoryRequest = {
          id: category.id,
          ...data,
        };
        const updatedCategory = await unifiedCategoryService.updateCategory(
          category.id,
          updateData
        );
        updateCategory(updatedCategory);
        toast.success("Cập nhật danh mục thành công");
      } else {
        // Create new category
        const createData: CreateCategoryRequest = {
          name: data.name,
          description: data.description,
          ...(data.parentId !== 0 && { parentId: data.parentId }),
        };
        const newCategory =
          await unifiedCategoryService.createCategory(createData);
        addCategory(newCategory);
        toast.success("Tạo danh mục thành công");
      }
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Lưu danh mục thất bại");
      console.error("Error saving category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Cập nhật thông tin danh mục bên dưới."
              : "Thêm danh mục mới cho cửa hàng của bạn."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên danh mục" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả danh mục"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục cha (Không bắt buộc)</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === "none" ? 0 : parseInt(value));
                    }}
                    value={
                      field.value === 0
                        ? "none"
                        : field.value?.toString() || "none"
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục cha" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không có (Danh mục gốc)</SelectItem>
                      {categories
                        .filter((cat) => !category || cat.id !== category.id) // Don't allow self as parent
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail Upload Section - Only show in edit mode */}
            {category && (
              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium">Ảnh danh mục</label>

                {/* Current thumbnail preview - show when thumbnail exists */}
                {category.thumbnailUrl ? (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                        <Image
                          src={category.thumbnailUrl}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={handleDeleteThumbnail}
                        disabled={isUploading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Nhấn biểu tượng xóa để gỡ ảnh hiện tại</p>
                  </div>
                ) : (
                  /* Upload new thumbnail - show only when no thumbnail exists */
                  <div className="space-y-2">
                    <FileUploader
                      value={[]}
                      onUpload={handleImageUpload}
                      progresses={uploadProgress}
                      accept={{
                        "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
                      }}
                      maxSize={5 * 1024 * 1024} // 5MB
                      maxFiles={1}
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <ImageIcon className="h-4 w-4" />
                          <span className="text-sm text-muted-foreground">Đang tải ảnh thu nhỏ...</span>
                        </div>
                        {Object.entries(uploadProgress).map(
                          ([fileName, progress]) => (
                            <div key={fileName} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="truncate">{fileName}</span>
                                <span>{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang lưu..." : category ? "Cập nhật" : "Tạo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
