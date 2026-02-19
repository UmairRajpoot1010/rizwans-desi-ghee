'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

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

export type AuthUser = {
  name: string;
  email: string;
};

type StoredUser = {
  name: string;
  email: string;
  // Placeholder only. Replace with backend auth (hashed passwords) later.
  password: string;
};

type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; message: string };

type AppContextType = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, weight: string) => void;
  removeFromCart: (id: number, weight: string) => void;
  updateQuantity: (id: number, weight: string, quantity: number) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  favourites: Product[];
  addToFavourites: (product: Product) => void;
  removeFromFavourites: (productId: number) => void;
  isFavourite: (productId: number) => boolean;

  // Auth (local placeholder, easy to replace with backend later)
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  users: 'rdg_users_v1',
  session: 'rdg_session_v1',
} as const;

function safeParseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favourites, setFavourites] = useState<Product[]>([]);

  // Auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const isAuthenticated = !!user;

  const addToFavourites = (product: Product) => {
    setFavourites((prev) =>
      prev.some((p) => p.id === product.id) ? prev : [...prev, product]
    );
  };

  const removeFromFavourites = (productId: number) => {
    setFavourites((prev) => prev.filter((p) => p.id !== productId));
  };

  const isFavourite = (productId: number) =>
    favourites.some((p) => p.id === productId);

  // Load session on mount (keeps user logged in after refresh).
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sessionEmail = safeParseJSON<string | null>(
      window.localStorage.getItem(STORAGE_KEYS.session),
      null
    );
    if (!sessionEmail) return;

    const users = safeParseJSON<StoredUser[]>(
      window.localStorage.getItem(STORAGE_KEYS.users),
      []
    );
    const found = users.find((u) => u.email.toLowerCase() === sessionEmail.toLowerCase());
    if (found) setUser({ name: found.name, email: found.email });
  }, []);

  const authApi = useMemo(() => {
    const readUsers = (): StoredUser[] => {
      if (typeof window === 'undefined') return [];
      return safeParseJSON<StoredUser[]>(
        window.localStorage.getItem(STORAGE_KEYS.users),
        []
      );
    };

    const writeUsers = (users: StoredUser[]) => {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    };

    const setSession = (email: string | null) => {
      if (typeof window === 'undefined') return;
      if (!email) {
        window.localStorage.removeItem(STORAGE_KEYS.session);
        return;
      }
      window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(email));
    };

    return {
      login: async (email: string, password: string): Promise<AuthResult> => {
        const users = readUsers();
        const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!found || found.password !== password) {
          return { ok: false, message: 'Invalid email or password.' };
        }
        setUser({ name: found.name, email: found.email });
        setSession(found.email);
        return { ok: true, user: { name: found.name, email: found.email } };
      },
      signup: async (name: string, email: string, password: string): Promise<AuthResult> => {
        const users = readUsers();
        const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          return { ok: false, message: 'An account with this email already exists.' };
        }
        const next: StoredUser = { name, email, password };
        writeUsers([...users, next]);
        setUser({ name, email });
        setSession(email);
        return { ok: true, user: { name, email } };
      },
      logout: () => {
        setUser(null);
        setSession(null);
      },
    };
  }, []);

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

        favourites,
        addToFavourites,
        removeFromFavourites,
        isFavourite,

        user,
        isAuthenticated,
        login: authApi.login,
        signup: authApi.signup,
        logout: authApi.logout,
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
