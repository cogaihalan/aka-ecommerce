"use client";

import { useState, memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Shield, RotateCcw, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductReviews } from "@/features/storefront/components/product-reviews/product-reviews";

interface ProductTabsProps {
  product: {
    id: number;
    name: string;
    description: string;
    rating?: number;
    reviewCount?: number;
    features?: string[];
    specifications?: Record<string, string>;
    shippingInfo?: {
      freeShippingThreshold?: number;
      estimatedDelivery?: string;
      returnPolicy?: string;
    };
    warranty?: string;
  };
  className?: string;
}

const TAB_OPTIONS = [
  { value: "description", label: "Mô tả" },
  { value: "specifications", label: "Thông số kỹ thuật" },
  { value: "reviews", label: "Đánh giá" },
  { value: "shipping", label: "Vận chuyển & Trả hàng" },
] as const;

export const ProductTabs = memo(function ProductTabs({
  product,
  className,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");
  const isMobile = useIsMobile();

  const renderTabContent = (tabValue: string) => {
    switch (tabValue) {
      case "description":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Mô tả sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Tính năng chính</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "specifications":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Thông số kỹ thuật</CardTitle>
            </CardHeader>
            <CardContent>
              {product.specifications ? (
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-2 border-b border-border/50 last:border-b-0"
                      >
                        <span className="font-medium text-sm">{key}</span>
                        <span className="text-muted-foreground text-sm">
                          {value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Không có thông số kỹ thuật cho sản phẩm này.</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "reviews":
        return <ProductReviews productId={product.id} />;

      case "shipping":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Thông tin vận chuyển
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Miễn phí vận chuyển trên đơn hàng trên $
                    {product.shippingInfo?.freeShippingThreshold || 50}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Thời gian giao hàng dự kiến:{" "}
                    {product.shippingInfo?.estimatedDelivery ||
                      "3-5 business days"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Vận chuyển nhanh có sẵn</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Trả hàng & Bảo hành
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    {product.shippingInfo?.returnPolicy ||
                      "30 ngày trả hàng"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    {product.warranty || "2 năm bảo hành nhà sản xuất"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Quy trình trả hàng dễ dàng</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {isMobile ? (
        <div className="space-y-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {TAB_OPTIONS.find((opt) => opt.value === activeTab)?.label ||
                  "Chọn mục"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TAB_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-6">{renderTabContent(activeTab)}</div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
            {TAB_OPTIONS.map((option) => (
              <TabsTrigger
                key={option.value}
                value={option.value}
                className="py-3 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="description" className="mt-6">
            {renderTabContent("description")}
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            {renderTabContent("specifications")}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {renderTabContent("reviews")}
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            {renderTabContent("shipping")}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
});
