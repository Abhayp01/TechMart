import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/Cart";
import { getUserFromSession } from "@/lib/auth";
import Product from "@/models/Product"; // needed for populate

export async function GET() {
  try {
    await connectDB();
    const session = await getUserFromSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const cart = await Cart.findOne({ userId: session.userId }).populate("items.productId");
    if (!cart) {
      return NextResponse.json({ success: true, data: { items: [] } });
    }

    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getUserFromSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { productId, quantity } = await req.json();

    let cart = await Cart.findOne({ userId: session.userId });
    if (!cart) {
      cart = await Cart.create({ userId: session.userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex((item: any) => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      await cart.save();
    }

    cart = await cart.populate("items.productId");
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const session = await getUserFromSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { productId, quantity } = await req.json();

    const cart = await Cart.findOne({ userId: session.userId });
    if (!cart) return NextResponse.json({ success: false, message: "Cart not found" }, { status: 404 });

    const itemIndex = cart.items.findIndex((item: any) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
    }

    await cart.populate("items.productId");
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const session = await getUserFromSession();
    if (!session) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await Cart.findOneAndDelete({ userId: session.userId });
    return NextResponse.json({ success: true, data: null });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
