# Email Notifications System

This document describes the email notification system integrated with Resend for the AKA Ecommerce application.

## Overview

The email notification system automatically sends emails to customers for:
- **Order Confirmation**: When an order is created
- **Order Status Updates**: When order status changes (confirmed, shipping, delivered, cancelled, refunded)
- **Payment Notifications**: When payment status changes (paid, failed)
- **Shipped Orders**: When an order is shipped with tracking information
- **Promotions**: Marketing and promotional emails

## Setup

### 1. Install Dependencies

Dependencies are already installed:
- `resend`: Email sending service
- `@react-email/render`: For rendering React email templates

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
# Resend API Key - Get from https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here

# From email address (must be verified in Resend)
RESEND_FROM_EMAIL=noreply@yourdomain.com

# From name for emails
RESEND_FROM_NAME=AKA Ecommerce
```

### 3. Resend Setup

1. Sign up at [Resend](https://resend.com)
2. Get your API key from the dashboard
3. Verify your domain or use the test domain for development
4. Add the API key to your environment variables

## Architecture

### File Structure

```
src/lib/email/
├── resend.ts              # Resend client initialization
├── service.ts             # Server-side email service
├── client.ts              # Client-side email API client
├── helpers.ts             # Helper functions for common email operations
├── index.ts               # Exports
└── templates/
    ├── order-confirmation.tsx
    ├── order-status-update.tsx
    ├── payment-notification.tsx
    ├── shipped-order.tsx
    └── promotion.tsx
```

### API Routes

```
src/app/api/email/
├── order-confirmation/route.ts
├── order-status-update/route.ts
├── payment-notification/route.ts
├── shipped-order/route.ts
└── promotion/route.ts
```

## Usage

### Automatic Email Sending

Emails are automatically sent in the following scenarios:

#### 1. Order Confirmation
- **When**: Order is created during checkout
- **Location**: `src/hooks/use-checkout-page.ts`
- **Template**: `OrderConfirmationEmail`

#### 2. Order Status Updates
- **When**: Admin updates order status (confirm, shipping, delivered, cancel, refund)
- **Locations**: 
  - `src/features/orders/components/admin-order-detail-page.tsx`
  - `src/features/orders/components/order-tables/cell-action.tsx`
- **Template**: `OrderStatusUpdateEmail`

#### 3. Shipped Order
- **When**: Order status changes to "SHIPPING"
- **Template**: `ShippedOrderEmail`
- **Note**: Can include tracking number, shipping company, and estimated delivery date

#### 4. Payment Notifications
- **When**: Payment status changes (typically via webhook from payment gateway)
- **Template**: `PaymentNotificationEmail`
- **Note**: Can be called from backend webhook handlers

### Manual Email Sending

You can also send emails manually using the helper functions:

```typescript
import { 
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendPaymentNotificationEmail,
  sendShippedOrderEmail 
} from "@/lib/email/helpers";

// Send order confirmation
await sendOrderConfirmationEmail(order);

// Send status update
await sendOrderStatusUpdateEmail(
  orderId, 
  "PENDING", 
  "CONFIRMED", 
  "Order confirmed by admin"
);

// Send payment notification
await sendPaymentNotificationEmail(
  orderId, 
  "PAID", 
  "Payment successful"
);

// Send shipped order
await sendShippedOrderEmail(
  orderId,
  "TRACK123456",           // tracking number
  "Vietnam Post",          // shipping company
  "2024-12-25",           // estimated delivery
  "Order shipped"         // note
);
```

### Using the Email Client (Frontend)

```typescript
import { emailClient } from "@/lib/email/client";

// Send promotion email
await emailClient.sendPromotion({
  customerName: "John Doe",
  customerEmail: "john@example.com",
  promotionTitle: "Special Discount!",
  promotionDescription: "Get 20% off on all products",
  discountCode: "SAVE20",
  discountPercentage: 20,
  validFrom: "2024-01-01",
  validUntil: "2024-01-31",
  ctaLink: "https://yoursite.com/shop",
  ctaText: "Shop Now"
});
```

### Using the Email Service (Server-side)

```typescript
import { emailService } from "@/lib/email/service";

// Send email from server-side code
const result = await emailService.sendOrderConfirmation({
  order: orderData,
  customerName: "John Doe",
  customerEmail: "john@example.com"
});

if (result.success) {
  console.log("Email sent:", result.messageId);
} else {
  console.error("Email failed:", result.error);
}
```

## Email Templates

All email templates are React components located in `src/lib/email/templates/`. They use inline styles for maximum email client compatibility.

### Customizing Templates

To customize email templates:

1. Edit the template file in `src/lib/email/templates/`
2. Templates use inline styles for compatibility
3. Test emails using Resend's test mode

## API Endpoints

All email endpoints accept POST requests with JSON body:

### POST `/api/email/order-confirmation`
```json
{
  "order": { /* Order object */ },
  "customerName": "John Doe",
  "customerEmail": "john@example.com"
}
```

### POST `/api/email/order-status-update`
```json
{
  "order": { /* Order object */ },
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "previousStatus": "PENDING",
  "newStatus": "CONFIRMED",
  "note": "Optional note"
}
```

### POST `/api/email/payment-notification`
```json
{
  "order": { /* Order object */ },
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "paymentStatus": "PAID",
  "note": "Optional note"
}
```

### POST `/api/email/shipped-order`
```json
{
  "order": { /* Order object */ },
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "trackingNumber": "TRACK123456",
  "shippingCompany": "Vietnam Post",
  "estimatedDeliveryDate": "2024-12-25",
  "note": "Optional note"
}
```

### POST `/api/email/promotion`
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "promotionTitle": "Special Discount!",
  "promotionDescription": "Get 20% off",
  "discountCode": "SAVE20",
  "discountPercentage": 20,
  "validFrom": "2024-01-01",
  "validUntil": "2024-01-31",
  "termsAndConditions": "Terms here",
  "ctaLink": "https://yoursite.com",
  "ctaText": "Shop Now"
}
```

## Error Handling

Email sending failures are handled gracefully:
- Errors are logged to console
- Order operations continue even if email fails
- No user-facing errors for email failures

## Testing

### Development Testing

1. Use Resend's test mode (default domain: `onboarding@resend.dev`)
2. Check Resend dashboard for sent emails
3. Verify email content and formatting

### Production Testing

1. Verify your domain in Resend
2. Test with real email addresses
3. Monitor Resend dashboard for delivery status

## Backend Integration

If your backend needs to send emails, it can call the Next.js API routes:

```bash
POST https://yourdomain.com/api/email/order-confirmation
Content-Type: application/json

{
  "order": { /* order data */ },
  "customerName": "John Doe",
  "customerEmail": "john@example.com"
}
```

## Notes

- Email sending is non-blocking - failures don't affect order processing
- Customer email is fetched from user service if not available in order
- All emails are in Vietnamese language
- Email templates use responsive design for mobile compatibility

## Troubleshooting

### Emails not sending
1. Check `RESEND_API_KEY` is set correctly
2. Verify domain in Resend dashboard
3. Check console for error messages
4. Verify customer email exists in user data

### Email formatting issues
1. Test in multiple email clients
2. Check inline styles are correct
3. Verify HTML structure

### Rate limiting
- Resend has rate limits based on your plan
- Monitor usage in Resend dashboard
- Consider queuing emails for high volume

