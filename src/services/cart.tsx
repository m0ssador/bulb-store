import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CartContext } from "./cartContext";
import type { CartContextValue, CartItem } from "./cartContext";

const STORAGE_KEY = "bulb-store-cart";

function readCart() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return {
      items,
      totalCount,
      totalPrice,
      addItem(product) {
        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id);

          if (existing) {
            return current.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }

          return [...current, { product, quantity: 1 }];
        });
      },
      removeItem(productId) {
        setItems((current) => current.filter((item) => item.product.id !== productId));
      },
      updateQuantity(productId, quantity) {
        if (quantity < 1) {
          setItems((current) => current.filter((item) => item.product.id !== productId));
          return;
        }

        setItems((current) =>
          current.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          ),
        );
      },
      clearCart() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
