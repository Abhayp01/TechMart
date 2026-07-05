"use client";

import { useCartStore } from "@/lib/cart-store";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    sku: string;
    stock: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    if (product.stock <= 0) return;
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, sku: product.sku, quantity: 1 });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock <= 0 || isAdded}
      className={`w-full font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-base shadow-sm ${
        isAdded
          ? "bg-emerald-500 text-white"
          : product.stock > 0
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
      }`}
    >
      {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
      {isAdded ? "Added to Cart!" : product.stock > 0 ? "Add to Cart" : "Out of Stock"}
    </button>
  );
}
