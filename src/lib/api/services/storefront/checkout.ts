import { apiClient } from "@/lib/api/client";
import type { Order, Cart, Address, PaymentInfo } from "@/lib/api/types";
import type { ShippingInfo } from "@/types/product";

export class StorefrontCheckoutService {
  private basePath = "/api/checkout";

  // Initialize checkout
  async initializeCheckout(): Promise<{
    checkoutId: string;
    cart: Cart;
    availablePaymentMethods: Array<{
      id: string;
      name: string;
      description: string;
      icon?: string;
    }>;
    availableShippingMethods: Array<{
      id: string;
      name: string;
      description: string;
      cost: number;
      estimatedDays: string;
    }>;
  }> {
    const response = await apiClient.post(`${this.basePath}/initialize`);
    return response.data!;
  }

  // Update checkout information
  async updateCheckoutInfo(data: {
    email?: string;
    phone?: string;
    shippingAddress?: Partial<Address>;
    billingAddress?: Partial<Address>;
    shippingMethodId?: string;
    paymentMethodId?: string;
  }): Promise<Cart> {
    const response = await apiClient.patch<Cart>(this.basePath, data);
    return response.data!;
  }

  // Update shipping address
  async updateShippingAddress(address: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  }): Promise<{
    cart: Cart;
    availableShippingMethods: Array<{
      id: string;
      name: string;
      description: string;
      cost: number;
      estimatedDays: string;
    }>;
  }> {
    const response = await apiClient.patch(
      `${this.basePath}/shipping-address`,
      address
    );
    return response.data!;
  }

  // Update billing address
  async updateBillingAddress(address: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  }): Promise<Cart> {
    const response = await apiClient.patch<Cart>(
      `${this.basePath}/billing-address`,
      address
    );
    return response.data!;
  }

  // Update shipping method
  async updateShippingMethod(shippingMethodId: string): Promise<Cart> {
    const response = await apiClient.patch<Cart>(
      `${this.basePath}/shipping-method`,
      { shippingMethodId }
    );
    return response.data!;
  }

  // Update payment method
  async updatePaymentMethod(paymentMethodId: string): Promise<Cart> {
    const response = await apiClient.patch<Cart>(
      `${this.basePath}/payment-method`,
      { paymentMethodId }
    );
    return response.data!;
  }

  // Apply coupon
  async applyCoupon(code: string): Promise<{
    success: boolean;
    message: string;
    cart: Cart;
  }> {
    const response = await apiClient.post(`${this.basePath}/coupon`, { code });
    return response.data!;
  }

  // Remove coupon
  async removeCoupon(code: string): Promise<Cart> {
    const response = await apiClient.delete<Cart>(
      `${this.basePath}/coupon/${code}`
    );
    return response.data!;
  }

  // Validate checkout
  async validateCheckout(): Promise<{
    valid: boolean;
    errors: Array<{
      field: string;
      message: string;
    }>;
    warnings: Array<{
      field: string;
      message: string;
    }>;
  }> {
    const response = await apiClient.post(`${this.basePath}/validate`);
    return response.data!;
  }

  // Process payment
  async processPayment(paymentData: {
    paymentMethodId: string;
    paymentToken?: string;
    savePaymentMethod?: boolean;
    billingAddress?: Partial<Address>;
  }): Promise<{
    success: boolean;
    orderId?: number;
    orderNumber?: string;
    paymentId?: string;
    redirectUrl?: string;
    message?: string;
  }> {
    const response = await apiClient.post(
      `${this.basePath}/payment`,
      paymentData
    );
    return response.data!;
  }

  // Complete checkout
  async completeCheckout(): Promise<{
    order: Order;
    payment: PaymentInfo;
    shipping: ShippingInfo;
  }> {
    const response = await apiClient.post(`${this.basePath}/complete`);
    return response.data!;
  }

  // Get checkout summary
  async getCheckoutSummary(): Promise<{
    cart: Cart;
    shipping: {
      method: string;
      cost: number;
      estimatedDays: string;
    };
    payment: {
      method: string;
      last4?: string;
    };
    pricing: {
      subtotal: number;
      tax: number;
      shipping: number;
      discount: number;
      total: number;
      currency: string;
    };
    appliedCoupons: Array<{
      code: string;
      discount: number;
      type: string;
    }>;
  }> {
    const response = await apiClient.get(`${this.basePath}/summary`);
    return response.data!;
  }

  // Save checkout progress
  async saveCheckoutProgress(): Promise<{ savedAt: string }> {
    const response = await apiClient.post(`${this.basePath}/save`);
    return response.data!;
  }

  // Restore checkout progress
  async restoreCheckoutProgress(): Promise<Cart> {
    const response = await apiClient.post<Cart>(`${this.basePath}/restore`);
    return response.data!;
  }

  // Get available payment methods
  async getAvailablePaymentMethods(): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      icon?: string;
      isDefault: boolean;
      requiresBillingAddress: boolean;
    }>
  > {
    const response = await apiClient.get(`${this.basePath}/payment-methods`);
    return response.data!;
  }

  // Get available shipping methods
  async getAvailableShippingMethods(): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      cost: number;
      estimatedDays: string;
      carrier?: string;
      freeShippingThreshold?: number;
    }>
  > {
    const response = await apiClient.get(`${this.basePath}/shipping-methods`);
    return response.data!;
  }

  // Calculate shipping costs
  async calculateShipping(address: {
    country: string;
    state: string;
    postalCode: string;
  }): Promise<
    Array<{
      method: string;
      cost: number;
      estimatedDays: string;
      freeShippingEligible: boolean;
    }>
  > {
    const response = await apiClient.post(
      `${this.basePath}/calculate-shipping`,
      address
    );
    return response.data!;
  }

  // Calculate taxes
  async calculateTaxes(): Promise<{
    tax: number;
    breakdown: Array<{
      name: string;
      rate: number;
      amount: number;
    }>;
    taxIncluded: boolean;
  }> {
    const response = await apiClient.post(`${this.basePath}/calculate-taxes`);
    return response.data!;
  }

  // Get checkout steps
  async getCheckoutSteps(): Promise<
    Array<{
      id: string;
      name: string;
      completed: boolean;
      current: boolean;
      required: boolean;
    }>
  > {
    const response = await apiClient.get(`${this.basePath}/steps`);
    return response.data!;
  }

  // Update checkout step
  async updateCheckoutStep(
    stepId: string,
    data: any
  ): Promise<{
    step: {
      id: string;
      name: string;
      completed: boolean;
      current: boolean;
    };
    nextStep?: string;
  }> {
    const response = await apiClient.patch(
      `${this.basePath}/steps/${stepId}`,
      data
    );
    return response.data!;
  }

  // Guest checkout
  async guestCheckout(data: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    shippingAddress: Address;
    billingAddress?: Address;
    shippingMethodId: string;
    paymentMethodId: string;
  }): Promise<{
    order: Order;
    payment: PaymentInfo;
    shipping: ShippingInfo;
  }> {
    const response = await apiClient.post(`${this.basePath}/guest`, data);
    return response.data!;
  }

  // Express checkout (one-click)
  async expressCheckout(data: {
    productId: number;
    variantId?: number;
    quantity: number;
    shippingAddress: Address;
    paymentMethodId: string;
  }): Promise<{
    order: Order;
    payment: PaymentInfo;
    shipping: ShippingInfo;
  }> {
    const response = await apiClient.post(`${this.basePath}/express`, data);
    return response.data!;
  }

  // Abandoned checkout recovery
  async recoverCheckout(checkoutToken: string): Promise<Cart> {
    const response = await apiClient.post<Cart>(`${this.basePath}/recover`, {
      checkoutToken,
    });
    return response.data!;
  }

  // Send checkout reminder
  async sendCheckoutReminder(): Promise<{ sent: boolean }> {
    const response = await apiClient.post(`${this.basePath}/remind`);
    return response.data!;
  }

  // Get checkout analytics
  async getCheckoutAnalytics(): Promise<{
    stepCompletion: Array<{
      step: string;
      completionRate: number;
      dropoffRate: number;
    }>;
    averageTimeToComplete: number;
    conversionRate: number;
  }> {
    const response = await apiClient.get(`${this.basePath}/analytics`);
    return response.data!;
  }

  // Cancel checkout
  async cancelCheckout(): Promise<void> {
    await apiClient.delete(this.basePath);
  }

  // Get checkout status
  async getCheckoutStatus(): Promise<{
    status: "active" | "completed" | "cancelled" | "expired";
    expiresAt?: string;
    lastActivity: string;
  }> {
    const response = await apiClient.get(`${this.basePath}/status`);
    return response.data!;
  }

  // Extend checkout session
  async extendCheckoutSession(): Promise<{ expiresAt: string }> {
    const response = await apiClient.patch(`${this.basePath}/extend`);
    return response.data!;
  }
}

// Export singleton instance
export const storefrontCheckoutService = new StorefrontCheckoutService();
