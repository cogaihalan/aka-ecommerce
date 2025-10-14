"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  useCategories,
  useAppLoading,
} from "@/components/providers/app-provider";

export default function CategoryListingPage() {
  const { categories } = useCategories();
  const { error, isLoading } = useAppLoading();

  if (isLoading) {
    return <CategoryListingSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load categories</p>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No categories available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">Browse products by category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="group cursor-pointer">
            <Link href={`/categories/${category.slug}`}>
              <div className="aspect-video bg-muted rounded-t-lg"></div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {category.description}
                  </p>
                )}
                <Badge variant="secondary">
                  {category.productCount} products
                </Badge>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CategoryListingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="aspect-video rounded-t-lg" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
