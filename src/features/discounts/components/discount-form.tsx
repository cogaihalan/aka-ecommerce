"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DiscountRule,
  DiscountRuleFormData,
  CouponType,
  SimpleAction,
} from "@/types/discount";
import { unifiedDiscountService } from "@/lib/api/services/unified";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Form schema for discount rules
const formSchema = z.object({
  // Basic Information
  name: z.string().min(2, "Discount name must be at least 2 characters."),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  priority: z.number().min(1, "Priority must be at least 1."),

  // Date Range
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  // Usage Limits
  usageLimit: z.number().optional(),
  customerUsageLimit: z.number().optional(),

  // Advanced Settings
  isAdvanced: z.boolean().default(false),

  // Website and Customer Groups
  websiteIds: z.array(z.number()).min(1, "At least one website is required."),
  customerGroupIds: z
    .array(z.number())
    .min(1, "At least one customer group is required."),

  // Coupon Settings
  couponCode: z.string().optional(),
  useAutoGeneration: z.boolean().default(false),
  couponType: z
    .enum(["no_coupon", "specific_coupon", "auto"])
    .default("no_coupon"),

  // Shipping Settings
  applyToShipping: z.boolean().default(false),
  freeShipping: z.boolean().default(false),

  // Discount Settings
  sortOrder: z.number().min(1, "Sort order must be at least 1."),
  simpleAction: z
    .enum([
      "by_percent",
      "by_fixed",
      "cart_fixed",
      "buy_x_get_y",
      "buy_x_get_y_percent",
      "buy_x_get_y_fixed",
    ])
    .default("by_percent"),
  discountAmount: z.number().min(0, "Discount amount must be non-negative."),
  discountQty: z.number().optional(),
  discountStep: z.number().optional(),
  applyDiscountToFixedPrice: z.boolean().default(false),
  stopRulesProcessing: z.boolean().default(false),
  rewardPointsDelta: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DiscountFormProps {
  initialData?: DiscountRule | null;
  pageTitle: string;
  discountId: string;
  isLoading?: boolean;
}

export default function DiscountForm({
  initialData,
  pageTitle,
  discountId,
  isLoading = false,
}: DiscountFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: FormData = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    isActive: initialData?.isActive ?? true,
    priority: initialData?.priority || 1,
    startDate: initialData?.startDate?.toISOString().split("T")[0] || "",
    endDate: initialData?.endDate?.toISOString().split("T")[0] || "",
    usageLimit: initialData?.usageLimit || undefined,
    customerUsageLimit: initialData?.customerUsageLimit || undefined,
    isAdvanced: initialData?.isAdvanced ?? false,
    websiteIds: initialData?.websiteIds || [1],
    customerGroupIds: initialData?.customerGroupIds || [1],
    couponCode: initialData?.couponCode || "",
    useAutoGeneration: initialData?.useAutoGeneration ?? false,
    couponType: initialData?.couponType || "no_coupon",
    applyToShipping: initialData?.applyToShipping ?? false,
    freeShipping: initialData?.freeShipping ?? false,
    sortOrder: initialData?.sortOrder || 1,
    simpleAction: initialData?.simpleAction || "by_percent",
    discountAmount: initialData?.discountAmount || 0,
    discountQty: initialData?.discountQty || undefined,
    discountStep: initialData?.discountStep || undefined,
    applyDiscountToFixedPrice: initialData?.applyDiscountToFixedPrice ?? false,
    stopRulesProcessing: initialData?.stopRulesProcessing ?? false,
    rewardPointsDelta: initialData?.rewardPointsDelta || undefined,
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleFormSubmit = async (values: FormData) => {
    setIsSubmitting(true);

    try {
      const discountData: DiscountRuleFormData = {
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        priority: values.priority,
        startDate: values.startDate,
        endDate: values.endDate,
        usageLimit: values.usageLimit,
        customerUsageLimit: values.customerUsageLimit,
        isAdvanced: values.isAdvanced,
        websiteIds: values.websiteIds,
        customerGroupIds: values.customerGroupIds,
        couponCode: values.couponCode,
        useAutoGeneration: values.useAutoGeneration,
        couponType: values.couponType,
        applyToShipping: values.applyToShipping,
        freeShipping: values.freeShipping,
        sortOrder: values.sortOrder,
        simpleAction: values.simpleAction,
        discountAmount: values.discountAmount,
        discountQty: values.discountQty,
        discountStep: values.discountStep,
        applyDiscountToFixedPrice: values.applyDiscountToFixedPrice,
        stopRulesProcessing: values.stopRulesProcessing,
        rewardPointsDelta: values.rewardPointsDelta,
      };

      if (discountId === "new") {
        await unifiedDiscountService.createDiscountRule(discountData);
        toast.success("Discount rule created successfully!");
      } else {
        await unifiedDiscountService.updateDiscountRule(
          Number(discountId),
          discountData
        );
        toast.success("Discount rule updated successfully!");
      }

      router.push("/admin/discounts");
    } catch (error) {
      console.error("Error saving discount rule:", error);
      toast.error("Failed to save discount rule. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Loading...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-8"
          >
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter discount name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Lower numbers have higher priority
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
                          placeholder="Enter discount description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Enable or disable this discount rule
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Conditions Tab */}
              <TabsContent value="conditions" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Coupon Settings</h3>

                  <FormField
                    control={form.control}
                    name="couponType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select coupon type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no_coupon">No Coupon</SelectItem>
                            <SelectItem value="specific_coupon">
                              Specific Coupon
                            </SelectItem>
                            <SelectItem value="auto">Auto Generated</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("couponType") === "specific_coupon" && (
                    <FormField
                      control={form.control}
                      name="couponCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coupon Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter coupon code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="usageLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usage Limit</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="No limit"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of times this discount can be used
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerUsageLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Usage Limit</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="No limit"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum times per customer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Actions Tab */}
              <TabsContent value="actions" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Discount Settings</h3>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="simpleAction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="by_percent">
                                Percentage
                              </SelectItem>
                              <SelectItem value="by_fixed">
                                Fixed Amount
                              </SelectItem>
                              <SelectItem value="cart_fixed">
                                Cart Fixed Amount
                              </SelectItem>
                              <SelectItem value="buy_x_get_y">
                                Buy X Get Y
                              </SelectItem>
                              <SelectItem value="buy_x_get_y_percent">
                                Buy X Get Y %
                              </SelectItem>
                              <SelectItem value="buy_x_get_y_fixed">
                                Buy X Get Y Fixed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            {form.watch("simpleAction").includes("percent")
                              ? "Percentage (e.g., 10 for 10%)"
                              : "Fixed amount"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="discountQty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Quantity to apply discount to
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountStep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Step</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Step for applying discount
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">Shipping Settings</h3>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="applyToShipping"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Apply to Shipping</FormLabel>
                            <FormDescription>
                              Apply discount to shipping costs
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="freeShipping"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Free Shipping</FormLabel>
                            <FormDescription>
                              Provide free shipping with this discount
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Advanced Settings</h3>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="sortOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sort Order</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Display order for this discount
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rewardPointsDelta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reward Points</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Points to award/remove
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="isAdvanced"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Advanced Rule</FormLabel>
                            <FormDescription>
                              Enable advanced conditions and actions
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="applyDiscountToFixedPrice"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Apply to Fixed Price</FormLabel>
                            <FormDescription>
                              Apply discount to fixed price products
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stopRulesProcessing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Stop Further Rules</FormLabel>
                            <FormDescription>
                              Stop processing other discount rules after this
                              one
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/discounts")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {discountId === "new" ? "Create Discount" : "Update Discount"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
