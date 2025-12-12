import { resend, FROM_EMAIL, FROM_NAME } from "./resend";
import { render } from "@react-email/render";
import { OrderConfirmationEmail } from "./templates/order-confirmation";
import { OrderStatusUpdateEmail } from "./templates/order-status-update";
import { PaymentNotificationEmail } from "./templates/payment-notification";
import { ShippedOrderEmail } from "./templates/shipped-order";
import { PromotionEmail } from "./templates/promotion";
import { NewsletterEmail } from "./templates/newsletter";
import { AffiliateApprovalEmail } from "./templates/affiliate-approval";
import type { Order, OrderStatus, PaymentStatus } from "@/types";
import type { AffiliateApproval, AffiliateApprovalStatus } from "@/types/affiliate";

export interface SendOrderConfirmationParams {
  order: Order;
  customerName: string;
  customerEmail: string;
}

export interface SendOrderStatusUpdateParams {
  order: Order;
  customerName: string;
  customerEmail: string;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
  note?: string;
}

export interface SendPaymentNotificationParams {
  order: Order;
  customerName: string;
  customerEmail: string;
  paymentStatus: PaymentStatus;
  note?: string;
}

export interface SendShippedOrderParams {
  order: Order;
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

export interface SendNewsletterParams {
  customerName?: string;
  customerEmail: string;
  newsletterTitle: string;
  newsletterContent: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  ctaLink?: string;
  ctaText?: string;
  unsubscribeLink?: string;
}

export interface SendAffiliateApprovalParams {
  approval: AffiliateApproval;
  customerName: string;
  customerEmail: string;
  status: AffiliateApprovalStatus;
  note?: string;
}

export class EmailService {
  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(params: SendOrderConfirmationParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const html = await render(
        OrderConfirmationEmail({
          order: params.order,
          customerName: params.customerName,
          customerEmail: params.customerEmail,
        })
      );

      const result = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: params.customerEmail,
        subject: `Xác nhận đơn hàng #${params.order.code}`,
        html,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Error sending order confirmation email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Send order status update email
   */
  async sendOrderStatusUpdate(params: SendOrderStatusUpdateParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const html = await render(
        OrderStatusUpdateEmail({
          order: params.order,
          customerName: params.customerName,
          customerEmail: params.customerEmail,
          previousStatus: params.previousStatus,
          newStatus: params.newStatus,
          note: params.note,
        })
      );

      const statusText = params.newStatus === "CONFIRMED" ? "Đã xác nhận" :
                        params.newStatus === "SHIPPING" ? "Đang giao hàng" :
                        params.newStatus === "DELIVERED" ? "Đã giao hàng" :
                        params.newStatus === "CANCELLED" ? "Đã hủy" :
                        params.newStatus === "REFUNDED" ? "Đã hoàn tiền" : "Cập nhật";

      const result = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: params.customerEmail,
        subject: `Cập nhật đơn hàng #${params.order.code} - ${statusText}`,
        html,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Error sending order status update email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Send payment notification email
   */
  async sendPaymentNotification(params: SendPaymentNotificationParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const html = await render(
        PaymentNotificationEmail({
          order: params.order,
          customerName: params.customerName,
          customerEmail: params.customerEmail,
          paymentStatus: params.paymentStatus,
          note: params.note,
        })
      );

      const statusText = params.paymentStatus === "PAID" ? "Đã thanh toán" :
                        params.paymentStatus === "FAILED" ? "Thanh toán thất bại" :
                        "Chưa thanh toán";

      const result = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: params.customerEmail,
        subject: `Thông báo thanh toán đơn hàng #${params.order.code} - ${statusText}`,
        html,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Error sending payment notification email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Send shipped order email
   */
  async sendShippedOrder(params: SendShippedOrderParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const html = await render(
        ShippedOrderEmail({
          order: params.order,
          customerName: params.customerName,
          customerEmail: params.customerEmail,
          trackingNumber: params.trackingNumber,
          shippingCompany: params.shippingCompany,
          estimatedDeliveryDate: params.estimatedDeliveryDate,
          note: params.note,
        })
      );

      const result = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: params.customerEmail,
        subject: `Đơn hàng #${params.order.code} đã được gửi đi`,
        html,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Error sending shipped order email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Send promotion email
   */
  async sendPromotion(params: SendPromotionParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const html = await render(
        PromotionEmail({
          customerName: params.customerName,
          customerEmail: params.customerEmail,
          promotionTitle: params.promotionTitle,
          promotionDescription: params.promotionDescription,
          discountCode: params.discountCode,
          discountAmount: params.discountAmount,
          discountPercentage: params.discountPercentage,
          validFrom: params.validFrom,
          validUntil: params.validUntil,
          termsAndConditions: params.termsAndConditions,
          ctaLink: params.ctaLink,
          ctaText: params.ctaText,
        })
      );

      const result = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: params.customerEmail,
        subject: params.promotionTitle,
        html,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Error sending promotion email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Send newsletter email
   */
  async sendNewsletter(params: SendNewsletterParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const html = await render(
        NewsletterEmail({
          customerName: params.customerName,
          newsletterTitle: params.newsletterTitle,
          newsletterContent: params.newsletterContent,
          featuredImage: params.featuredImage,
          featuredImageAlt: params.featuredImageAlt,
          ctaLink: params.ctaLink,
          ctaText: params.ctaText,
          unsubscribeLink: params.unsubscribeLink,
        })
      );

      const result = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: params.customerEmail,
        subject: params.newsletterTitle,
        html,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Error sending newsletter email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Send affiliate approval email
   */
  async sendAffiliateApproval(params: SendAffiliateApprovalParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const html = await render(
        AffiliateApprovalEmail({
          approval: params.approval,
          customerName: params.customerName,
          customerEmail: params.customerEmail,
          status: params.status,
          note: params.note,
        })
      );

      const statusText = params.status === "APPROVED" ? "Đã duyệt" : "Đã từ chối";
      const subject = params.status === "APPROVED" 
        ? "Yêu cầu affiliate đã được duyệt" 
        : "Yêu cầu affiliate đã bị từ chối";

      const result = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: params.customerEmail,
        subject,
        html,
      });

      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("Error sending affiliate approval email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Send newsletter email to multiple recipients
   * @param baseParams Base newsletter parameters (shared across all recipients)
   * @param recipients Array of recipient email addresses and optional names
   * @returns Array of results for each recipient
   */
  async sendBulkNewsletter(
    baseParams: Omit<SendNewsletterParams, "customerEmail" | "customerName">,
    recipients: Array<{ email: string; name?: string }>
  ): Promise<Array<{ email: string; success: boolean; messageId?: string; error?: string }>> {
    const results = await Promise.allSettled(
      recipients.map(async (recipient) => {
        const result = await this.sendNewsletter({
          ...baseParams,
          customerEmail: recipient.email,
          customerName: recipient.name,
        });
        return {
          email: recipient.email,
          ...result,
        };
      })
    );

    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        return {
          email: recipients[index].email,
          success: false,
          error: result.reason?.message || "Unknown error",
        };
      }
    });
  }
}

export const emailService = new EmailService();

