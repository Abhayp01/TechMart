"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, Monitor, Heart, User, ChevronDown, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { storeConfig } from "@/lib/store-config";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { items, openCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCurrentUser(data.data);
      })
      .catch(() => {});
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!val.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }
    setSearchLoading(true);
    setIsSearchOpen(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(val.trim())}`);
        const data = await res.json();
        setSearchResults(data.success ? data.data : []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setCurrentUser(null);
        setIsUserDropdownOpen(false);
        window.location.reload();
      }
    } catch {}
  };

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: "Products", href: "/products", hasMegaMenu: true },
    { label: "Business", href: "/business", hasMegaMenu: false },
    { label: "Custom PC", href: "/custom-build", hasMegaMenu: false },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm py-3"
            : "bg-white/60 backdrop-blur-sm py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0 z-50">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Monitor className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg tracking-tight text-foreground leading-none">
                  B.K. Infotech
                </span>
                <span className="text-[9px] font-bold text-primary uppercase tracking-[0.15em] mt-0.5">
                  Enterprise IT
                </span>
              </div>
            </Link>

            {/* Desktop Navigation — centered */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasMegaMenu && setActiveMegaMenu(link.label)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-muted/50 group"
                  >
                    {link.label}
                    {link.hasMegaMenu && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMegaMenu === link.label ? "rotate-180" : ""}`} />}
                  </Link>

                  {/* Mega Menu */}
                  {link.hasMegaMenu && (
                    <AnimatePresence>
                      {activeMegaMenu === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[580px] cursor-default"
                        >
                          <div className="bg-white rounded-2xl shadow-xl border border-border p-5 grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Categories</h4>
                              <ul className="space-y-2">
                                {storeConfig.categories.slice(0, 6).map(cat => (
                                  <li key={cat.id}>
                                    <Link href={cat.link} className="text-sm font-medium text-foreground hover:text-primary transition-colors block py-0.5">
                                      {cat.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-muted/30 -m-5 p-5 rounded-r-2xl border-l border-border flex flex-col justify-between">
                              <div>
                                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Featured</h4>
                                <h5 className="font-bold text-foreground mb-1">Custom Built PCs</h5>
                                <p className="text-xs text-muted-foreground mb-3">Design your perfect workstation or gaming rig.</p>
                                <Link href="/custom-build" className="text-xs font-bold text-primary hover:underline">Start Building →</Link>
                              </div>
                              <img src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=300&q=80" alt="PC Build" className="rounded-xl shadow-sm mt-4" />
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
            <div className="flex items-center gap-2 shrink-0">

              {/* Search */}
              <div ref={searchRef} className="relative hidden md:block">
                <form onSubmit={handleSearchSubmit}>
                  <div className="flex items-center bg-muted/50 border border-transparent focus-within:bg-white focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15 rounded-full transition-all">
                    <Search className="h-4 w-4 text-muted-foreground ml-3 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => searchQuery && setIsSearchOpen(true)}
                      placeholder="Search products..."
                      className="pl-2.5 pr-3 py-2 bg-transparent text-sm outline-none w-44 focus:w-56 transition-all text-foreground placeholder:text-muted-foreground"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(""); setSearchResults([]); setIsSearchOpen(false); }}
                        className="mr-2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Search results dropdown */}
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-border overflow-hidden z-50"
                    >
                      {searchLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                      ) : searchResults.length > 0 ? (
                        <>
                          <div className="p-2">
                            {searchResults.slice(0, 6).map((product) => (
                              <Link
                                key={product._id}
                                href={`/products/${product.slug}`}
                                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors"
                              >
                                {product.images?.[0] && (
                                  <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded-lg shrink-0 bg-muted" />
                                )}
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">₹{product.price?.toLocaleString("en-IN")}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-border p-3">
                            <button
                              onClick={handleSearchSubmit as any}
                              className="w-full text-center text-xs font-bold text-primary hover:underline"
                            >
                              See all results for "{searchQuery}" →
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">No products found for "{searchQuery}"</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <button className="hidden sm:flex text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted">
                <Heart className="h-5 w-5" />
              </button>

              {/* User Menu */}
              <div className="relative">
                {currentUser ? (
                  <>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-full hover:bg-muted cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-xs font-semibold max-w-[72px] truncate text-foreground">{currentUser.name.split(" ")[0]}</span>
                    </button>
                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-border py-2 z-50"
                        >
                          <div className="px-4 py-2.5 border-b border-border mb-1">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Signed in as</p>
                            <p className="text-sm font-bold text-foreground truncate">{currentUser.email}</p>
                          </div>
                          {currentUser.role === "ADMIN" && (
                            <Link
                              href="/admin/products"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted font-semibold transition-colors"
                            >
                              Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors cursor-pointer"
                          >
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-full hover:bg-muted"
                  >
                    <User className="h-4.5 w-4.5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-full bg-primary/8 text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                {mounted && cartItemCount > 0 && (
                  <motion.span
                    key={cartItemCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu button */}
              <button className="lg:hidden p-2 text-foreground rounded-lg hover:bg-muted transition-colors">
                <Menu className="h-5 w-5" />
              </button>
            </div>

          </div>
        </div>
      </motion.nav>
      {/* Spacer */}
      <div className="h-[68px]" />
    </>
  );
}
