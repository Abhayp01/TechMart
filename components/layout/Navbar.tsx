"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, Hexagon } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar() {
  const { items, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  
  // Blur backdrop only appears after 80px scroll
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.9]);
  const blurValue = useTransform(scrollY, [0, 80], [0, 8]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <motion.nav 
      className="fixed top-0 w-full z-50 border-b border-[#333]/0 transition-colors duration-300"
      style={{
        backgroundColor: `rgba(10, 10, 15, ${bgOpacity.get()})`,
        backdropFilter: `blur(${blurValue.get()}px)`,
        borderBottomColor: scrollY.get() > 80 ? '#222' : 'transparent'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Hexagon className="h-6 w-6 text-[#F5F0EB] group-hover:text-[#6C63FF] transition-colors" />
            <span className="font-heading font-bold text-2xl tracking-[0.15em] text-[#F5F0EB]">
              NEXUS CORE
            </span>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-mono text-[#888] hover:text-[#F5F0EB] tracking-widest transition-colors">SHOP</Link>
            <Link href="/products?category=audio" className="text-sm font-mono text-[#888] hover:text-[#F5F0EB] tracking-widest transition-colors">AUDIO</Link>
            <Link href="/products?category=compute" className="text-sm font-mono text-[#888] hover:text-[#F5F0EB] tracking-widest transition-colors">COMPUTE</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            <button className="text-[#888] hover:text-[#F5F0EB] transition-colors hidden sm:block">
              <Search className="h-5 w-5" />
            </button>
            
            <button 
              onClick={openCart}
              className="text-[#888] hover:text-[#F5F0EB] transition-colors relative flex items-center gap-2 group"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && (
                <motion.span 
                  key={cartItemCount}
                  initial={{ scale: 0.5, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="font-mono text-sm text-[#F5F0EB] group-hover:text-[#6C63FF]"
                >
                  [{cartItemCount}]
                </motion.span>
              )}
            </button>

            <button className="md:hidden text-[#888] hover:text-[#F5F0EB] transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
