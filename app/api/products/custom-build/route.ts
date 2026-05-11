import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { getUserFromSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getUserFromSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Please log in to save custom builds." }, { status: 401 });
    }

    const { specs, totalPrice } = await req.json();

    const slug = `custom-pc-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const customProduct = await Product.create({
      title: "Custom Built PC",
      slug,
      description: "A custom-tailored workstation built to your exact specifications, rigorously tested and optimized.",
      price: totalPrice,
      category: "Computers",
      brand: "Custom Build",
      images: [
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80"
      ],
      stock: 1,
      specs: specs,
      warranty: 24, // 2-year warranty for custom builds
      isFeatured: false,
    });

    return NextResponse.json({ success: true, data: customProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
