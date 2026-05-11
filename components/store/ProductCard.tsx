"use strict";
"use client";

import { useCartStore } from "@/lib/cart-store";
import { motion } from "framer-motion";
import { useState } from "react";
import { ShoppingBag, Heart, Star, Eye } from "lucide-react";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  mrp?: number;
  image?: string;
  sku: string;
  brand: string;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  highlights?: string[];
  specs?: any;
}

export function ProductCard(product: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const {
    _id, name, price, mrp, image = "", sku, brand,
    stock = 0, rating = 0, reviewCount = 0, discount = 0
  } = product;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stock <= 0) return;
    
    setIsAdding(true);
    addItem({ id: _id, name, price, image, sku, quantity: 1 });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // In a real app, sync this to localStorage or API
  };

  const openQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  const formattedMrp = mrp ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(mrp) : '';

  return (
    <>
      <motion.div
        className={`group relative bg-[#111] border border-[#222] rounded-xl overflow-hidden flex flex-col ${stock <= 0 ? 'opacity-60' : ''}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{ 
          y: isHovered && stock > 0 ? -5 : 0,
          borderColor: isHovered && stock > 0 ? "#6C63FF" : "#222",
          boxShadow: isHovered && stock > 0 ? "0 10px 30px -10px rgba(108, 99, 255, 0.3)" : "none"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#0A0A0F]/80 backdrop-blur border border-[#333] hover:border-[#6C63FF] transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#6C63FF] text-[#6C63FF]' : 'text-[#888]'}`} />
        </button>

        {/* Quick View Button (Desktop Hover) */}
        {isHovered && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={openQuickView}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#F5F0EB] text-[#0A0A0F] font-bold text-xs tracking-widest px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#6C63FF] hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" /> QUICK VIEW
          </motion.button>
        )}

        {/* Image Area */}
        <div className="relative aspect-[4/5] bg-[#0A0A0F] p-8 overflow-hidden cursor-pointer" onClick={openQuickView}>
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[#111] animate-pulse" />
          )}
        </div>
        
        {/* Content Area */}
        <div className="p-5 flex-1 flex flex-col justify-between border-t border-[#222] bg-[#0A0A0F]">
          <div>
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-mono text-[#6C63FF] uppercase tracking-wider">{brand}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="text-xs font-mono text-[#888]">{rating} ({reviewCount})</span>
              </div>
            </div>
            
            <h3 className="text-[#F5F0EB] font-medium text-base leading-snug mb-2 line-clamp-2" title={name}>
              {name}
            </h3>

            {/* Spec summary line (mocked if empty) */}
            <p className="text-xs text-[#888] mb-3 truncate">
              {product.highlights?.[0] || sku} • {product.highlights?.[1] || "Premium Build"}
            </p>

            <div className="flex items-end gap-2 mb-2">
              <span className="font-mono text-xl font-bold text-[#F5F0EB]">{formattedPrice}</span>
              {mrp && mrp > price && (
                <span className="font-mono text-xs text-[#666] line-through mb-1">{formattedMrp}</span>
              )}
            </div>

            {/* Stock Indicator */}
            <div className="mb-4">
              {stock > 10 ? (
                <span className="text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">IN STOCK</span>
              ) : stock > 0 ? (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-1 rounded">ONLY {stock} LEFT</span>
              ) : (
                <span className="text-[10px] font-mono text-red-400 bg-red-400/10 px-2 py-1 rounded">OUT OF STOCK</span>
              )}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className={`w-full flex items-center justify-center gap-2 py-3 border rounded transition-all relative overflow-hidden group/btn ${
              stock > 0 
                ? "border-[#333] hover:border-[#6C63FF] hover:bg-[#6C63FF]/10 text-[#F5F0EB] cursor-pointer" 
                : "border-[#222] bg-[#111] text-[#666] cursor-not-allowed"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm tracking-wide uppercase font-bold">
              {stock > 0 ? "Add to Cart" : "Out of Stock"}
            </span>
            
            {isAdding && (
              <motion.div 
                className="absolute inset-0 bg-[#6C63FF]"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </button>
        </div>
      </motion.div>

      {/* Render Quick View Modal outside the card hierarchy if open */}
      <QuickViewModal 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
        product={product as any} 
      />
    </>
  );
}
