"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useState } from "react";
import Link from "next/link";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    _id: string;
    name: string;
    price: number;
    mrp?: number;
    image?: string;
    images?: string[];
    sku: string;
    slug?: string;
    brand: string;
    stock?: number;
    description?: string;
    highlights?: string[];
  };
}

export function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (product.stock && product.stock <= 0) return;
    addItem({ 
      id: product._id, 
      name: product.name, 
      price: product.price, 
      image: product.image || product.images?.[0] || "", 
      sku: product.sku, 
      quantity: 1 
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price);
  const formattedMrp = product.mrp ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.mrp) : '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-muted hover:bg-muted-foreground/20 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-border">
            <img 
              src={product.image || product.images?.[0]} 
              alt={product.name} 
              className="max-w-full max-h-[400px] object-contain mix-blend-multiply"
            />
          </div>

          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{product.brand}</span>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">{product.name}</h2>
            <p className="text-sm font-medium text-muted-foreground mb-6">SKU: {product.sku}</p>

            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-border">
              <span className="text-3xl font-heading font-bold text-foreground">{formattedPrice}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-lg font-medium text-muted-foreground line-through mb-1">{formattedMrp}</span>
              )}
            </div>

            <div className="space-y-2 mb-8">
              {(product.highlights || ["Premium Quality", "Advanced Technology", "1 Year Warranty"]).slice(0,3).map((hl, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {hl}
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={(product.stock !== undefined && product.stock <= 0) || isAdded}
                className="flex-1 bg-primary text-primary-foreground font-semibold py-4 rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                {isAdded ? "ADDED TO CART" : "ADD TO CART"}
              </button>
              <Link href={`/products/${product.slug || product.sku}`} className="flex-1 border border-border text-foreground font-semibold py-4 rounded-lg hover:border-primary hover:text-primary transition-all flex items-center justify-center text-center">
                FULL DETAILS
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
