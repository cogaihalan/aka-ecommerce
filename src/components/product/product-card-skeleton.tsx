"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function ProductCardSkeleton({
  variant = "default",
  className,
}: ProductCardSkeletonProps) {
  if (variant === "compact") {
    return (
      <Card className={cn("group h-full flex flex-col", className)}>
        <CardContent className="p-3 flex-1 flex flex-col">
          <div className="flex gap-3">
            {/* Image skeleton */}
            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
            
            {/* Content skeleton */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-7 w-7 rounded" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card className={cn("group relative overflow-hidden h-full flex flex-col", className)}>
        <Skeleton className="aspect-square rounded-t-lg" />
        
        <CardContent className="px-4 pb-4 flex flex-col h-full">
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>

            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />

            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-20" />
            </div>
          </div>

          <div className="mt-auto space-y-2">
            <Skeleton className="h-9 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn("group h-full flex flex-col", className)}>
      <Skeleton className="aspect-square rounded-t-lg" />
      
      <CardContent className="px-4 pb-4 flex flex-col h-full">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-20" />

          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />

          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />

          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
