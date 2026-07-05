"use client";

import { useCartStore } from "@/lib/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border shadow-2xl z-[9999] flex flex-col"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Cart ({items.length})
              </h2>
              <button onClick={closeCart} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium text-sm uppercase">Your cart is empty</p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${item.variant}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-24 h-24 bg-white rounded-lg overflow-hidden shrink-0 border border-border">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-foreground font-semibold leading-tight">{item.name}</h3>
                          <button onClick={() => removeItem(item.id, item.variant)} className="text-muted-foreground hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {item.variant && <p className="text-xs text-muted-foreground mt-1">Variant: {item.variant}</p>}
                        <p className="text-xs font-medium text-primary mt-1">{item.sku}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded-md bg-muted/50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                            className="p-1.5 text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                            className="p-1.5 text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-foreground font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border bg-muted/20">
                <div className="flex justify-between items-center mb-4 text-foreground">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span className="font-heading font-bold text-xl">${getSubtotal().toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">Shipping & taxes calculated at checkout.</p>
                <Link href="/checkout" onClick={closeCart}>
                  <button className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-lg hover:bg-primary/90 transition-all shadow-sm">
                    PROCEED TO CHECKOUT
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
