import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { redirect } from "next/navigation";
import { getUserFromSession } from "@/lib/auth";

export default async function AdminProductsPage() {
  const session = await getUserFromSession();
  
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F5F0EB] p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end border-b border-[#333] pb-6 mb-10">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2">PRODUCT MATRIX</h1>
            <p className="font-mono text-[#888]">SYSTEM INVENTORY MANAGEMENT</p>
          </div>
          <button className="bg-[#6C63FF] text-[#F5F0EB] font-bold py-3 px-6 rounded-none hover:bg-[#524ac4] transition-colors">
            + NEW ENTRY
          </button>
        </div>

        <div className="bg-[#111] border border-[#333] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#333] bg-[#0d0d14]">
                <th className="p-4 font-mono text-xs text-[#888]">SKU</th>
                <th className="p-4 font-mono text-xs text-[#888]">DESIGNATION</th>
                <th className="p-4 font-mono text-xs text-[#888]">STOCK</th>
                <th className="p-4 font-mono text-xs text-[#888]">PRICE</th>
                <th className="p-4 font-mono text-xs text-[#888]">STATUS</th>
                <th className="p-4 font-mono text-xs text-[#888] text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#888] font-mono">NO DATA FOUND</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id.toString()} className="border-b border-[#222] hover:bg-[#1a1a24] transition-colors">
                    <td className="p-4 font-mono text-sm text-[#6C63FF]">{product.sku || product._id.toString().substring(0,8)}</td>
                    <td className="p-4 font-medium">{product.title}</td>
                    <td className="p-4 font-mono">{product.stock}</td>
                    <td className="p-4 font-mono">${product.price.toFixed(2)}</td>
                    <td className="p-4">
                      {product.stock > 0 ? (
                        <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">ACTIVE</span>
                      ) : (
                        <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20">DEPLETED</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-sm font-mono text-[#888] hover:text-[#F5F0EB] transition-colors">EDIT</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
