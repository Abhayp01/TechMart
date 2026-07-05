"use client";

import { storeConfig } from "@/lib/store-config";
import { MarqueeRow } from "@/components/ui/MarqueeRow";
import { motion } from "framer-motion";

export function BrandMarquee() {
  const half = Math.ceil(storeConfig.brands.length / 2);
  const row1 = storeConfig.brands.slice(0, half);
  const row2 = storeConfig.brands.slice(half);

  return (
    <section className="py-16 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8 text-center">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Authorized partner for industry-leading brands
        </motion.p>
      </div>

      <div className="relative flex flex-col gap-8 opacity-80 hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <MarqueeRow direction="left" speed="slow">
          {row1.map((brand, i) => (
            <div key={i} className="flex items-center justify-center w-40 h-16 grayscale hover:grayscale-0 transition-all duration-300">
              {/* Fallback to text if image fails/is missing, normally would use next/image with proper paths */}
              <img 
                src={`/brands/${brand.slug}.png`} 
                alt={brand.name} 
                className="max-h-full max-w-full object-contain" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl font-bold font-heading text-foreground/80">${brand.name}</span>`;
                }}
              />
            </div>
          ))}
        </MarqueeRow>

        <MarqueeRow direction="right" speed="slow">
          {row2.map((brand, i) => (
            <div key={i} className="flex items-center justify-center w-40 h-16 grayscale hover:grayscale-0 transition-all duration-300">
              <img 
                src={`/brands/${brand.slug}.png`} 
                alt={brand.name} 
                className="max-h-full max-w-full object-contain" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl font-bold font-heading text-foreground/80">${brand.name}</span>`;
                }}
              />
            </div>
          ))}
        </MarqueeRow>
      </div>
    </section>
  );
}
