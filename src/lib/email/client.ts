/**
 * Client-side email service helper
 * This provides convenient functions to call the email API routes from the frontend
 */

const API_BASE = "/api/email";

export interface SendOrderConfirmationParams {
  order: any; // Order type
  customerName: string;
  customerEmail: string;
}

export interface SendOrderStatusUpdateParams {
  order: any; // Order type
  customerName: string;
  customerEmail: string;
  previousStatus: string;
  newStatus: string;
  note?: string;
}

export interface SendPaymentNotificationParams {
  order: any; // Order type
  customerName: string;
  customerEmail: string;
  paymentStatus: string;
  note?: string;
}

export interface SendShippedOrderParams {
  order: any; // Order type
  customerName: string;
  customerEmail: string;
  trackingNumber?: string;
  shippingCompany?: string;
  estimatedDeliveryDate?: string;
  note?: string;
}

export interface SendPromotionParams {
  customerName: string;
  customerEmail: string;
  promotionTitle: string;
  promotionDescription: string;
  discountCode?: string;
  discountAmount?: number;
  discountPercentage?: number;
  validFrom?: string;
  validUntil?: string;
  termsAndConditions?: string;
  ctaLink?: string;
  ctaText?: string;
}

export interface SendAffiliateApprovalParams {
  approval: any; // AffiliateApproval type
  customerName: string;
  customerEmail: string;
  status: string; // AffiliateApprovalStatus
  note?: string;
}

export const emailClient = {
  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(params: SendOrderConfirmationParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/order-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Failed to send email" };
      }

      return { success: true, messageId: data.messageId };
    } catch (error) {
      console.error("Error sending order confirmation email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  },

  /**
   * Send order status update email
   */
  async sendOrderStatusUpdate(params: SendOrderStatusUpdateParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/order-status-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Failed to send email" };
      }

      return { success: true, messageId: data.messageId };
    } catch (error) {
      console.error("Error sending order status update email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  },

  /**
   * Send payment notification email
   */
  async sendPaymentNotification(params: SendPaymentNotificationParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/payment-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Failed to send email" };
      }

      return { success: true, messageId: data.messageId };
    } catch (error) {
      console.error("Error sending payment notification email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  },

  /**
   * Send shipped order email
   */
  async sendShippedOrder(params: SendShippedOrderParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/shipped-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Failed to send email" };
      }

      return { success: true, messageId: data.messageId };
    } catch (error) {
      console.error("Error sending shipped order email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  },

  /**
   * Send promotion email
   */
  async sendPromotion(params: SendPromotionParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/promotion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Failed to send email" };
      }

      return { success: true, messageId: data.messageId };
    } catch (error) {
      console.error("Error sending promotion email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  },

  /**
   * Send affiliate approval email
   */
  async sendAffiliateApproval(params: SendAffiliateApprovalParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE}/affiliate-approval`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || "Failed to send email" };
      }

      return { success: true, messageId: data.messageId };
    } catch (error) {
      console.error("Error sending affiliate approval email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  },
};

