import { resend, FROM_EMAIL, FROM_NAME } from "./resend";
import { render } from "@react-email/render";
import { OrderConfirmationEmail } from "./templates/order-confirmation";
import { OrderStatusUpdateEmail } from "./templates/order-status-update";
import { PaymentNotificationEmail } from "./templates/payment-notification";
import { ShippedOrderEmail } from "./templates/shipped-order";
import { PromotionEmail } from "./templates/promotion";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

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
}

export const emailService = new EmailService();

