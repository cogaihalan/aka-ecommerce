import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email/service";
import type { Order, OrderStatus } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order, customerName, customerEmail, previousStatus, newStatus, note } = body;

    if (!order || !customerName || !customerEmail || !previousStatus || !newStatus) {
      return NextResponse.json(
        { error: "Missing required fields: order, customerName, customerEmail, previousStatus, newStatus" },
        { status: 400 }
      );
    }

    const result = await emailService.sendOrderStatusUpdate({
      order: order as Order,
      customerName,
      customerEmail,
      previousStatus: previousStatus as OrderStatus,
      newStatus: newStatus as OrderStatus,
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
    console.error("Error in order status update email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

