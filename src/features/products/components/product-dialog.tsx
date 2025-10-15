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
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  categoryIds: z.array(z.number()).min(1, "At least one category is required"),
  price: z.number().min(0, "Price must be positive"),
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
      categoryIds: product?.categories?.map((c: any) => c.id) || [],
      price: product?.price || 0,
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
        toast.success("Product updated successfully");
      } else {
        // Create new product
        const createData: CreateProductRequest = data;
        await unifiedProductService.createProduct(createData);
        toast.success("Product created successfully");
      }
      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to save product");
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
            {product ? "Edit Product" : "Create New Product"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product information below."
              : "Add a new product to your store."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
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
                      placeholder="Enter product description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => {
                const selectedCategories = categories.filter(cat => 
                  field.value?.includes(cat.id)
                );
                const availableCategories = categories.filter(cat => 
                  !field.value?.includes(cat.id)
                );

                return (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
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
                                  const newIds = field.value?.filter(id => id !== category.id) || [];
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
                      <Select
                        onValueChange={(value) => {
                          const categoryId = parseInt(value);
                          const currentIds = field.value || [];
                          if (!currentIds.includes(categoryId)) {
                            field.onChange([...currentIds, categoryId]);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue 
                            placeholder={
                              selectedCategories.length > 0 
                                ? "Add more categories..." 
                                : "Select categories"
                            } 
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories.length > 0 ? (
                            availableCategories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              All categories selected
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : product ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
