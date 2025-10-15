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

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
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

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (category) {
        // Update existing category
        const updateData: UpdateCategoryRequest = {
          id: category.id,
          ...data,
        };
        const updatedCategory = await unifiedCategoryService.updateCategory(category.id, updateData);
        updateCategory(updatedCategory);
        toast.success("Category updated successfully");
      } else {
        // Create new category
        const createData: CreateCategoryRequest = {
          ...data,
          parentId: data.parentId, // Already defaults to 0
        };
        const newCategory = await unifiedCategoryService.createCategory(createData);
        addCategory(newCategory);
        toast.success("Category created successfully");
      }
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to save category");
      console.error("Error saving category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Update the category information below."
              : "Add a new category to your store."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
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
                  <FormLabel>Parent Category (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === "none" ? 0 : parseInt(value));
                    }}
                    value={field.value === 0 ? "none" : field.value?.toString() || "none"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent (Root Category)</SelectItem>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : category ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
