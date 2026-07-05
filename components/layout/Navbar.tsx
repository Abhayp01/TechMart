"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, Monitor, Heart, User, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { storeConfig } from "@/lib/store-config";

export default function Navbar() {
  const { items, openCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: "Products", href: "/products", hasMegaMenu: true },
    { label: "Business", href: "/business", hasMegaMenu: false },
    { label: "Services", href: "/services", hasMegaMenu: false },
    { label: "Custom PC", href: "/custom-build", hasMegaMenu: false },
  ];

  return (
    <>
      <motion.nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-md border-b border-border shadow-sm py-3" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group z-50">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-glow-blue group-hover:scale-105 transition-transform">
                <Monitor className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl tracking-tight text-foreground leading-none">
                  B.K. Infotech
                </span>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-widest mt-1">
                  Enterprise
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 h-full">
              {navLinks.map((link) => (
                <div 
                  key={link.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => link.hasMegaMenu && setActiveMegaMenu(link.label)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link 
                    href={link.href} 
                    className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2 group"
                  >
                    {link.label}
                    {link.hasMegaMenu && <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />}
                  </Link>
                  
                  {/* Underline animation */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  
                  {/* Mega Menu Dropdown */}
                  {link.hasMegaMenu && (
                    <AnimatePresence>
                      {activeMegaMenu === link.label && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px] cursor-default"
                        >
                          <div className="bg-white rounded-2xl shadow-xl border border-border p-6 grid grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Categories</h4>
                              <ul className="space-y-3">
                                {storeConfig.categories.slice(0, 5).map(cat => (
                                  <li key={cat.id}>
                                    <Link href={cat.link} className="text-sm font-medium text-foreground hover:text-primary transition-colors block">
                                      {cat.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-surface -m-6 p-6 rounded-r-2xl border-l border-border flex flex-col justify-between">
                              <div>
                                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Featured</h4>
                                <h5 className="font-bold text-foreground mb-1">Custom Built PCs</h5>
                                <p className="text-xs text-muted-foreground mb-4">Design your perfect workstation or gaming rig.</p>
                                <Link href="/custom-build" className="text-xs font-bold text-primary hover:underline">Start Building →</Link>
                              </div>
                              <img src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=300&q=80" alt="PC Build" className="rounded-lg shadow-sm" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 z-50">
              <div className="hidden md:flex items-center relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="pl-10 pr-4 py-2 bg-muted/50 border border-transparent focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-full text-sm outline-none transition-all w-48 focus:w-64"
                />
              </div>

              <button className="hidden sm:flex text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted">
                <Heart className="h-5 w-5" />
              </button>
              
              <button className="hidden sm:flex text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted">
                <User className="h-5 w-5" />
              </button>
              
              <button 
                onClick={openCart}
                className="relative p-2 rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-colors group"
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && cartItemCount > 0 && (
                  <motion.span 
                    key={cartItemCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white group-hover:border-primary transition-colors"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </button>

              <button className="lg:hidden p-2 text-foreground">
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
          </div>
        </div>
      </motion.nav>
      {/* Spacer to prevent content jump when navbar becomes sticky */}
      <div className="h-20" />
    </>
  );
}
