'use client';

import { createContext, useContext, useEffect, useMemo, useState, useRef, ReactNode, useCallback } from 'react';
import { authApi, getErrorMessage } from '@/lib/api';
import { AxiosError } from 'axios';

export type Product = {
  id: string;
  name: string;
  price: number;
  weight: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  tag?: string;
};

export type CartItem = Product & {
  cartItemId: string;
  quantity: number;
  selectedWeight: string;
};

export type AuthUser = {
  id?: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
};

type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; message: string };

type NavOptions = { orderId?: string; product?: Product };

type AppContextType = {
  currentPage: string;
  setCurrentPage: (page: string, opts?: NavOptions) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, weight: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  /** Used when restoring from history - product page can fetch by this id */
  selectedProductId: string | null;

  favourites: Product[];
  addToFavourites: (product: Product) => void;
  removeFromFavourites: (productId: string) => void;
  isFavourite: (productId: string) => boolean;

  user: AuthUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;

  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  hasNewOrder: boolean;
  setHasNewOrder: (value: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const TOKEN_KEY = 'rdg_token';
const USER_KEY = 'rdg_user';

function safeParseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

type HistoryState = { page: string; orderId?: string; productId?: string };

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPageState] = useState('home');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favourites, setFavourites] = useState<Product[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const favouritesRef = useRef<Product[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isAuthenticated = !!user;

  // Sync navigation with browser history so back button works within the app
  const setCurrentPage = useCallback(
    (page: string, opts?: NavOptions) => {
      const orderId = opts?.orderId ?? (page === 'order-detail' ? selectedOrderId : null);
      const product = opts?.product;
      const productId = product?.id;

      if (orderId) setSelectedOrderId(orderId);
      else if (page !== 'order-detail') setSelectedOrderId(null);

      if (product) {
        setSelectedProduct(product);
        setSelectedProductId(productId ?? null);
      } else if (page !== 'product') {
        setSelectedProduct(null);
        setSelectedProductId(null);
      }

      setCurrentPageState(page);

      const state: HistoryState = { page, orderId: orderId ?? undefined, productId };
      if (typeof window !== 'undefined') {
        window.history.pushState(state, '', window.location.href);
      }
    },
    [selectedOrderId]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Replace initial history entry so back has something to pop to
    window.history.replaceState({ page: 'home' }, '', window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      const state = e.state as HistoryState | null;
      if (state?.page) {
        setCurrentPageState(state.page);
        setSelectedOrderId(state.orderId ?? null);
        setSelectedProductId(state.productId ?? null);
        if (state.productId) {
          const fromFav = favouritesRef.current.find((p) => p.id === state!.productId);
          setSelectedProduct(fromFav ?? null);
        } else {
          setSelectedProduct(null);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount

  const addToFavourites = (product: Product) => {
    setFavourites((prev) =>
      prev.some((p) => p.id === product.id) ? prev : [...prev, product]
    );
  };

  const removeFromFavourites = (productId: string) => {
    setFavourites((prev) => prev.filter((p) => p.id !== productId));
  };

  const isFavourite = (productId: string) =>
    favourites.some((p) => p.id === productId);

  // Restore session from token on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setAuthLoading(false);
      return;
    }

    authApi
      .getMe()
      .then((res) => {
        const payload = res.data;
        if (payload?.success && payload?.data) {
          const u = payload.data;
          const id = (u as { _id?: string; id?: string })?._id ?? (u as { id?: string })?.id;
          const authUser: AuthUser = { ...u, id };
          setUser(authUser);
          localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        } else {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const login = useMemo(
    () =>
      async (email: string, password: string): Promise<AuthResult> => {
        try {
          const res = await authApi.login(email, password);
          const payload = res.data;
          if (!payload?.success || !payload?.data) {
            setUser(null);
            if (typeof window !== 'undefined') {
              // Redirect to home page after sign out
              window.location.href = '/';
            }
          }
          const { token, user: u } = payload.data;
          if (!token || !u) {
            return { ok: false, message: 'Invalid response from server' };
          }
          const id = (u as { id?: string; _id?: string })?.id || (u as { id?: string; _id?: string })?._id || '';
          const authUser: AuthUser = { ...u, id };
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(authUser));
          setUser(authUser);
          return { ok: true, user: authUser };
        } catch (err) {
          const msg = err instanceof AxiosError ? getErrorMessage(err) : 'Login failed';
          return { ok: false, message: msg };
        }
      },
    []
  );

  const signup = useMemo(
    () =>
      async (name: string, email: string, password: string): Promise<AuthResult> => {
        try {
          const res = await authApi.register(name, email, password);
          const payload = res.data;
          if (!payload?.success || !payload?.data) {
            return { ok: false, message: payload?.message ?? 'Registration failed' };
          }
          const { token, user: u } = payload.data;
          if (!token || !u) {
            return { ok: false, message: 'Invalid response from server' };
          }
          const id = (u as { id?: string; _id?: string })?.id || (u as { id?: string; _id?: string })?._id || '';
          const authUser: AuthUser = { ...u, id };
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(authUser));
          setUser(authUser);
          return { ok: true, user: authUser };
        } catch (err) {
          const msg = err instanceof AxiosError ? getErrorMessage(err) : 'Registration failed';
          return { ok: false, message: msg };
        }
      },
    []
  );

  const logout = useMemo(
    () =>
      (): void => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
        setUser(null);
      },
    []
  );

  const updateUser = useCallback((userData: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const addToCart = (product: Product, quantity: number, weight: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.selectedWeight === weight
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.selectedWeight === weight
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          cartItemId: `${product.id}-${weight}-${Date.now()}`,
          quantity,
          selectedWeight: weight,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedOrderId,
        setSelectedOrderId,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        selectedProduct,
        setSelectedProduct,
        selectedProductId,

        favourites,
        addToFavourites,
        removeFromFavourites,
        isFavourite,

        user,
        isAuthenticated,
        authLoading,
        login,
        signup,
        logout,
        updateUser,
        isAuthOpen,
        setIsAuthOpen,
        authMode,
        setAuthMode,
        hasNewOrder,
        setHasNewOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );

// keep ref updated
useEffect(() => {
  favouritesRef.current = favourites;
}, [favourites]);

useEffect(() => {
  if (typeof window === 'undefined') return;

  window.history.replaceState({ page: 'home' }, '', window.location.href);

  const handlePopState = (e: PopStateEvent) => {
    const state = e.state as HistoryState | null;
    if (!state?.page) return;

    setCurrentPageState(state.page);
    setSelectedOrderId(state.orderId ?? null);
    setSelectedProductId(state.productId ?? null);

    if (state.productId) {
      const fromFav = favouritesRef.current.find(
        (p) => p.id === state.productId
      );
      setSelectedProduct(fromFav || null);
    } else {
      setSelectedProduct(null);
    }
  };

  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, []);
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
