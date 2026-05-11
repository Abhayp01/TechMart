import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getUserFromSession } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await getUserFromSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });

    // Ensure user owns order or is admin
    if (order.userId.toString() !== session.userId && session.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await getUserFromSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { status } = await req.json();

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
