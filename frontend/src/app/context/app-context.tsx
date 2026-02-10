'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Product = {
  id: number;
  name: string;
  weight: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  tag?: string;
};

export type CartItem = Product & {
  quantity: number;
  selectedWeight: string;
};

type AppContextType = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, weight: string) => void;
  removeFromCart: (id: number, weight: string) => void;
  updateQuantity: (id: number, weight: string, quantity: number) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const addToCart = (product: Product, quantity: number, weight: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && item.selectedWeight === weight
      );
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.selectedWeight === weight
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity, selectedWeight: weight }];
    });
  };

  const removeFromCart = (id: number, weight: string) => {
    setCart(prevCart => prevCart.filter(
      item => !(item.id === id && item.selectedWeight === weight)
    ));
  };

  const updateQuantity = (id: number, weight: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id, weight);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.selectedWeight === weight
          ? { ...item, quantity }
          : item
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
