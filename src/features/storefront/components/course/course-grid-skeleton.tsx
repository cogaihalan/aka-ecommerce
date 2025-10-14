import { Skeleton } from "@/components/ui/skeleton";

export function CourseGridSkeleton() {
  return (
    <div className="space-y-6">
      {/* Results count skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Course grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            {/* Course thumbnail skeleton */}
            <Skeleton className="aspect-video w-full rounded-lg" />
            
            {/* Course info skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              
              {/* Course meta skeleton */}
              <div className="flex items-center gap-4 pt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              
              {/* Action button skeleton */}
              <Skeleton className="h-9 w-full mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
