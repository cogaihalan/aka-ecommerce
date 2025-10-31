"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MegaMenuSkeletonProps {
  className?: string;
  itemCount?: number;
}

export const MegaMenuSkeleton: FC<MegaMenuSkeletonProps> = ({ 
  className, 
  itemCount = 4
}) => {
  return (
    <nav className={cn("relative hidden lg:block", className)}>
      <ul className="flex items-center space-x-4">
        {Array.from({ length: itemCount }).map((_, index) => (
          <li key={index} className="relative">
            <div className="flex items-center gap-2 py-2 px-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MegaMenuSkeleton;
