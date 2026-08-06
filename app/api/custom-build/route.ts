import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import CustomBuildInquiryEmail from "@/emails/CustomBuildInquiryEmail";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const OWNER_EMAIL = "apstar0010@gmail.com";
const allowedUseCases = new Set(["gaming", "workstation", "office"]);
const allowedBudgets = new Set(["under50k", "50k-80k", "80k-150k", "above150k"]);

function validString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, useCase, budget, requirements = "" } = body ?? {};

    if (!validString(name, 100) || !validString(phone, 40)) {
      return NextResponse.json({ success: false, error: "Please provide a valid name and phone number." }, { status: 400 });
    }
    if (!allowedUseCases.has(useCase) || !allowedBudgets.has(budget) || typeof requirements !== "string" || requirements.length > 2000) {
      return NextResponse.json({ success: false, error: "Please provide valid build preferences." }, { status: 400 });
    }
    if (!resend) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json({ success: false, error: "Email service is temporarily unavailable." }, { status: 500 });
    }

    const inquiryId = `BUILD-${Date.now()}`;
    const html = await render(CustomBuildInquiryEmail({ name: name.trim(), phone: phone.trim(), useCase, budget, requirements: requirements.trim(), inquiryId }));
    const result = await resend.emails.send({
      from: "B. K. Infotech <onboarding@resend.dev>",
      to: [OWNER_EMAIL],
      subject: `Custom PC Build Request: ${name.trim()} [${inquiryId}]`,
      html,
    });

    if (result.error) {
      console.error("Custom build email failed:", result.error);
      return NextResponse.json({ success: false, error: "Failed to send build request." }, { status: 502 });
    }

    return NextResponse.json({ success: true, inquiryId }, { status: 201 });
  } catch (error) {
    console.error("Custom build submission error:", error);
    return NextResponse.json({ success: false, error: "Unable to submit build request." }, { status: 500 });
  }
}
