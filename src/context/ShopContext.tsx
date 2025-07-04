
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  _id?: string;
  name: string;
  image: string;
  price: number;
  discount?: number;
  description?: string;
  reviews: {
    userId: string;
    rating: number;
    comment?: string;
    createdAt?: string;
  }[];
}

interface CartItem extends Product {
  quantity: number;
}

interface ShopContextType {
  cartItems: CartItem[];
  favorites: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: number) => void;
  getCartQuantity: () => number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const addToFavorites = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (!exists) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromFavorites = (productId: number) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
  };

  const getCartQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <ShopContext.Provider value={{
      cartItems,
      favorites,
      addToCart,
      removeFromCart,
      clearCart,
      addToFavorites,
      removeFromFavorites,
      getCartQuantity
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
