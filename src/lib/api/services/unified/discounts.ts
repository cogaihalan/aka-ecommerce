import {
  DiscountRuleListParams,
  DiscountValidationResult,
  DiscountCalculationContext,
  AppliedDiscount,
  DiscountRuleFormData,
} from "@/types/discount";

export class UnifiedDiscountService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  }

  async getDiscountRules(params?: DiscountRuleListParams) {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params?.filters?.isActive !== undefined)
      searchParams.append("isActive", params.filters.isActive.toString());
    if (params?.filters?.couponType)
      searchParams.append("couponType", params.filters.couponType);
    if (params?.filters?.websiteIds?.length)
      searchParams.append("websiteIds", params.filters.websiteIds.join(","));
    if (params?.filters?.customerGroupIds?.length)
      searchParams.append(
        "customerGroupIds",
        params.filters.customerGroupIds.join(",")
      );

    const response = await fetch(
      `${this.baseUrl}/api/discounts?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch discount rules: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getDiscountRule(id: number) {
    const response = await fetch(`${this.baseUrl}/api/discounts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch discount rule: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async createDiscountRule(data: DiscountRuleFormData) {
    const response = await fetch(`${this.baseUrl}/api/discounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create discount rule: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async updateDiscountRule(id: number, data: Partial<DiscountRuleFormData>) {
    const response = await fetch(`${this.baseUrl}/api/discounts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update discount rule: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async deleteDiscountRule(id: number) {
    const response = await fetch(`${this.baseUrl}/api/discounts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete discount rule: ${response.statusText}`);
    }

    return true;
  }

  async validateCoupon(
    couponCode: string,
    context: DiscountCalculationContext
  ): Promise<DiscountValidationResult> {
    const response = await fetch(`${this.baseUrl}/api/discounts/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ couponCode, context }),
    });

    if (!response.ok) {
      throw new Error(`Failed to validate coupon: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async calculateDiscounts(
    context: DiscountCalculationContext
  ): Promise<AppliedDiscount[]> {
    // Get all active discount rules
    const rules = await this.getDiscountRules({
      filters: { isActive: true },
      limit: 100,
    });

    const appliedDiscounts: AppliedDiscount[] = [];

    // Process each rule
    for (const rule of rules.data) {
      // Skip if rule has coupon code and no coupon provided
      if (rule.couponCode && !context.couponCode) {
        continue;
      }

      // Skip if coupon code doesn't match
      if (rule.couponCode && context.couponCode !== rule.couponCode) {
        continue;
      }

      // Validate rule conditions
      const validation = await this.validateCoupon(
        rule.couponCode || "",
        context
      );

      if (validation.isValid && validation.discountAmount > 0) {
        appliedDiscounts.push({
          id: `discount-${rule.id}`,
          ruleId: rule.id,
          couponCode: rule.couponCode,
          discountAmount: validation.discountAmount,
          discountType:
            rule.simpleAction === "by_percent" ? "percentage" : "fixed",
          description: rule.name,
          appliedAt: new Date(),
        });
      }
    }

    return appliedDiscounts;
  }
}

// Export singleton instance
export const unifiedDiscountService = new UnifiedDiscountService();
