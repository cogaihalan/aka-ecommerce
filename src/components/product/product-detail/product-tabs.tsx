"use client";

import { useState, memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, Shield, RotateCcw, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

export const ProductTabs = memo(function ProductTabs({
  product,
  className,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className={cn("w-full", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
          <TabsTrigger value="description">Mô tả</TabsTrigger>
          <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
          {/* <TabsTrigger value="reviews">Reviews</TabsTrigger> */}
          <TabsTrigger value="shipping">Vận chuyển & Trả hàng</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
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
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
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
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
});
