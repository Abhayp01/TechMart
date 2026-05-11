import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { Resend } from "resend";
import OrderNotification from "@/emails/OrderNotification";
import OrderConfirmation from "@/emails/OrderConfirmation";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contactInfo, items, subtotal } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty", code: 400 }, { status: 400 });
    }

    await connectDB();

    // Optimistic Locking: Stock deduction
    // We check and reduce stock for all items
    for (const item of items) {
      // Assuming item.id is the MongoDB ObjectId for the product
      const product = await Product.findOneAndUpdate(
        { _id: item.id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.name} is out of stock or insufficient quantity.`, code: 409 },
          { status: 409 }
        );
      }
    }

    const orderId = `ORD-${Date.now()}`;

    // Create Order in DB (Assuming Order model accepts this structure)
    const newOrder = await Order.create({
      orderId,
      customerInfo: contactInfo,
      items: items,
      totalAmount: subtotal,
      status: "PENDING_PAYMENT",
    });

    // Send Emails
    try {
      const ownerHtml = await render(OrderNotification({
        orderId,
        customerName: contactInfo.name,
        customerEmail: contactInfo.email,
        customerPhone: contactInfo.phone,
        address: contactInfo.address,
        city: contactInfo.city,
        items,
        subtotal
      }));

      const customerHtml = await render(OrderConfirmation({
        orderId,
        customerName: contactInfo.name,
        items,
        subtotal
      }));

      // 1. To store owner
      await resend.emails.send({
        from: 'Nexus Core <orders@nexuscore.com>', // Assuming verified domain, or use Resend testing domain
        to: ['prajapatiabhay@gmail.com'],
        subject: `🛒 New Order [${orderId}] — Action Required`,
        html: ownerHtml,
        replyTo: contactInfo.email,
      });

      // 2. To customer
      await resend.emails.send({
        from: 'Nexus Core <orders@nexuscore.com>',
        to: [contactInfo.email],
        subject: 'Order Confirmed — We\'ll be in touch shortly! 🎉',
        html: customerHtml,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // We don't fail the checkout if email fails, but log it.
    }

    return NextResponse.json({ success: true, orderId }, { status: 201 });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error", code: 500 }, { status: 500 });
  }
}
