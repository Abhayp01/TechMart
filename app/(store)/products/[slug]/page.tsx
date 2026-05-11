import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import { ShoppingBag, Heart, Share2, Shield, Truck, Zap } from "lucide-react";
import { ReviewSection } from "@/components/store/ReviewSection";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  await connectDB();
  
  // Try finding by slug first, then fallback to SKU
  let product = await Product.findOne({ slug: params.slug });
  if (!product) {
    product = await Product.findOne({ sku: params.slug });
  }

  if (!product) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price);
  const formattedMrp = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F5F0EB] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24">
          
          {/* Left: Image Gallery (60%) */}
          <div className="lg:col-span-7">
            <div className="bg-[#111] border border-[#222] p-8 aspect-square relative flex items-center justify-center overflow-hidden group">
              <img 
                src={product.images[0] || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80"} 
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-125 origin-center cursor-crosshair"
              />
              {product.has360 && (
                <div className="absolute top-6 right-6 bg-[#6C63FF] text-white text-xs font-bold px-3 py-1 rounded-full">
                  360° VIEW
                </div>
              )}
            </div>
            
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              {product.images.map((img: string, i: number) => (
                <button key={i} className={`w-24 h-24 shrink-0 bg-[#111] border p-2 flex items-center justify-center ${i === 0 ? 'border-[#6C63FF]' : 'border-[#222]'}`}>
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Purchase Panel (40%) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <a href={`/brands/${product.brandSlug}`} className="text-xs font-mono text-[#6C63FF] uppercase tracking-wider hover:underline mb-4 inline-block">
              {product.brand}
            </a>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 leading-tight">{product.name}</h1>
            <p className="text-sm font-mono text-[#666] mb-6 border-b border-[#222] pb-6">
              SKU: {product.sku} | MODEL: {product.slug}
            </p>

            <div className="flex items-end gap-4 mb-4">
              <span className="text-4xl font-mono font-bold text-[#F5F0EB]">{formattedPrice}</span>
              {product.mrp > product.price && (
                <span className="text-xl font-mono text-[#666] line-through mb-1">{formattedMrp}</span>
              )}
            </div>

            {product.discount > 0 && (
              <div className="inline-block bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-bold px-3 py-1 rounded mb-8">
                SAVE {product.discount}% (₹{product.mrp - product.price})
              </div>
            )}

            <div className="space-y-3 mb-8">
              {(product.highlights || []).map((hl: string, i: number) => (
                <div key={i} className="flex items-center gap-3 text-sm text-[#888]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
                  {hl}
                </div>
              ))}
            </div>

            <div className="bg-[#111] border border-[#222] p-4 mb-8">
              <p className="font-mono text-sm mb-2 text-[#F5F0EB]">DELIVERY ESTIMATE</p>
              <div className="flex gap-2">
                <input type="text" placeholder="PINCODE" className="bg-[#0A0A0F] border border-[#333] px-3 py-2 text-sm font-mono w-32 outline-none focus:border-[#6C63FF]" />
                <button className="bg-[#222] text-[#888] hover:text-[#F5F0EB] px-4 text-sm font-mono transition-colors">CHECK</button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              {product.stock > 10 ? (
                <span className="flex items-center gap-2 text-sm font-mono text-green-400">
                  <Check className="w-4 h-4" /> IN STOCK — SHIPS 24HRS
                </span>
              ) : product.stock > 0 ? (
                <span className="flex items-center gap-2 text-sm font-mono text-amber-400">
                  <Zap className="w-4 h-4" /> ONLY {product.stock} LEFT
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm font-mono text-red-400">
                  <X className="w-4 h-4" /> OUT OF STOCK
                </span>
              )}
            </div>

            <button 
              disabled={product.stock <= 0}
              className="w-full bg-[#F5F0EB] text-[#0A0A0F] font-bold py-4 hover:bg-[#6C63FF] hover:text-white transition-all tracking-[0.2em] text-sm disabled:opacity-50 mb-4 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> ADD TO CART
            </button>

            <div className="flex gap-4">
              <button className="flex-1 border border-[#333] py-3 text-sm font-mono text-[#888] hover:text-[#F5F0EB] hover:border-[#6C63FF] transition-colors flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" /> WISHLIST
              </button>
              <button className="flex-1 border border-[#333] py-3 text-sm font-mono text-[#888] hover:text-[#F5F0EB] hover:border-[#6C63FF] transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> SHARE
              </button>
            </div>

          </div>
        </div>

        {/* Below the Fold: Specs & Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-16">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6 border-b border-[#222] pb-4">TECHNICAL SPECIFICATIONS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {product.specs && Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex flex-col border-b border-[#222] pb-2">
                    <span className="text-xs font-mono text-[#666] uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-sm text-[#F5F0EB] mt-1">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {product.inbox && product.inbox.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6 border-b border-[#222] pb-4">IN THE BOX</h2>
                <ul className="list-disc list-inside text-[#888] space-y-2">
                  {product.inbox.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <ReviewSection productId={product._id.toString()} />
          </div>

          <div className="lg:col-span-1">
            {/* Sticky sidebar for related or trust markers */}
            <div className="sticky top-32 space-y-6">
              <div className="bg-[#111] border border-[#222] p-6">
                <Shield className="w-8 h-8 text-[#6C63FF] mb-4" />
                <h3 className="font-heading font-bold text-lg mb-2">NEXUS GUARANTEE</h3>
                <p className="text-sm text-[#888]">Every product passes our rigorous 14-point inspection. Guaranteed authentic.</p>
              </div>
              <div className="bg-[#111] border border-[#222] p-6">
                <Truck className="w-8 h-8 text-[#6C63FF] mb-4" />
                <h3 className="font-heading font-bold text-lg mb-2">SECURE TRANSIT</h3>
                <p className="text-sm text-[#888]">Insured global shipping with cryptographic tracking and signature delivery.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Simple placeholder for ReviewSection to avoid compilation errors before we build it fully
function Check({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
}
function X({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
}
