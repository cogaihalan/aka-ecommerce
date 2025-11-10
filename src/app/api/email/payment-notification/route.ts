import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email/service";
import type { Order, PaymentStatus } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order, customerName, customerEmail, paymentStatus, note } = body;

    if (!order || !customerName || !customerEmail || !paymentStatus) {
      return NextResponse.json(
        { error: "Missing required fields: order, customerName, customerEmail, paymentStatus" },
        { status: 400 }
      );
    }

    const result = await emailService.sendPaymentNotification({
      order: order as Order,
      customerName,
      customerEmail,
      paymentStatus: paymentStatus as PaymentStatus,
      note,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      messageId: result.messageId 
    });
  } catch (error) {
    console.error("Error in payment notification email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

