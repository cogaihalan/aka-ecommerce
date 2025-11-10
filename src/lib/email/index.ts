// Email service exports
export { emailService } from "./service";
export { emailClient } from "./client";
export { resend, FROM_EMAIL, FROM_NAME } from "./resend";
export * from "./helpers";

// Email templates (for reference, typically used internally)
export { OrderConfirmationEmail } from "./templates/order-confirmation";
export { OrderStatusUpdateEmail } from "./templates/order-status-update";
export { PaymentNotificationEmail } from "./templates/payment-notification";
export { ShippedOrderEmail } from "./templates/shipped-order";
export { PromotionEmail } from "./templates/promotion";

