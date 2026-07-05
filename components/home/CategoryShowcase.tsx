"use client";

import { storeConfig } from "@/lib/store-config";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CategoryShowcase() {
  // Taking the first 6 categories for the bento grid
  const cats = storeConfig.categories.slice(0, 6);

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader 
          overline="Our Offerings"
          title="Enterprise-Grade Hardware"
          subtitle="Explore our comprehensive range of technology solutions from industry-leading manufacturers."
          align="center"
        />

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          {cats.map((cat, i) => {
            // Make the first two items span 2 columns on tablet/desktop if we want a specific bento look
            // For now, let's make index 0 span 2 cols on lg, index 3 span 2 cols on lg
            const isLarge = i === 0 || i === 3;
            
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className={`group relative rounded-2xl overflow-hidden block ${isLarge ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <Link href={cat.link} className="absolute inset-0 z-20">
                  <span className="sr-only">Explore {cat.name}</span>
                </Link>
                
                {/* Image */}
                <div className="absolute inset-0 bg-muted">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 mb-4 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    <span className="text-sm font-semibold uppercase tracking-wider">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Glow Border on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-2xl transition-colors duration-300 z-10 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
