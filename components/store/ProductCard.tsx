"use client";

import { useCartStore } from "@/lib/cart-store";
import { motion } from "framer-motion";
import { useState } from "react";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  mrp?: number;
  image?: string;
  sku: string;
  slug?: string;
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
    setTimeout(() => setIsAdding(false), 800);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  const formattedMrp = mrp ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(mrp) : '';

  return (
    <>
      <motion.div
        className={`group relative bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-sm ${stock <= 0 ? 'opacity-60' : ''}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          y: isHovered && stock > 0 ? -3 : 0,
          boxShadow: isHovered && stock > 0
            ? "0 12px 24px -4px rgb(0 0 0 / 0.12)"
            : "0 1px 3px 0 rgb(0 0 0 / 0.06)"
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 border border-border hover:border-primary transition-colors shadow-sm"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </button>

        {/* Image — square, compact */}
        <div
          className="relative aspect-square bg-white p-4 overflow-hidden cursor-pointer"
          onClick={() => setIsQuickViewOpen(true)}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-multiply"
            />
          ) : (
            <div className="w-full h-full bg-muted animate-pulse rounded" />
          )}
        </div>

        {/* Content — tight, ecommerce-style */}
        <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1 border-t border-border">
          {/* Brand + Rating row */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{brand}</span>
            {rating > 0 && (
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] font-medium text-muted-foreground">{rating} ({reviewCount})</span>
              </div>
            )}
          </div>

          {/* Product name — 2 lines max */}
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2" title={name}>
            {name}
          </h3>

          {/* Price row */}
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-bold text-foreground">{formattedPrice}</span>
            {mrp && mrp > price && (
              <span className="text-xs text-muted-foreground line-through">{formattedMrp}</span>
            )}
          </div>

          {/* Stock + Add to Cart */}
          <div className="flex items-center gap-2 mt-1.5">
            {/* Stock pill */}
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
              stock > 10 ? 'bg-emerald-100 text-emerald-700'
              : stock > 0 ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-600'
            }`}>
              {stock > 10 ? 'IN STOCK' : stock > 0 ? `${stock} LEFT` : 'SOLD OUT'}
            </span>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={stock <= 0 || isAdding}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative overflow-hidden ${
                isAdding
                  ? 'bg-emerald-500 text-white'
                  : stock > 0
                    ? 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              {isAdding ? 'Added!' : 'Add to Cart'}
              {isAdding && (
                <motion.div
                  className="absolute inset-0 bg-emerald-400/30"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={product as any}
      />
    </>
  );
}
