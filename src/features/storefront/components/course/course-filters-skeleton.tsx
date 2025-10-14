import { Skeleton } from "@/components/ui/skeleton";

export function CourseFiltersSkeleton() {
  return (
    <div className="space-y-4">
      {/* Filters header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-20 lg:hidden" />
      </div>

      <div className="space-y-4">
        {/* Search skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Sort skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Clear filters skeleton */}
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
