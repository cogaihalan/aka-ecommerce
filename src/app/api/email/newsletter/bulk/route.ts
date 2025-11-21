import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/email/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      recipients,
      newsletterTitle, 
      newsletterContent,
      featuredImage,
      featuredImageAlt,
      ctaLink,
      ctaText,
      unsubscribeLink,
    } = body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid recipients array" },
        { status: 400 }
      );
    }

    if (!newsletterTitle || !newsletterContent) {
      return NextResponse.json(
        { error: "Missing required fields: newsletterTitle, newsletterContent" },
        { status: 400 }
      );
    }

    // Validate email format for all recipients
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipients.filter(
      (r: { email: string }) => !emailRegex.test(r.email)
    );

    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { error: `Invalid email format for: ${invalidEmails.map((r: { email: string }) => r.email).join(", ")}` },
        { status: 400 }
      );
    }

    const results = await emailService.sendBulkNewsletter(
      {
        newsletterTitle,
        newsletterContent,
        featuredImage,
        featuredImageAlt,
        ctaLink,
        ctaText,
        unsubscribeLink,
      },
      recipients
    );

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return NextResponse.json({ 
      success: true,
      total: recipients.length,
      successful: successCount,
      failed: failureCount,
      results,
    });
  } catch (error) {
    console.error("Error in bulk newsletter email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

