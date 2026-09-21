import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  total: number;
  isCartOpen: boolean;
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CART_STORAGE_KEY = 'nova_shopping_cart_v1';
const FREE_SHIPPING_THRESHOLD = 3000;
const STANDARD_SHIPPING_FEE = 250;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { success, info } = useToast();

  // Synchronize cart changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('[CART] Failed to save cart to localStorage', e);
    }
  }, [items]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const addToCart = useCallback(
    (product: Product, quantity: number = 1): boolean => {
      if (product.stock <= 0 || product.status === 'OUT_OF_STOCK') {
        info('This product is currently out of stock.', 'Out of Stock');
        return false;
      }

      let added = false;

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);

        if (existingIndex > -1) {
          const existingItem = prevItems[existingIndex];
          const newQty = existingItem.quantity + quantity;

          if (newQty > product.stock) {
            info(
              `Maximum stock available (${product.stock}) reached for ${product.name}.`,
              'Stock Limit'
            );
            const updated = [...prevItems];
            updated[existingIndex] = { ...existingItem, quantity: product.stock };
            added = true;
            return updated;
          }

          const updated = [...prevItems];
          updated[existingIndex] = { ...existingItem, quantity: newQty };
          added = true;
          return updated;
        } else {
          const initialQty = Math.min(quantity, product.stock);
          added = true;
          return [...prevItems, { product, quantity: initialQty }];
        }
      });

      success(`Added ${product.name} to your bag.`, 'Added to Bag');
      setIsCartOpen(true);
      return added;
    },
    [info, success]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const item = prev.find((i) => i.product.id === productId);
        if (item) {
          info(`Removed ${item.product.name} from your bag.`, 'Item Removed');
        }
        return prev.filter((i) => i.product.id !== productId);
      });
    },
    [info]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setItems((prev) =>
        prev.map((item) => {
          if (item.product.id === productId) {
            const clamped = Math.min(quantity, item.product.stock);
            if (clamped < quantity) {
              info(
                `Only ${item.product.stock} units available in stock.`,
                'Stock Limit Reached'
              );
            }
            return { ...item, quantity: clamped };
          }
          return item;
        })
      );
    },
    [removeFromCart, info]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        total,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
