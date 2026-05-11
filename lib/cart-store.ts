import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
  sku: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variant?: string) => void;
  updateQuantity: (id: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id && item.variant === newItem.variant
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems, isOpen: true }; // Open cart optimistically
          }

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (id, variant) => {
        set((state) => ({
          items: state.items.filter((item) => !(item.id === id && item.variant === variant)),
        }));
      },

      updateQuantity: (id, quantity, variant) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id && item.variant === variant) {
              return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "obsidian_cart", // key in localStorage
    }
  )
);
