"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  adminCategoryService,
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/lib/api";
import { categoryFormSchema } from "../lib/validation";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";

// Using the validation schema from the lib file

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: Category;
  categories: Category[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryForm({
  category,
  categories,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingSlug, setIsValidatingSlug] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      parentId: category?.parentId,
      image: category?.image?.url || "",
      isActive: category?.isActive ?? true,
      includeInMenu: category?.includeInMenu ?? true,
      seo: {
        title: category?.seo?.title || "",
        description: category?.seo?.description || "",
        keywords: category?.seo?.keywords || [],
      },
    },
  });

  const watchedSlug = form.watch("slug");
  const watchedName = form.watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (!category && watchedName && !watchedSlug) {
      const generatedSlug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", generatedSlug);
    }
  }, [watchedName, watchedSlug, category, form]);

  // Validate slug uniqueness
  useEffect(() => {
    const validateSlug = async () => {
      if (watchedSlug && watchedSlug.length > 0) {
        setIsValidatingSlug(true);
        try {
          const result = await adminCategoryService.validateSlug(
            watchedSlug,
            category?.id
          );
          if (!result.isValid) {
            form.setError("slug", { message: result.message });
          } else {
            form.clearErrors("slug");
          }
        } catch (error) {
          console.error("Error validating slug:", error);
        } finally {
          setIsValidatingSlug(false);
        }
      }
    };

    const timeoutId = setTimeout(validateSlug, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedSlug, category?.id, form]);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    try {
      if (category) {
        // Update existing category
        const updateData: UpdateCategoryRequest = {
          id: category.id,
          ...data,
        };
        await adminCategoryService.updateCategory(updateData);
        toast.success("Category updated successfully");
      } else {
        // Create new category
        const createData: CreateCategoryRequest = {
          ...data,
        };
        await adminCategoryService.createCategory(createData);
        toast.success("Category created successfully");
      }

      onSuccess?.();
      if (!onSuccess) {
        router.push("/admin/categories");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    if (!onCancel) {
      router.back();
    }
  };

  // Filter out current category and its children from parent options
  const availableParentCategories = categories.filter((cat) => {
    if (cat.id === category?.id) return false;
    if (category) {
      // Check if this category is a child of the current category
      const isChild = cat.path.includes(category.path);
      return !isChild;
    }
    return true;
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Information</CardTitle>
                <CardDescription>
                  Basic information about the category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="category-slug" {...field} />
                            {isValidatingSlug && (
                              <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin" />
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          URL-friendly version of the name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Category description"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Category</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(
                              value === "none" ? undefined : parseInt(value)
                            )
                          }
                          value={field.value?.toString() || "none"}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select parent category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              No parent (Root category)
                            </SelectItem>
                            {availableParentCategories.map((cat) => (
                              <SelectItem
                                key={cat.id}
                                value={cat.id.toString()}
                              >
                                {"  ".repeat(cat.level)}
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL to the category image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Search engine optimization settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="seo.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seo.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="SEO description"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Category visibility and behavior settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Whether this category is active and visible
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeInMenu"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Include in Menu
                        </FormLabel>
                        <FormDescription>
                          Show this category in navigation menus
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-2 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {category ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
