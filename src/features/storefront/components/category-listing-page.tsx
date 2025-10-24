"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  useCategories,
  useAppLoading,
} from "@/components/providers/app-provider";
import Image from "next/image";
import { generateSlug } from "@/lib/utils/slug";

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

  if (!isLoading && !categories.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No categories available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 lg:py-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">Browse products by category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            disableBlockPadding={true}
            key={category.id}
            className="group cursor-pointer overflow-hidden"
          >
            <Link href={`/categories/${generateSlug(category.name)}`}>
              <div className="relative bg-muted overflow-hidden">
                <Image
                  src={
                    category?.thumbnailUrl || "/assets/placeholder-image.jpeg"
                  }
                  alt={category.name}
                  width={300}
                  height={300}
                  className="w-full h-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {category.description}
                  </p>
                )}
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
          <Card disableBlockPadding={true} key={i}>
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
