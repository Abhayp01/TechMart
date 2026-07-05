"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/store/ProductCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Mock data for featured products until API is connected
const FEATURED_PRODUCTS = [
  {
    _id: "f1",
    name: "Dell Latitude 5430 Business Laptop",
    brand: "Dell",
    sku: "DELL-LAT5430",
    price: 85000,
    mrp: 105000,
    discount: 19,
    stock: 15,
    rating: 4.8,
    reviewCount: 42,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "f2",
    name: "Cisco Catalyst 9200L 48-port PoE+ Switch",
    brand: "Cisco",
    sku: "C9200L-48P-4G-E",
    price: 145000,
    mrp: 160000,
    discount: 9,
    stock: 5,
    rating: 5.0,
    reviewCount: 12,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "f3",
    name: "HP LaserJet Pro M404dn Monochrome",
    brand: "HP",
    sku: "HP-M404DN",
    price: 24500,
    mrp: 28000,
    discount: 12,
    stock: 22,
    rating: 4.6,
    reviewCount: 85,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "f4",
    name: "APC Smart-UPS 1500VA LCD 230V",
    brand: "APC",
    sku: "SMT1500I",
    price: 42000,
    mrp: 48000,
    discount: 12,
    stock: 8,
    rating: 4.9,
    reviewCount: 34,
    image: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&w=400&q=80",
  }
];

export function FeaturedProducts() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="flex-1">
            <SectionHeader 
              overline="Featured"
              title="Best Selling Hardware"
              subtitle="Top-rated equipment trusted by our enterprise clients."
            />
          </div>
          <Link 
            href="/products" 
            className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors mb-12"
          >
            View Full Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Scrollable container on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-8 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 gap-6 snap-x snap-mandatory hide-scrollbar">
          {FEATURED_PRODUCTS.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[280px] w-[85vw] sm:w-[320px] lg:w-auto shrink-0 snap-start"
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-primary font-semibold"
          >
            View Full Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
