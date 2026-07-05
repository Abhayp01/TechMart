import { storeConfig } from "@/lib/store-config";
import { ProductCard } from "@/components/store/ProductCard";
import { FilterSidebar } from "@/components/store/FilterSidebar";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";

const MOCK_PRODUCTS = [
  // Laptops
  {
    _id: "mock-1",
    name: "Lenovo ThinkPad X1 Carbon Gen 11", price: 129999, mrp: 145000, sku: "LEN-X1", brand: "Lenovo", category: "laptops",
    images: ["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80"],
    stock: 15, discount: 10, rating: 4.8, reviewCount: 124, highlights: ["Intel i7 13th Gen", "16GB RAM", "1TB SSD"]
  },
  {
    _id: "mock-5",
    name: "Dell Inspiron 15 Laptop", price: 54999, mrp: 62000, sku: "DELL-INS15", brand: "Dell", category: "laptops",
    images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=80"],
    stock: 12, discount: 11, rating: 4.5, reviewCount: 68, highlights: ["Intel i5 12th Gen", "8GB RAM", "512GB SSD"]
  },
  // Desktops / Gaming PCs
  {
    _id: "mock-6",
    name: "B.K. Custom AMD Gaming PC (RTX 4060)", price: 85000, mrp: 95000, sku: "BK-GAMING-4060", brand: "B.K. Custom", category: "desktops",
    images: ["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80"],
    stock: 5, discount: 10, rating: 4.9, reviewCount: 18, highlights: ["AMD Ryzen 5 5600X", "RTX 4060 8GB", "16GB RGB RAM"]
  },
  // Printers
  {
    _id: "mock-3",
    name: "HP LaserJet Pro M404dn Printer", price: 21999, mrp: 25000, sku: "HP-M404", brand: "HP", category: "printers",
    images: ["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80"],
    stock: 45, discount: 12, rating: 4.9, reviewCount: 312, highlights: ["Monochrome Laser", "Duplex Printing"]
  },
  // Networking
  {
    _id: "mock-4",
    name: "Cisco Catalyst 1000 Series Managed Switch", price: 42999, mrp: 48000, sku: "CIS-C1000", brand: "Cisco", category: "networking",
    images: ["https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80"],
    stock: 0, discount: 10, rating: 4.7, reviewCount: 56, highlights: ["24 Ports", "Gigabit Ethernet", "Managed"]
  },
  // UPS & Power
  {
    _id: "mock-7",
    name: "APC Smart-UPS 1500VA", price: 42000, mrp: 48000, sku: "APC-SMT1500", brand: "APC", category: "ups",
    images: ["https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&w=800&q=80"],
    stock: 8, discount: 12, rating: 4.9, reviewCount: 34, highlights: ["1.5kVA Output", "LCD Display", "Pure Sine Wave"]
  },
  // Accessories
  {
    _id: "mock-2",
    name: "Dell UltraSharp 32 4K USB-C Hub Monitor", price: 65999, mrp: 72000, sku: "DELL-U32", brand: "Dell", category: "accessories",
    images: ["https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=800&q=80"],
    stock: 8, discount: 8, rating: 4.6, reviewCount: 89, highlights: ["4K Resolution", "USB-C Hub", "IPS Black"]
  }
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Parse search params into MongoDB query
  const category = searchParams.category as string | undefined;
  const inStock = searchParams.inStock === "true";
  
  let query: any = {};
  if (category) {
    query.category = category;
  }
  
  if (inStock) {
    query.stock = { $gt: 0 };
  }

  // Handle dynamic filters mapping to "specs.xxxx"
  const catConfig = category 
    ? (storeConfig.categories.find(c => c.id === category) || storeConfig.categories[0])
    : null;
  
  if (catConfig) {
    catConfig.filters.forEach(filter => {
      const filterValues = searchParams[filter.id];
      if (filterValues) {
        const valuesArray = Array.isArray(filterValues) ? filterValues : [filterValues];
        if (filter.id === "brand") {
          query.brand = { $in: valuesArray.map(v => new RegExp(v, "i")) };
        } else {
          query[`specs.${filter.id}`] = { $in: valuesArray };
        }
      }
    });
  }

  let products: any[] = [];
  try {
    await connectDB();
    products = await Product.find(query).sort({ createdAt: -1 });
  } catch (err) {
    console.warn("MongoDB connection failed, falling back to categorized sample data.");
    
    // Filter mock data locally
    products = MOCK_PRODUCTS;
    if (category) {
      products = products.filter(p => p.category === category);
    }
  }

  const pageTitle = catConfig ? catConfig.name : "All Products";

  return (
    <div className="min-h-screen bg-background text-foreground pt-8 pb-32">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        
        {/* Compact Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground tracking-tight">{pageTitle}</h1>
          
          <div className="flex items-center gap-4 self-start md:self-auto">
            <select className="bg-white border border-border text-foreground font-semibold text-sm px-4 py-2 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-sm">
              <option>Sort: Newest Arrivals</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Mobile Filter Button */}
          <div className="lg:hidden w-full">
            <button className="w-full bg-white border border-border rounded-xl py-3.5 flex items-center justify-center gap-2 font-bold text-sm text-foreground shadow-sm hover:border-primary transition-colors">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters & Sorting
            </button>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28">
              <FilterSidebar categoryId={category || ""} />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="py-20 text-center border border-border bg-card/50 rounded-2xl shadow-sm">
                <h3 className="text-2xl font-heading font-bold text-muted-foreground mb-2">No Products Found</h3>
                <p className="text-muted-foreground font-medium text-sm">We couldn't find any products matching those filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
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
                <button className="bg-white border border-border text-foreground font-bold text-sm tracking-wide px-8 py-4 rounded-xl shadow-sm hover:border-primary hover:text-primary transition-colors">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
