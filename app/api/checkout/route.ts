import { NextResponse } from "next/server";
import { Resend } from "resend";
import OrderInquiryEmail from "@/emails/OrderInquiryEmail";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contactInfo, items, subtotal } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty", code: 400 }, { status: 400 });
    }

    const orderId = `INQ-${Date.now()}`;

    // Send Inquiry Email
    try {
      const ownerHtml = await render(OrderInquiryEmail({
        contactInfo,
        items,
        subtotal
      }));

      // Send to the store owner
      await resend.emails.send({
        from: 'B. K. Infotech <onboarding@resend.dev>', // Using default resend testing domain
        to: ['prajapatiabhay2003@gmail.com'],
        subject: `New Order Inquiry: ${contactInfo.name} [${orderId}]`,
        html: ownerHtml,
        replyTo: contactInfo.email,
      });

    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return NextResponse.json({ success: false, error: "Failed to send email inquiry", code: 500 }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId }, { status: 201 });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error", code: 500 }, { status: 500 });
  }
}
