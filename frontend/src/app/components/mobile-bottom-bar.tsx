import { Home, ShoppingBag, ShoppingCart, User, MessageCircle } from 'lucide-react';
import { useApp } from '@/app/context/app-context';

export function MobileBottomBar() {
  const { setCurrentPage, currentPage, cart, isAuthenticated, setIsAuthOpen, setAuthMode } = useApp();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleWhatsApp = () => {
    window.open('https://wa.me/923287318269', '_blank');
  };

  const isActive = (page: string) => currentPage === page;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-all md:hidden animate-bounce"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E6B65C]/20 shadow-2xl md:hidden safe-area-inset-bottom">
        <div className="grid grid-cols-4 gap-0 p-2">
          {/* Home */}
          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo(0, 0);
            }}
            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-colors ${isActive('home')
              ? 'bg-[#E6B65C]/10'
              : 'hover:bg-[#FAF7F2]'
              }`}
            aria-label="Home"
            aria-current={isActive('home') ? 'page' : undefined}
          >
            <Home className={`w-6 h-6 ${isActive('home') ? 'text-[#5F6B3C]' : 'text-[#6B4A1E]'}`} />
            <span className={`text-xs font-medium ${isActive('home') ? 'text-[#5F6B3C]' : 'text-[#6B4A1E]'
              }`}>
              Home
            </span>
          </button>

          {/* Shop */}
          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo(0, 0);
            }}
            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-colors ${isActive('shop')
              ? 'bg-[#E6B65C]/10'
              : 'hover:bg-[#FAF7F2]'
              }`}
            aria-label="Shop"
            aria-current={isActive('shop') ? 'page' : undefined}
          >
            <ShoppingBag className={`w-6 h-6 ${isActive('shop') ? 'text-[#5F6B3C]' : 'text-[#6B4A1E]'}`} />
            <span className={`text-xs font-medium ${isActive('shop') ? 'text-[#5F6B3C]' : 'text-[#6B4A1E]'
              }`}>
              Shop
            </span>
          </button>

          {/* Cart */}
          <button
            onClick={() => {
              setCurrentPage('cart');
              window.scrollTo(0, 0);
            }}
            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-colors relative ${isActive('cart')
              ? 'bg-[#E6B65C]/10'
              : 'hover:bg-[#FAF7F2]'
              }`}
            aria-label={`Cart${cartItemCount > 0 ? ` (${cartItemCount} items)` : ''}`}
            aria-current={isActive('cart') ? 'page' : undefined}
          >
            <div className="relative">
              <ShoppingCart className={`w-6 h-6 ${isActive('cart') ? 'text-[#5F6B3C]' : 'text-[#6B4A1E]'}`} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-semibold leading-none">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className={`text-xs font-medium ${isActive('cart') ? 'text-[#5F6B3C]' : 'text-[#6B4A1E]'
              }`}>
              Cart
            </span>
          </button>

          {/* Account/Profile */}
          <button
            onClick={() => {
              if (isAuthenticated) {
                setCurrentPage('profile');
              } else {
                setAuthMode('login');
                setIsAuthOpen(true);
              }
              window.scrollTo(0, 0);
            }}
            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-colors ${isActive('profile')
              ? 'bg-[#E6B65C]/10'
              : 'hover:bg-[#FAF7F2]'
              }`}
            aria-label={isAuthenticated ? 'Profile' : 'Account'}
            aria-current={isActive('profile') ? 'page' : undefined}
          >
            <User className={`w-6 h-6 ${isActive('profile') ? 'text-[#5F6B3C]' : 'text-[#6B4A1E]'}`} />
            <span className={`text-xs font-medium ${isActive('profile') ? 'text-[#5F6B3C]' : 'text-[#6B4A1E]'
              }`}>
              {isAuthenticated ? 'Profile' : 'Account'}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom spacing for mobile (accounts for fixed bottom bar) */}
      <div className="h-20 md:hidden" />
    </>
  );
}
