export interface DiscountRule {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  priority: number;
  startDate?: Date;
  endDate?: Date;
  usageLimit?: number;
  usageCount: number;
  customerUsageLimit?: number;
  isAdvanced: boolean;
  conditions: DiscountCondition[];
  actions: DiscountAction[];
  websiteIds: number[];
  customerGroupIds: number[];
  couponCode?: string;
  useAutoGeneration: boolean;
  timesUsed: number;
  isRss: boolean;
  couponType: CouponType;
  applyToShipping: boolean;
  freeShipping: boolean;
  sortOrder: number;
  simpleAction: SimpleAction;
  discountAmount: number;
  discountQty?: number;
  discountStep?: number;
  applyDiscountToFixedPrice: boolean;
  stopRulesProcessing: boolean;
  rewardPointsDelta?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiscountCondition {
  id: number;
  ruleId: number;
  type: string;
  attribute: string;
  operator: string;
  value: string | number;
  aggregator: "all" | "any";
  conditions: DiscountCondition[];
}

export interface DiscountAction {
  id: number;
  ruleId: number;
  type: string;
  attribute: string;
  operator: string;
  value: string | number;
}

export type CouponType = "no_coupon" | "specific_coupon" | "auto";
export type SimpleAction =
  | "by_percent"
  | "by_fixed"
  | "cart_fixed"
  | "buy_x_get_y"
  | "buy_x_get_y_percent"
  | "buy_x_get_y_fixed";

export interface DiscountCoupon {
  id: number;
  ruleId: number;
  code: string;
  usageLimit?: number;
  usagePerCustomer?: number;
  timesUsed: number;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppliedDiscount {
  id: string;
  ruleId: number;
  couponCode?: string;
  discountAmount: number;
  discountType: "percentage" | "fixed";
  description: string;
  appliedAt: Date;
}

export interface DiscountValidationResult {
  isValid: boolean;
  discountAmount: number;
  message?: string;
  errors: string[];
}

export interface DiscountCalculationContext {
  cartItems: Array<{
    productId: number;
    variantId?: number;
    quantity: number;
    price: number;
    categoryIds: number[];
  }>;
  customerId?: number;
  customerGroupId?: number;
  websiteId: number;
  couponCode?: string;
  subtotal: number;
  shippingAmount: number;
}

export interface DiscountStore {
  appliedDiscounts: AppliedDiscount[];
  availableDiscounts: DiscountRule[];
  isLoading: boolean;
  error: string | null;

  // Actions
  applyDiscount: (couponCode: string) => Promise<DiscountValidationResult>;
  removeDiscount: (discountId: string) => void;
  clearDiscounts: () => void;
  calculateDiscounts: (
    context: DiscountCalculationContext
  ) => Promise<AppliedDiscount[]>;
  validateCoupon: (
    couponCode: string,
    context: DiscountCalculationContext
  ) => Promise<DiscountValidationResult>;
  getAvailableDiscounts: (
    context: DiscountCalculationContext
  ) => Promise<DiscountRule[]>;
}

// Admin-specific types
export interface DiscountRuleFormData {
  name: string;
  description?: string;
  isActive: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  customerUsageLimit?: number;
  isAdvanced: boolean;
  websiteIds: number[];
  customerGroupIds: number[];
  couponCode?: string;
  useAutoGeneration: boolean;
  couponType: CouponType;
  applyToShipping: boolean;
  freeShipping: boolean;
  sortOrder: number;
  simpleAction: SimpleAction;
  discountAmount: number;
  discountQty?: number;
  discountStep?: number;
  applyDiscountToFixedPrice: boolean;
  stopRulesProcessing: boolean;
  rewardPointsDelta?: number;
}

export interface DiscountRuleFilters {
  search?: string;
  isActive?: boolean;
  couponType?: CouponType;
  dateRange?: {
    start: string;
    end: string;
  };
  websiteIds?: number[];
  customerGroupIds?: number[];
}

export interface DiscountRuleListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: DiscountRuleFilters;
}
