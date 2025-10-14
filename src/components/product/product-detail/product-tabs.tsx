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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        )}
      />
    ));
  };

  return (
    <div className={cn("w-full", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          {/* <TabsTrigger value="reviews">Reviews</TabsTrigger> */}
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Key Features</h4>
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
              <CardTitle>Specifications</CardTitle>
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
                  <p>No specifications available for this product.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* 
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Customer Reviews
                {product.rating && (
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({product.rating}/5)
                    </span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockReviews.length > 0 ? (
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-border/50 pb-4 last:border-b-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {review.name}
                          </span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {review.date}
                      </p>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="shipping" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Free shipping on orders over $
                    {product.shippingInfo?.freeShippingThreshold || 50}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Estimated delivery:{" "}
                    {product.shippingInfo?.estimatedDelivery ||
                      "3-5 business days"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Express shipping available</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Returns & Warranty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    {product.shippingInfo?.returnPolicy ||
                      "30-day return policy"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    {product.warranty || "2-year manufacturer warranty"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Easy returns process</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});
