"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Hexagon } from "lucide-react";
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
          placeholder="SEARCH DATABASE..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          className="w-full bg-[#111] border border-[#333] text-[#F5F0EB] font-mono text-sm px-4 py-2 pl-10 focus:outline-none focus:border-[#6C63FF] transition-all group-hover:border-[#444]"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
        {query && (
          <button type="button" onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0F] border border-[#333] shadow-2xl z-[999] max-h-96 overflow-y-auto">
          <div className="p-2 border-b border-[#222] bg-[#111]">
            <span className="text-xs font-mono text-[#666] uppercase">Top Results</span>
          </div>
          {results.map((product) => (
            <Link 
              href={`/products/${product.slug}`} 
              key={product._id}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 p-4 hover:bg-[#111] border-b border-[#222] last:border-0 transition-colors"
            >
              <div className="w-12 h-12 bg-[#1a1a24] shrink-0 border border-[#333] flex items-center justify-center">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <Hexagon className="w-6 h-6 text-[#333]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#F5F0EB] truncate">{product.name}</p>
                <p className="text-xs text-[#888] font-mono truncate">{product.sku} • {product.brand}</p>
              </div>
              <div className="text-sm font-mono text-[#6C63FF]">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            </Link>
          ))}
          <Link 
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={() => setIsOpen(false)}
            className="block w-full text-center p-3 text-xs font-mono text-[#6C63FF] hover:text-white hover:bg-[#111] transition-colors border-t border-[#333]"
          >
            VIEW ALL RESULTS →
          </Link>
        </div>
      )}
    </div>
  );
}
