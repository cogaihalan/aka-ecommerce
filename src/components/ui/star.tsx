import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const StarRating = ({ rating, onRatingChange, readonly = false }: { rating: number; onRatingChange?: (rating: number) => void; readonly?: boolean }) => {
    const [hoveredRating, setHoveredRating] = useState(0);
  
    const handleClick = (value: number) => {
      if (!readonly && onRatingChange) {
        onRatingChange(value);
      }
    };
  
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => !readonly && setHoveredRating(value)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            disabled={readonly}
            className={cn(
              "transition-colors",
              readonly ? "cursor-default" : "cursor-pointer"
            )}
          >
            <Star
              className={cn(
                "h-5 w-5",
                value <= (hoveredRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          </button>
        ))}
      </div>
    );
  }
  