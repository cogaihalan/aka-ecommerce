import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerName,
      customerEmail, 
      newsletterTitle, 
      newsletterContent,
      featuredImage,
      featuredImageAlt,
      ctaLink,
      ctaText,
      unsubscribeLink,
    } = body;

    if (!customerEmail || !newsletterTitle || !newsletterContent) {
      return NextResponse.json(
        { error: "Missing required fields: customerEmail, newsletterTitle, newsletterContent" },
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

    const result = await emailService.sendNewsletter({
      customerName,
      customerEmail,
      newsletterTitle,
      newsletterContent,
      featuredImage,
      featuredImageAlt,
      ctaLink,
      ctaText,
      unsubscribeLink,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send newsletter email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      messageId: result.messageId 
    });
  } catch (error) {
    console.error("Error in newsletter email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

