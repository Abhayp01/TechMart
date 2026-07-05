"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SearchDropdown() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.length > 2) {
        fetchResults();
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
        setIsOpen(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md hidden md:block">
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          placeholder="Search laptops, desktops, printers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          className="w-full bg-muted border border-border text-foreground text-sm px-4 py-2 pl-10 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        {query && (
          <button type="button" onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border shadow-xl rounded-xl z-[999] max-h-96 overflow-y-auto">
          <div className="px-4 py-2.5 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Results</span>
          </div>
          {results.map((product) => (
            <Link 
              href={`/products/${product.slug}`} 
              key={product._id}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 border-b border-border last:border-0 transition-colors"
            >
              <div className="w-12 h-12 bg-white shrink-0 border border-border rounded-lg flex items-center justify-center overflow-hidden">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-1 mix-blend-multiply" />
                ) : (
                  <Package className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground truncate">{product.sku} • {product.brand}</p>
              </div>
              <div className="text-sm font-semibold text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </Link>
          ))}
          <Link 
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={() => setIsOpen(false)}
            className="block w-full text-center p-3 text-xs font-semibold text-primary hover:bg-muted/50 transition-colors border-t border-border rounded-b-xl"
          >
            VIEW ALL RESULTS →
          </Link>
        </div>
      )}
    </div>
  );
}
