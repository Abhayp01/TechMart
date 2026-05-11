import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import { getUserFromSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getUserFromSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const orders = await Order.find({ userId: session.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getUserFromSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { items, address, totalAmount } = await req.json();

    const order = await Order.create({
      userId: session.userId,
      items,
      totalAmount,
      address,
    });

    // Clear cart after order
    await Cart.findOneAndDelete({ userId: session.userId });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
