import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email/service";
import type { Order } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order, customerName, customerEmail } = body;

    if (!order || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required fields: order, customerName, customerEmail" },
        { status: 400 }
      );
    }

    const result = await emailService.sendOrderConfirmation({
      order: order as Order,
      customerName,
      customerEmail,
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
    console.error("Error in order confirmation email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

