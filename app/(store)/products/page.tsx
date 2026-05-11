import { storeConfig } from "@/lib/store-config";
import { ProductCard } from "@/components/store/ProductCard";
import { FilterSidebar } from "@/components/store/FilterSidebar";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { Filter } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  await connectDB();

  // Parse search params into MongoDB query
  const category = (searchParams.category as string) || "laptops";
  const inStock = searchParams.inStock === "true";
  
  let query: any = { category };
  
  if (inStock) {
    query.stock = { $gt: 0 };
  }

  // Handle dynamic filters mapping to "specs.xxxx"
  const catConfig = storeConfig.categories.find(c => c.id === category) || storeConfig.categories[0];
  
  catConfig.filters.forEach(filter => {
    const filterValues = searchParams[filter.id];
    if (filterValues) {
      const valuesArray = Array.isArray(filterValues) ? filterValues : [filterValues];
      // Search inside specs object
      if (filter.id === "brand") {
        query.brand = { $in: valuesArray.map(v => new RegExp(v, "i")) };
      } else {
        query[`specs.${filter.id}`] = { $in: valuesArray };
      }
    }
  });

  const products = await Product.find(query).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F5F0EB] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex items-end justify-between border-b border-[#222] pb-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold uppercase">{catConfig.name}</h1>
            <p className="font-mono text-[#888] mt-2">Showing {products.length} hardware configurations</p>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <span className="font-mono text-sm text-[#666]">SORT BY:</span>
            <select className="bg-[#111] border border-[#333] text-[#F5F0EB] font-mono text-sm p-2 outline-none focus:border-[#6C63FF]">
              <option>NEWEST ARCHITECTURE</option>
              <option>PRICE: LOW TO HIGH</option>
              <option>PRICE: HIGH TO LOW</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Mobile Filter Button */}
          <div className="lg:hidden w-full">
            <button className="w-full bg-[#111] border border-[#333] py-4 flex items-center justify-center gap-2 font-mono text-sm">
              <Filter className="w-4 h-4" /> FILTERS
            </button>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32">
              <FilterSidebar categoryId={category} />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="py-20 text-center border border-[#222] bg-[#111]">
                <h3 className="text-2xl font-heading text-[#888] mb-2">NO HARDWARE FOUND</h3>
                <p className="text-[#666] font-mono text-sm">Adjust your filter parameters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p._id.toString()}
                    _id={p._id.toString()}
                    name={p.name}
                    price={p.price}
                    mrp={p.mrp}
                    sku={p.sku}
                    brand={p.brand}
                    image={p.images?.[0]}
                    stock={p.stock}
                    discount={p.discount}
                    rating={p.rating}
                    reviewCount={p.reviewCount}
                    highlights={p.highlights}
                  />
                ))}
              </div>
            )}
            
            {products.length > 0 && (
              <div className="mt-16 text-center">
                <button className="bg-[#111] border border-[#333] text-[#F5F0EB] font-mono text-sm tracking-widest px-8 py-4 hover:border-[#6C63FF] hover:text-[#6C63FF] transition-colors">
                  INITIALIZE MORE RESULTS
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
