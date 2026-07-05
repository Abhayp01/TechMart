import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { redirect } from "next/navigation";
import { getUserFromSession } from "@/lib/auth";

export default async function AdminProductsPage() {
  const session = await getUserFromSession();
  
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  let products: any[] = [];
  try {
    await connectDB();
    products = await Product.find().sort({ createdAt: -1 });
  } catch (err) {
    console.warn("MongoDB unavailable in admin page.");
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end border-b border-border pb-6 mb-10">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2 text-foreground">Product Inventory</h1>
            <p className="font-medium text-muted-foreground">Manage all products in B.K. Infotech store</p>
          </div>
          <button className="bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            + Add Product
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">SKU</th>
                <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Product Name</th>
                <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground font-medium">No products found. Add your first product.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id.toString()} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-sm text-primary">{product.sku || product._id.toString().substring(0,8)}</td>
                    <td className="p-4 font-medium text-foreground">{product.title || product.name}</td>
                    <td className="p-4 font-medium text-foreground">{product.stock}</td>
                    <td className="p-4 font-medium text-foreground">₹{product.price.toFixed(2)}</td>
                    <td className="p-4">
                      {product.stock > 0 ? (
                        <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md">In Stock</span>
                      ) : (
                        <span className="text-xs font-semibold bg-red-100 text-red-600 px-2.5 py-1 rounded-md">Out of Stock</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Edit</button>
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
