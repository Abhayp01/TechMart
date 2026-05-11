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
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0A0F] border-l border-[#333] shadow-2xl z-[9999] flex flex-col"
          >
            <div className="p-6 border-b border-[#333] flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold text-[#F5F0EB] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Cart ({items.length})
              </h2>
              <button onClick={closeCart} className="text-[#888] hover:text-[#F5F0EB] transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#888]">
                  <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-mono text-sm uppercase">Your cart is empty</p>
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
                    <div className="w-24 h-24 bg-[#111] rounded-lg overflow-hidden shrink-0 border border-[#222]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-[#F5F0EB] font-medium leading-tight">{item.name}</h3>
                          <button onClick={() => removeItem(item.id, item.variant)} className="text-[#666] hover:text-[#EF4444]">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {item.variant && <p className="text-xs text-[#888] mt-1">Variant: {item.variant}</p>}
                        <p className="text-xs font-mono text-[#6C63FF] mt-1">{item.sku}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#333] rounded">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                            className="p-1 text-[#888] hover:text-[#F5F0EB]"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-mono text-[#F5F0EB]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                            className="p-1 text-[#888] hover:text-[#F5F0EB]"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[#F5F0EB] font-mono">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-[#333] bg-[#0d0d14]">
                <div className="flex justify-between items-center mb-4 text-[#F5F0EB]">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-mono text-xl">${getSubtotal().toFixed(2)}</span>
                </div>
                <p className="text-xs text-[#888] mb-6 font-mono">Shipping & taxes calculated at checkout.</p>
                <Link href="/checkout" onClick={closeCart}>
                  <button className="w-full bg-[#F5F0EB] text-[#0A0A0F] font-bold py-4 rounded hover:bg-[#6C63FF] hover:text-white transition-all tracking-wider text-sm">
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
