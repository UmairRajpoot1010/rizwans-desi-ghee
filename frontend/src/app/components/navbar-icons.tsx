import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, ShoppingCart, User } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { AuthPanel } from '@/app/components/auth-panel';

type Props = {
  onNavigate: (page: string) => void;
};

function useOnClickOutside(
  refs: Array<React.RefObject<HTMLElement>>,
  handler: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      const clickedInside = refs.some((r) => r.current?.contains(target));
      if (!clickedInside) handler();
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [enabled, handler, refs]);
}

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold leading-none text-white">
      {count}
    </span>
  );
}

export function NavbarIcons({ onNavigate }: Props) {
  const { cart, favourites, isAuthenticated, user, logout } = useApp();

  const cartItemCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [cartOpen, setCartOpen] = useState(false);

  const userButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const cartPanelRef = useRef<HTMLDivElement>(null);

  // Close popovers on outside click.
  useOnClickOutside(
    [cartButtonRef, cartPanelRef],
    () => setCartOpen(false),
    cartOpen
  );

  // Close user menu when clicking outside
  useOnClickOutside([userButtonRef, userMenuRef], () => setUserMenuOpen(false), userMenuOpen);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // ESC closes any open overlay/popup.
      setAuthOpen(false);
      setCartOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    // Ensure only one overlay is open at a time for clean UX.
    if (authOpen) {
      setCartOpen(false);
    }
  }, [authOpen]);
  useEffect(() => {
    if (cartOpen) {
      setAuthOpen(false);
    }
  }, [cartOpen]);

  return (
    <div className="relative hidden md:flex items-center gap-4">
      {/* User menu */}
      <div className="relative">
        <button
          ref={userButtonRef}
          type="button"
          aria-label={isAuthenticated ? `Account (${user?.name ?? 'User'})` : 'Login / Sign up'}
          aria-haspopup="menu"
          aria-expanded={userMenuOpen}
          onClick={() => {
            if (isAuthenticated) {
              setUserMenuOpen((v) => !v);
              return;
            }
            setAuthMode('login');
            setAuthOpen(true);
          }}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition-transform duration-200 hover:scale-105 hover:text-[#F4B400]"
        >
          {isAuthenticated ? (
            <div className="h-5 w-5 rounded-full bg-[#5F6B3C] flex items-center justify-center text-white text-xs font-semibold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          ) : (
            <User className="h-5 w-5" />
          )}
        </button>

        {/* User dropdown for authenticated users */}
        <div
          ref={userMenuRef}
          className={[
            'absolute right-0 top-[calc(100%+8px)] w-44 rounded-lg border border-neutral-200 bg-white shadow-lg',
            'origin-top-right transition-all duration-150',
            userMenuOpen ? 'pointer-events-auto scale-100 opacity-100 translate-y-0' : 'pointer-events-none scale-95 opacity-0 -translate-y-1',
          ].join(' ')}
        >
          <div className="p-2">
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen(false);
                // navigate to profile
                // `onNavigate` prop comes from Header
                onNavigate('profile');
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50"
            >
              Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen(false);
                logout();
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-neutral-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Slide-in Auth panel (Login/Signup) */}
      <AuthPanel
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onModeChange={setAuthMode}
      />

      {/* Wishlist / Favourites */}
      <button
        type="button"
        aria-label="Favourites"
        onClick={() => onNavigate('favourites')}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition-transform duration-200 hover:scale-105 hover:text-[#F4B400]"
      >
        <Heart className="h-5 w-5" />
        <Badge count={favourites.length} />
      </button>

      {/* Cart */}
      <button
        ref={cartButtonRef}
        type="button"
        aria-label="Cart"
        aria-haspopup="dialog"
        aria-expanded={cartOpen}
        onClick={() => setCartOpen((v) => !v)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition-transform duration-200 hover:scale-105 hover:text-[#F4B400]"
      >
        <ShoppingCart className="h-5 w-5" />
        <Badge count={cartItemCount} />
      </button>

      {/* Cart drawer (slide-in) */}
      <div
        className={[
          'fixed inset-0 z-50',
          cartOpen ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
        aria-hidden={!cartOpen}
      >
        {/* Overlay */}
        <button
          type="button"
          aria-label="Close cart"
          onClick={() => setCartOpen(false)}
          className={[
            'absolute inset-0 bg-black/40 transition-opacity duration-200',
            cartOpen ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          tabIndex={cartOpen ? 0 : -1}
        />

        {/* Panel */}
        <aside
          ref={cartPanelRef}
          role="dialog"
          aria-label="Cart sidebar"
          className={[
            'cart-panel absolute right-0 top-0 h-full w-[360px] max-w-[90vw] bg-white shadow-2xl',
            'transition-transform duration-200',
            cartOpen ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
              <div className="text-sm font-semibold text-neutral-900">
                Cart ({cartItemCount})
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-md px-2 py-1 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {cart.length === 0 ? (
                <div className="text-sm text-neutral-600">Your cart is empty.</div>
              ) : (
                <ul className="space-y-3">
                  {cart.slice(0, 5).map((item) => (
                    <li
                      key={`${item.id}-${item.selectedWeight}`}
                      className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200 p-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-neutral-900">
                          {item.name}
                        </div>
                        <div className="mt-0.5 text-xs text-neutral-600">
                          {item.selectedWeight} • Qty {item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-neutral-900">
                        Rs {item.price}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-neutral-200 p-4">
              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  onNavigate('cart');
                }}
                className="cart-primary-button w-full px-4 py-2.5 text-sm font-semibold"
              >
                Go to cart
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

