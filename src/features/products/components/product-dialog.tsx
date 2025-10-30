"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateProductRequest, UpdateProductRequest } from "@/lib/api/types";
import { unifiedProductService } from "@/lib/api/services/unified";
import { toast } from "sonner";
import { useApp } from "@/components/providers/app-provider";

const formSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  stock: z.number().min(0, "Tồn kho phải không âm"),
  price: z.number().min(0, "Giá phải là số dương"),
  discountPrice: z.number().min(0, "Giá khuyến mãi phải không âm").optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED", "OUT_OF_STOCK"]),
  categoryIds: z.array(z.number()).min(1, "Cần ít nhất một danh mục"),
});

type FormData = z.infer<typeof formSchema>;

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any; // For editing
  onSuccess?: () => void;
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { categories } = useApp();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      stock: product?.stock || 0,
      price: product?.price || 0,
      discountPrice: product?.discountPrice || 0,
      status: product?.status || "DRAFT",
      categoryIds: product?.categories?.map((c: any) => c.id) || [],
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (product) {
        // Update existing product
        const updateData: UpdateProductRequest = {
          id: product.id,
          ...data,
        };
        await unifiedProductService.updateProduct(product.id, updateData);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        // Create new product
        const createData: CreateProductRequest = data;
        await unifiedProductService.createProduct(createData);
        toast.success("Tạo sản phẩm thành công");
      }
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Lưu sản phẩm thất bại");
      console.error("Error saving product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {product ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Cập nhật thông tin sản phẩm bên dưới."
              : "Thêm một sản phẩm mới vào cửa hàng của bạn."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sản phẩm</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên sản phẩm" {...field} />
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
                    <Textarea placeholder="Nhập mô tả sản phẩm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tồn kho</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="discountPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá khuyến mãi (Tuỳ chọn)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái sản phẩm" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">Nháp</SelectItem>
                      <SelectItem value="ACTIVE">Đang bán</SelectItem>
                      <SelectItem value="INACTIVE">Ngừng bán</SelectItem>
                      <SelectItem value="ARCHIVED">Lưu trữ</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">Hết hàng</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => {
                const selectedCategories = categories.filter((cat) =>
                  field.value?.includes(cat.id)
                );
                const availableCategories = categories.filter(
                  (cat) => !field.value?.includes(cat.id)
                );

                return (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <div className="space-y-2">
                      {/* Display selected categories */}
                      {selectedCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedCategories.map((category) => (
                            <Badge
                              key={category.id}
                              variant="secondary"
                              className="flex items-center gap-1 pr-1"
                            >
                              {category.name}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => {
                                  const newIds =
                                    field.value?.filter(
                                      (id) => id !== category.id
                                    ) || [];
                                  field.onChange(newIds);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Category selection dropdown */}
                      {availableCategories.length > 0 ? (
                        <Select
                          onValueChange={(value) => {
                            const categoryId = parseInt(value);
                            const currentIds = field.value || [];
                            if (!currentIds.includes(categoryId)) {
                              field.onChange([...currentIds, categoryId]);
                            }
                          }}
                          value=""
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                selectedCategories.length > 0
                                  ? "Thêm danh mục..."
                                  : "Chọn danh mục"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCategories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center justify-center h-10 px-3 py-2 text-sm text-muted-foreground border border-input rounded-md bg-muted/50">
                          Đã chọn tất cả danh mục
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang lưu..." : product ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
