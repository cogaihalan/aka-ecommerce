import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function ProductRating({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
  className,
}: ProductRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const starSize = sizeClasses[size];
  const textSize = textSizeClasses[size];

  // Round to nearest integer for star display
  const displayRating = rating || 0;
  const fullStars = Math.round(displayRating);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={cn(
              starSize,
              value <= fullStars
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <span className={cn("font-medium", textSize)}>
          {displayRating.toFixed(1)}
        </span>
        {showCount && reviewCount !== undefined && reviewCount > 0 && (
          <span className={cn("text-muted-foreground", textSize)}>
            ({reviewCount})
          </span>
        )}
      </div>
    </div>
  );
}

