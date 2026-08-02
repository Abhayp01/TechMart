import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || !q.trim()) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Use case-insensitive regex for partial/prefix matching
    // This matches "logi" inside "Logitech", "mx" inside "MX Keys", etc.
    const regex = new RegExp(q.trim(), "i");

    const products = await Product.find({
      $or: [
        { name: regex },
        { brand: regex },
        { description: regex },
        { tags: regex },
        { category: regex },
        { subcategory: regex },
        { sku: regex },
      ],
    })
      .limit(10)
      .select("name slug brand price images sku");

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

