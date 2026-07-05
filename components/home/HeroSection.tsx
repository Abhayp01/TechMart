"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { storeConfig } from "@/lib/store-config";
import Link from "next/link";
import { ArrowRight, Cpu, Monitor, Wifi } from "lucide-react";
import { useRef } from "react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden gradient-hero border-b border-border">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-blob delay-500" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-success/5 rounded-full blur-3xl animate-blob delay-700" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div 
          className="lg:col-span-6 flex flex-col items-start"
          style={{ y: parallaxY, opacity: parallaxOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start w-full"
          >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur border border-border text-sm font-semibold text-primary mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Delhi NCR's Premier Tech Partner
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-foreground leading-[1.1] mb-6 tracking-tight">
            {storeConfig.hero.headline.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed font-medium">
            {storeConfig.hero.subheadline}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link 
              href={storeConfig.hero.ctaPrimary.link}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover-glow transition-all flex items-center justify-center gap-2 group shadow-elevated text-lg"
            >
              {storeConfig.hero.ctaPrimary.text}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href={storeConfig.hero.ctaSecondary.link}
              className="w-full sm:w-auto px-8 py-4 bg-white text-foreground font-semibold rounded-xl border border-border hover:border-primary/50 transition-all flex items-center justify-center shadow-sm text-lg"
            >
              {storeConfig.hero.ctaSecondary.text}
            </Link>
          </div>
          
          {/* Quick stats under hero */}
          <div className="flex items-center gap-6 mt-12 pt-6 border-t border-border w-full">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium">
                <span className="font-bold text-foreground">5,000+</span><br/>
                <span className="text-muted-foreground text-xs">Happy Clients</span>
              </div>
            </div>
            <div className="h-10 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2 text-sm font-medium hidden sm:flex">
              <img src="/brands/apple.png" alt="Apple" className="h-5 opacity-60 grayscale" onError={(e) => e.currentTarget.style.display = 'none'} />
              <img src="/brands/dell.png" alt="Dell" className="h-5 opacity-60 grayscale" onError={(e) => e.currentTarget.style.display = 'none'} />
              <img src="/brands/hp.png" alt="HP" className="h-5 opacity-60 grayscale" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
          </div>
          </motion.div>
        </motion.div>

        {/* Right Floating Collage (Bento Grid) */}
        <motion.div 
          className="lg:col-span-6 relative w-full mt-10 lg:mt-0"
          style={{ y: parallaxY }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 h-[240px] sm:h-[320px] md:h-[520px]"
          >
            {/* Column 1 */}
            <div className="flex flex-col gap-4 h-full">
              {/* Tile 1: Laptop Work (Large) */}
              <div className="flex-1 h-full md:h-[60%] relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm group">
                <img 
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80" 
                  alt="Professional Workspace" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Tile 4: Networking (Small - Hidden on mobile) */}
              <div className="hidden md:block md:h-[35%] relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm group">
                <img 
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80" 
                  alt="Networking Equipment" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Dark gradient for badge legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                
                {/* Floating Networking Badge */}
                <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-white/95 backdrop-blur border border-white/20 px-3 py-1.5 rounded-xl shadow-md">
                  <div className="bg-success/10 p-1.5 rounded-lg"><Wifi className="text-success w-4 h-4" /></div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-none">Networking</p>
                    <p className="text-xs font-bold text-foreground mt-0.5 leading-none">Enterprise Grade</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4 h-full pt-4 md:pt-8">
              {/* Tile 2: Gaming setup (Small) */}
              <div className="flex-1 h-full md:h-[35%] relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm group">
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" 
                  alt="RGB Gaming Setup" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Tile 3: Custom Build / Internals (Large - Hidden on mobile) */}
              <div className="hidden md:block md:h-[60%] relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm group">
                <img 
                  src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80" 
                  alt="PC Internals" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Dark gradient for badge legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

                {/* Floating Custom Build Badge */}
                <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-white/95 backdrop-blur border border-white/20 px-3 py-1.5 rounded-xl shadow-md">
                  <div className="bg-primary/10 p-1.5 rounded-lg"><Cpu className="text-primary w-4 h-4" /></div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-none">Custom Build</p>
                    <p className="text-xs font-bold text-foreground mt-0.5 leading-none">High Performance</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
