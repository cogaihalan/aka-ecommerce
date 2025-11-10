import { emailClient } from "./client";
import { unifiedOrderService } from "@/lib/api/services/unified";
import { unifiedUserService } from "@/lib/api/services/unified";
import type { Order, OrderStatus } from "@/types";

/**
 * Helper function to get customer email from order
 * Tries to fetch user details if email is not available in order
 */
export async function getCustomerEmail(order: Order): Promise<string | null> {
  try {
    // Try to get user details from API
    const user = await unifiedUserService.getUserById(order.user.id.toString());
    if (user?.email) {
      return user.email;
    }
  } catch (error) {
    console.error("Error fetching user email:", error);
  }
  
  return null;
}

/**
 * Helper function to get customer name from order
 */
export function getCustomerName(order: Order): string {
  return order.recipientName || order.user?.username || "Khách hàng";
}

/**
 * Send order confirmation email after order creation
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
  try {
    const customerEmail = await getCustomerEmail(order);
    if (!customerEmail) {
      console.warn(`Cannot send order confirmation email: No email found for order #${order.code}`);
      return;
    }

    const customerName = getCustomerName(order);
    
    await emailClient.sendOrderConfirmation({
      order,
      customerName,
      customerEmail,
    });
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    // Don't throw - email sending failure shouldn't break the order flow
  }
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdateEmail(
  orderId: number,
  previousStatus: OrderStatus,
  newStatus: OrderStatus,
  note?: string
): Promise<void> {
  try {
    // Fetch updated order
    const order = await unifiedOrderService.getOrder(orderId);
    
    const customerEmail = await getCustomerEmail(order);
    if (!customerEmail) {
      console.warn(`Cannot send status update email: No email found for order #${order.code}`);
      return;
    }

    const customerName = getCustomerName(order);
    
    await emailClient.sendOrderStatusUpdate({
      order,
      customerName,
      customerEmail,
      previousStatus,
      newStatus,
      note,
    });
  } catch (error) {
    console.error("Error sending order status update email:", error);
    // Don't throw - email sending failure shouldn't break the order flow
  }
}

/**
 * Send payment notification email
 */
export async function sendPaymentNotificationEmail(
  orderId: number,
  paymentStatus: "UNPAID" | "PAID" | "FAILED",
  note?: string
): Promise<void> {
  try {
    const order = await unifiedOrderService.getOrder(orderId);
    
    const customerEmail = await getCustomerEmail(order);
    if (!customerEmail) {
      console.warn(`Cannot send payment notification email: No email found for order #${order.code}`);
      return;
    }

    const customerName = getCustomerName(order);
    
    await emailClient.sendPaymentNotification({
      order,
      customerName,
      customerEmail,
      paymentStatus,
      note,
    });
  } catch (error) {
    console.error("Error sending payment notification email:", error);
    // Don't throw - email sending failure shouldn't break the order flow
  }
}

/**
 * Send shipped order email
 */
export async function sendShippedOrderEmail(
  orderId: number,
  trackingNumber?: string,
  shippingCompany?: string,
  estimatedDeliveryDate?: string,
  note?: string
): Promise<void> {
  try {
    const order = await unifiedOrderService.getOrder(orderId);
    
    const customerEmail = await getCustomerEmail(order);
    if (!customerEmail) {
      console.warn(`Cannot send shipped order email: No email found for order #${order.code}`);
      return;
    }

    const customerName = getCustomerName(order);
    
    await emailClient.sendShippedOrder({
      order,
      customerName,
      customerEmail,
      trackingNumber,
      shippingCompany,
      estimatedDeliveryDate,
      note,
    });
  } catch (error) {
    console.error("Error sending shipped order email:", error);
    // Don't throw - email sending failure shouldn't break the order flow
  }
}

