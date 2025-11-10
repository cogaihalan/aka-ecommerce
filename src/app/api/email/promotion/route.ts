import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerName, 
      customerEmail, 
      promotionTitle, 
      promotionDescription,
      discountCode,
      discountAmount,
      discountPercentage,
      validFrom,
      validUntil,
      termsAndConditions,
      ctaLink,
      ctaText,
    } = body;

    if (!customerName || !customerEmail || !promotionTitle || !promotionDescription) {
      return NextResponse.json(
        { error: "Missing required fields: customerName, customerEmail, promotionTitle, promotionDescription" },
        { status: 400 }
      );
    }

    const result = await emailService.sendPromotion({
      customerName,
      customerEmail,
      promotionTitle,
      promotionDescription,
      discountCode,
      discountAmount,
      discountPercentage,
      validFrom,
      validUntil,
      termsAndConditions,
      ctaLink,
      ctaText,
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
    console.error("Error in promotion email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

