import { create } from "zustand";
import { persist } from "zustand/middleware";

// ZUSTAND (intro): a store is just an object with state + functions that
// change it. Any component can read from it with useCartStore(...),
// no provider needed. `persist` saves the cart in localStorage for us.
export const useCartStore = create(
  persist(
    (set) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }

          const newItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: 1,
          };
          return { items: [...state.items, newItem] };
        }),

      // amount is +1 or -1, an item that reaches 0 is removed
      changeQuantity: (id, amount) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, quantity: item.quantity + amount } : item))
            .filter((item) => item.quantity > 0),
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "nebula-cart" }
  )
);

// small helper functions to work out totals from the items list
export function getTotalItems(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getTotalPrice(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
