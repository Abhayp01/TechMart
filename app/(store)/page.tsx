import { storeConfig } from "@/lib/store-config";
import { ProductCard } from "@/components/store/ProductCard";
import { Shield, Truck, Lock, RefreshCw, Headphones } from "lucide-react";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export default async function StoreHome() {
  let rawProducts: any[] = [];
  
  try {
    await connectDB();
    rawProducts = await Product.find({ isFeatured: true }).limit(4);
  } catch (err) {
    console.warn("MongoDB connection failed, falling back to sample data.");
    rawProducts = [
      {
        _id: { toString: () => "mock-1" },
        name: "Nexus Core Alpha", price: 1299, mrp: 1499, sku: "SYS-A1", brand: "Nexus",
        images: ["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80"],
        stock: 15, discount: 13, rating: 4.8, reviewCount: 124, highlights: ["Intel i9 13th Gen", "RTX 4090"]
      },
      {
        _id: { toString: () => "mock-2" },
        name: "Neural Link Headset", price: 349, mrp: 399, sku: "AUD-N2", brand: "Nexus",
        images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80"],
        stock: 8, discount: 12, rating: 4.6, reviewCount: 89, highlights: ["Active Noise Cancelling", "40hr Battery"]
      },
      {
        _id: { toString: () => "mock-3" },
        name: "Tactical Data Vault", price: 199, sku: "STO-T1", brand: "Nexus",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"],
        stock: 45, discount: 0, rating: 4.9, reviewCount: 312, highlights: ["2TB NVMe SSD", "AES-256 Hardware Encryption"]
      },
      {
        _id: { toString: () => "mock-4" },
        name: "Quantum Processor Q9", price: 899, mrp: 1099, sku: "CPU-Q9", brand: "Nexus",
        images: ["https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80"],
        stock: 0, discount: 18, rating: 4.7, reviewCount: 56, highlights: ["16 Cores / 32 Threads", "Up to 5.8 GHz"]
      }
    ];
  }

  const featuredProducts = rawProducts.map(p => ({
    _id: p._id.toString(),
    name: p.name,
    price: p.price,
    mrp: p.mrp,
    sku: p.sku,
    brand: p.brand,
    image: p.images?.[0] || "",
    stock: p.stock,
    discount: p.discount,
    rating: p.rating,
    reviewCount: p.reviewCount,
    highlights: p.highlights
  }));

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield": return <Shield className="w-8 h-8 text-[#6C63FF] mb-4" />;
      case "Truck": return <Truck className="w-8 h-8 text-[#6C63FF] mb-4" />;
      case "Lock": return <Lock className="w-8 h-8 text-[#6C63FF] mb-4" />;
      case "RefreshCw": return <RefreshCw className="w-8 h-8 text-[#6C63FF] mb-4" />;
      case "Headphones": return <Headphones className="w-8 h-8 text-[#6C63FF] mb-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F5F0EB]">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center border-b border-[#222] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent z-10" />
          <img 
            src={storeConfig.hero[0].image} 
            alt={storeConfig.hero[0].imageAlt} 
            className="w-full h-full object-cover object-right opacity-40 grayscale"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 pt-20">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.1] mb-6 tracking-tighter">
              {storeConfig.hero[0].headline}
            </h1>
            <p className="text-lg md:text-2xl text-[#888] max-w-2xl mb-12 font-light">
              {storeConfig.hero[0].subheadline}
            </p>
            <a 
              href={storeConfig.hero[0].ctaLink}
              className="inline-block bg-[#F5F0EB] text-[#0A0A0F] font-mono font-bold tracking-widest text-sm py-5 px-10 hover:bg-[#6C63FF] hover:text-[#F5F0EB] transition-colors"
            >
              {storeConfig.hero[0].ctaText}
            </a>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b border-[#222] bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {storeConfig.trustBar.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start">
                {getIcon(item.icon)}
                <h3 className="font-mono font-bold text-sm tracking-widest mb-2 text-[#F5F0EB]">{item.title}</h3>
                <p className="text-[#666] text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16 border-b border-[#222] pb-6">
            <h2 className="text-3xl md:text-5xl font-heading font-semibold text-[#F5F0EB]">FEATURED HARDWARE</h2>
            <a href="/products" className="text-[#6C63FF] hover:text-[#F5F0EB] font-mono text-sm tracking-widest transition-colors hidden md:block">
              VIEW ALL [→]
            </a>
          </div>
          
          <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
            {featuredProducts.map((product) => (
              <div key={product._id} className="break-inside-avoid">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-32 bg-[#0d0d14] border-t border-[#222]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-heading font-semibold text-[#F5F0EB] mb-16 text-center">CATEGORIES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storeConfig.categories.map((cat) => (
              <a key={cat.id} href={cat.link} className="group relative block aspect-square bg-[#111] overflow-hidden border border-[#222]">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-50 grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="font-mono font-bold tracking-[0.2em] text-xl md:text-2xl text-[#F5F0EB] bg-[#0A0A0F]/80 backdrop-blur-sm px-6 py-3 border border-[#333]">
                    {cat.name}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
