import { NextResponse } from "next/server";
import { Resend } from "resend";
import OrderInquiryEmail from "@/emails/OrderInquiryEmail";
import { render } from "@react-email/render";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const OWNER_EMAIL = "apstar0010@gmail.com";

type CheckoutItemInput = {
  id: unknown;
  quantity: unknown;
  variant?: unknown;
};

type ContactInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

class CheckoutValidationError extends Error {}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contactInfo, items } = body;

    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
      return NextResponse.json({ success: false, error: "Cart is empty or invalid" }, { status: 400 });
    }

    if (!contactInfo || typeof contactInfo !== "object") {
      return NextResponse.json({ success: false, error: "Contact information is required" }, { status: 400 });
    }

    const contact = contactInfo as Partial<ContactInfo>;
    if (![contact.name, contact.email, contact.phone, contact.address, contact.city].every(isNonEmptyString) || !isValidEmail(contact.email!)) {
      return NextResponse.json({ success: false, error: "Please provide valid contact information" }, { status: 400 });
    }

    const requestedItems = items as CheckoutItemInput[];
    if (requestedItems.some((item) => !item || !mongoose.isValidObjectId(item.id) || !Number.isInteger(item.quantity) || (item.quantity as number) < 1 || (item.quantity as number) > 100 || (item.variant !== undefined && !isNonEmptyString(item.variant)))) {
      return NextResponse.json({ success: false, error: "Invalid cart items" }, { status: 400 });
    }

    await connectDB();
    const productIds = [...new Set(requestedItems.map((item) => String(item.id)))];
    const products = await Product.find({ _id: { $in: productIds }, isActive: true }).lean();
    const productMap = new Map(products.map((product: any) => [String(product._id), product]));

    const trustedItems = requestedItems.map((item) => {
      const product: any = productMap.get(String(item.id));
      if (!product) throw new CheckoutValidationError("One or more products are unavailable");

      const variant = item.variant === undefined
        ? undefined
        : product.variants?.find((candidate: any) => candidate.label === item.variant || candidate.sku === item.variant);
      if (item.variant !== undefined && !variant) throw new CheckoutValidationError(`Variant unavailable for ${product.name}`);

      const quantity = item.quantity as number;
      const stock = variant?.stock ?? product.stock;
      if (quantity > stock) throw new CheckoutValidationError(`${product.name} has insufficient stock`);

      const price = Number(variant?.price ?? product.price);
      if (!Number.isFinite(price) || price < 0) throw new CheckoutValidationError("Invalid product price");

      return {
        name: product.name,
        sku: variant?.sku ?? product.sku,
        quantity,
        price,
        variant: variant?.label,
      };
    });
    const trustedSubtotal = Math.round(trustedItems.reduce((total, item) => total + item.price * item.quantity, 0) * 100) / 100;

    const orderId = `INQ-${Date.now()}`;

    // Send Inquiry Email
    try {
      if (!resend) {
        throw new Error("RESEND_API_KEY is not configured");
      }
      const ownerHtml = await render(OrderInquiryEmail({
        contactInfo: contact as ContactInfo,
        items: trustedItems,
        subtotal: trustedSubtotal
      }));

      // Send to the store owner
      await resend.emails.send({
        from: 'B. K. Infotech <onboarding@resend.dev>', // Using default resend testing domain
        to: [OWNER_EMAIL],
        subject: `New Order Inquiry: ${contact.name} [${orderId}]`,
        html: ownerHtml,
        replyTo: contact.email,
      });

    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return NextResponse.json({ success: false, error: "Failed to send email inquiry", code: 500 }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId, subtotal: trustedSubtotal }, { status: 201 });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    const status = error instanceof CheckoutValidationError ? 400 : 500;
    return NextResponse.json({ success: false, error: status === 400 ? error.message : "Internal Server Error" }, { status });
  }
}
