import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { ShoppingBag, Heart, Share2, Shield, Truck, Check, X, Zap } from "lucide-react";
import { ReviewSection } from "@/components/store/ReviewSection";
import AddToCartButton from "@/components/store/AddToCartButton";

// Mock product used when DB is not available
const MOCK_PRODUCT = {
  _id: "mock-detail-1",
  name: "Dell Inspiron 15 3000",
  brand: "Dell",
  brandSlug: "dell",
  sku: "DELL-INS15",
  slug: "dell-inspiron-15",
  price: 54999,
  mrp: 62000,
  discount: 11,
  stock: 12,
  has360: false,
  images: [
    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=80",
  ],
  highlights: [
    "Intel Core i5 12th Gen Processor",
    "8GB DDR4 RAM (Expandable to 16GB)",
    "512GB NVMe SSD",
    "15.6\" FHD Anti-glare Display",
    "Windows 11 Home",
    "1 Year On-Site Warranty",
  ],
  specs: {
    Processor: "Intel Core i5-1235U",
    RAM: "8GB DDR4 3200MHz",
    Storage: "512GB M.2 NVMe SSD",
    Display: "15.6\" FHD (1920x1080) Anti-glare",
    Graphics: "Intel Iris Xe Graphics",
    Battery: "41WHr, 3-Cell",
    OS: "Windows 11 Home",
    Weight: "1.7 Kg",
  },
  inbox: ["Laptop", "65W Adapter", "Quick Start Guide"],
};

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  let product: any = null;

  try {
    await connectDB();
    product = await Product.findOne({ slug: params.slug });
    if (!product) {
      product = await Product.findOne({ sku: params.slug });
    }
  } catch (err) {
    console.warn("MongoDB unavailable on product detail page, using mock data.");
    product = MOCK_PRODUCT;
  }

  if (!product) {
    // DB connected but product not found — use mock instead of 404 in dev
    product = MOCK_PRODUCT;
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price);
  const formattedMrp = product.mrp ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp) : null;
  const productId = typeof product._id === "string" ? product._id : product._id.toString();

  return (
    <div className="min-h-screen bg-background text-foreground pt-8 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-primary transition-colors">Products</a>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        {/* Top Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">

          {/* Left: Image Gallery */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-border rounded-2xl p-8 aspect-square relative flex items-center justify-center overflow-hidden group shadow-sm">
              <img
                src={product.images?.[0] || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80"}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 origin-center cursor-crosshair mix-blend-multiply"
              />
              {product.has360 && (
                <div className="absolute top-6 right-6 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow">
                  360° VIEW
                </div>
              )}
              {product.discount > 0 && (
                <div className="absolute top-6 left-6 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img: string, i: number) => (
                  <button key={i} className={`w-20 h-20 shrink-0 bg-white border-2 rounded-xl p-2 flex items-center justify-center transition-colors ${i === 0 ? 'border-primary shadow-sm' : 'border-border hover:border-primary/50'}`}>
                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Purchase Panel */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <a href={`/products?brand=${product.brandSlug || product.brand}`} className="text-xs font-semibold text-primary uppercase tracking-wider hover:underline mb-3 inline-block">
              {product.brand}
            </a>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 leading-tight text-foreground">{product.name}</h1>
            <p className="text-sm font-medium text-muted-foreground mb-6 border-b border-border pb-6">
              SKU: {product.sku}
            </p>

            <div className="flex items-end gap-4 mb-4">
              <span className="text-4xl font-heading font-extrabold text-foreground">{formattedPrice}</span>
              {formattedMrp && product.mrp > product.price && (
                <span className="text-xl font-medium text-muted-foreground line-through mb-1">{formattedMrp}</span>
              )}
            </div>

            {product.discount > 0 && (
              <div className="inline-block bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-3 py-1 rounded-md mb-6">
                YOU SAVE {product.discount}% (₹{(product.mrp - product.price).toLocaleString('en-IN')})
              </div>
            )}

            <div className="space-y-2.5 mb-8">
              {(product.highlights || []).map((hl: string, i: number) => (
                <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {hl}
                </div>
              ))}
            </div>

            {/* Stock & Delivery */}
            <div className="bg-muted/30 border border-border rounded-xl p-4 mb-6 space-y-3">
              <div className="flex items-center gap-2">
                {product.stock > 10 ? (
                  <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                    <Check className="w-4 h-4" /> In Stock — Ships within 24 hours
                  </span>
                ) : product.stock > 0 ? (
                  <span className="flex items-center gap-2 text-sm font-semibold text-amber-600">
                    <Zap className="w-4 h-4" /> Only {product.stock} left — Order soon!
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-sm font-semibold text-red-600">
                    <X className="w-4 h-4" /> Currently Out of Stock
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Free delivery across Delhi NCR</span>
              </div>
            </div>

            {/* Pincode Check */}
            <div className="flex gap-2 mb-8">
              <input
                type="text"
                placeholder="Enter Pincode"
                className="flex-1 bg-muted/50 border border-border px-4 py-2.5 text-sm rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button className="bg-muted border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary rounded-lg transition-colors">
                Check
              </button>
            </div>

            <AddToCartButton product={{
              id: productId,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || "",
              sku: product.sku,
              stock: product.stock,
            }} />

            <div className="flex gap-3 mt-4">
              <button className="flex-1 border border-border py-3 text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2 rounded-lg">
                <Heart className="w-4 h-4" /> Wishlist
              </button>
              <button className="flex-1 border border-border py-3 text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2 rounded-lg">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Below the Fold: Specs & Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div className="lg:col-span-2 space-y-16">
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6 border-b border-border pb-4 text-foreground">Technical Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex flex-col border-b border-border pb-3">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-sm font-medium text-foreground mt-1">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.inbox && product.inbox.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6 border-b border-border pb-4 text-foreground">In The Box</h2>
                <ul className="space-y-2">
                  {product.inbox.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ReviewSection productId={productId} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-4">
              <div className="bg-card p-6 border border-border rounded-xl shadow-sm">
                <Shield className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-heading font-bold text-lg mb-2 text-foreground">B.K. Infotech Guarantee</h3>
                <p className="text-sm text-muted-foreground">Every product is 100% genuine and verified. We stand behind what we sell.</p>
              </div>
              <div className="bg-card p-6 border border-border rounded-xl shadow-sm">
                <Truck className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-heading font-bold text-lg mb-2 text-foreground">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">Same-day delivery available in Delhi NCR. Pan India shipping in 3-5 days.</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                <p className="text-sm font-semibold text-blue-800 mb-1">Need help choosing?</p>
                <p className="text-sm text-blue-700">Call us: <a href="tel:+919811582155" className="font-bold hover:underline">+91-9811582155</a></p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
