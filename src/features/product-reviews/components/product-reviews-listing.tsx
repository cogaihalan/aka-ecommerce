import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./reviews-tables/columns";
import { serverProductReviewService } from "@/lib/api/services/server";

export default async function ProductReviewsListingPage() {
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const rating = searchParamsCache.get("rating");
  const status = searchParamsCache.get("status");
  const productId = searchParamsCache.get("productId");

  const queryParams = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    sort: sort && sort.length > 0
      ? sort.map(item => `${item.id},${item.desc ? "desc" : "asc"}`)
      : undefined,
    rating: rating ? parseInt(rating.toString()) : undefined,
    statuses: status?.toString() ? [status.toString()] : undefined,
    productId: productId ? parseInt(productId.toString()) : undefined,
  };

  let totalReviews = 0;
  let reviews: any[] = [];

  try {
    const response = await serverProductReviewService.getProductReviews(queryParams);
    totalReviews = response.pagination?.total || response.items?.length || 0;
    reviews = response.items || [];
  } catch (error) {
    console.error("Error fetching product reviews:", error);
  }

  return (
    <DataTableWrapper
      data={reviews}
      totalItems={totalReviews}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}

