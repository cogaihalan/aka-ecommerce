import { ProductReview } from "@/types/product";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/ui/star";

export const ProductReviewItem = ({ review }: { review: ProductReview }) => {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {review.user?.fullName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between">
              <div>
                <p className="font-medium text-sm">{review.user?.fullName || "Người dùng"}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <StarRating rating={review.rating} readonly />
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          </div>
        </div>
        <Separator />
      </div>
    );
  }