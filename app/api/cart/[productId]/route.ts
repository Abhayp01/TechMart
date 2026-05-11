import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import { getUserFromSession } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    await connectDB();
    const session = await getUserFromSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const { productId } = resolvedParams;

    const cart = await Cart.findOne({ userId: session.userId });
    if (!cart) return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });

    cart.items = cart.items.filter((item: any) => item.productId.toString() !== productId);
    await cart.save();

    await cart.populate("items.productId");
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
