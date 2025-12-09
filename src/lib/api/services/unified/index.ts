// Unified API services that work for both admin and storefront
export { unifiedProductService } from "./products";
export { unifiedCategoryService } from "./categories";
export { unifiedOrderService } from "./orders";
export { unifiedUserService } from "./users";
export { unifiedPaymentService } from "./payment";
export { unifiedCartService } from "./cart";

// Types are available through the main API index
export { unifiedCourseService } from "./extensions/courses";
export { unifiedContestService } from "./extensions/contest";
export { unifiedProductReviewService } from "./product-reviews";
export { unifiedAffiliateService } from "./extensions/affiliate/affiliate";
export { unifiedAffiliatePayoutService } from "./extensions/affiliate/affiliate-payout";
export { unifiedAffiliateApprovalService } from "./extensions/affiliate/affiliate-approval";
export { unifiedAffiliateLinkService } from "./extensions/affiliate/affiliate-link";