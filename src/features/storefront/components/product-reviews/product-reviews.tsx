"use client";

import { useState, useEffect, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { storefrontProductReviewService } from "@/lib/api/services/storefront/product-reviews";
import { ProductReview } from "@/types/product";
import { toast } from "sonner";
import { StarRating } from "@/components/ui/star";
import { ProductReviewItem } from "./product-review-item";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductReviewsProps {
  productId: number;
}



export function ProductReviews({ productId }: ProductReviewsProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPage: 0,
    page: 1,
    limit: 5,
  });
  const pageSize = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await storefrontProductReviewService.getProductReviews({
          productId,
          statuses: ["APPROVED"],
          page: currentPage,
          size: pageSize,
        });
        setReviews(response.items || []);
        setPagination({
          total: response.pagination?.total || 0,
          totalPage: response.pagination?.totalPage || 0,
          page: response.pagination?.page || currentPage,
          limit: response.pagination?.limit || pageSize,
        });
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Không thể tải đánh giá");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, currentPage]);

  const handleSubmitReview = async () => {
    if (!rating || rating < 1 || rating > 5) {
      toast.error("Vui lòng chọn đánh giá từ 1 đến 5 sao");
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập bình luận");
      return;
    }

    try {
      setSubmitting(true);
      await storefrontProductReviewService.createProductReview({
        productId,
        rating,
        comment: comment.trim(),
      });
      toast.success("Đánh giá của bạn đã được gửi và đang chờ duyệt");
      setRating(0);
      setComment("");
      setShowForm(false);
      // Refresh reviews - go to first page to see the new review
      setCurrentPage(1);
      const response = await storefrontProductReviewService.getProductReviews({
        productId,
        statuses: ["APPROVED"],
        page: 1,
        size: pageSize,
      });
      setReviews(response.items || []);
      setPagination({
        total: response.pagination?.total || 0,
        totalPage: response.pagination?.totalPage || 0,
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || pageSize,
      });
    } catch (error: any) {
      console.error("Error creating review:", error);
      toast.error(error?.response?.data?.message || "Không thể gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Đánh giá</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Đánh giá ({pagination.total})</CardTitle>
          {isAuthenticated && !showForm && (
            <Button onClick={() => setShowForm(true)} size="sm">
              Viết đánh giá
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Review Form - Only for logged-in users */}
        {isAuthenticated && showForm && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="space-y-2">
              <Label>Đánh giá của bạn *</Label>
              <StarRating rating={rating} onRatingChange={setRating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Bình luận *</Label>
              <Textarea
                id="comment"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSubmitReview}
                disabled={submitting || !rating || !comment.trim()}
                size="sm"
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gửi đánh giá
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setRating(0);
                  setComment("");
                }}
                size="sm"
                disabled={submitting}
              >
                Hủy
              </Button>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            <p>Vui lòng đăng nhập để viết đánh giá</p>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            {isAuthenticated && (
              <p className="text-sm mt-2">Hãy là người đầu tiên đánh giá!</p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {reviews.map((review) => (
                <Fragment key={review.id}>
                  <ProductReviewItem review={review} />
                </Fragment>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPage > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        className={
                          currentPage <= 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, pagination.totalPage) }, (_, i) => {
                      let pageNumber;
                      if (pagination.totalPage <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= pagination.totalPage - 2) {
                        pageNumber = pagination.totalPage - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(pagination.totalPage, prev + 1)
                          )
                        }
                        className={
                          currentPage >= pagination.totalPage
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

