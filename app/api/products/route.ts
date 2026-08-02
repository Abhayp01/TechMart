import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const isFeatured = searchParams.get("isFeatured");

    let query: any = {};
    if (category) query.category = category;
    if (isFeatured === "true") query.isFeatured = true;

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, message: "Invalid product payload" }, { status: 400 });
    }

    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    const status = error?.name === "ValidationError" || error?.code === 11000 ? 400 : 500;
    const message = error?.code === 11000
      ? "A product with this SKU or slug already exists."
      : error?.message || "Failed to create product";
    return NextResponse.json({ success: false, message }, { status });
  }
}
