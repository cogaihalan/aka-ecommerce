import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email/service";
import type { AffiliateApproval, AffiliateApprovalStatus } from "@/types/affiliate";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      approval, 
      customerName, 
      customerEmail, 
      status, 
      note 
    } = body;

    if (!approval || !customerName || !customerEmail || !status) {
      return NextResponse.json(
        { error: "Missing required fields: approval, customerName, customerEmail, status" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const result = await emailService.sendAffiliateApproval({
      approval: approval as AffiliateApproval,
      customerName,
      customerEmail,
      status: status as AffiliateApprovalStatus,
      note,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send affiliate approval email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      messageId: result.messageId 
    });
  } catch (error) {
    console.error("Error in affiliate approval email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
