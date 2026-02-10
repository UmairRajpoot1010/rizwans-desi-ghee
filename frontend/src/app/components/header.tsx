import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Menu, X } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import logo from '@/assets/logo.png';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPage, setCurrentPage, cart } = useApp();

  const cartItemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const navigate = (page: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 h-20">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo + Brand */}
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <Image
            src={logo}
            alt="Rizwan's Desi Ghee logo"
            priority
            width={160}
            height={160}
            sizes="(max-width: 768px) 140px, 180px"
            className="h-10 w-auto md:h-12 object-contain drop-shadow-md origin-left transition-transform duration-300 group-hover:scale-105"
          />
          <span className="flex items-center gap-1 text-xl md:text-2xl font-semibold tracking-tight text-[#E6B65C] font-heading">
            Rizwan&apos;s Desi Ghee
            <ArrowRight
              className="w-4 h-4 text-[#E6B65C] opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
            />
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`relative pb-1 text-sm md:text-base font-medium transition-colors duration-200 border-b-2 ${
                currentPage === item.page
                  ? 'text-[#E6B65C] border-[#E6B65C]'
                  : 'text-[#6B4A1E] border-transparent hover:text-[#E6B65C] hover:border-[#E6B65C]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Cart Button */}
        <button
          onClick={() => navigate('cart')}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6B65C] text-[#6B4A1E] font-semibold shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <span className="relative inline-flex items-center">
            <ShoppingCart size={18} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#5F6B3C] px-1 text-[10px] font-semibold text-white">
                {cartItemCount}
              </span>
            )}
          </span>
          <span className="text-sm">Cart</span>
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#6B4A1E]"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`block w-full text-left py-2 text-sm font-medium transition-colors ${
                currentPage === item.page
                  ? 'text-[#E6B65C]'
                  : 'text-[#6B4A1E] hover:text-[#E6B65C]'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Cart */}
          <button
            onClick={() => navigate('cart')}
            className="w-full mt-3 flex items-center justify-center gap-2 bg-[#E6B65C] hover:bg-[#D9A74F] text-[#6B4A1E] px-4 py-2 rounded-full font-semibold transition-transform duration-200 hover:-translate-y-0.5 shadow-md"
          >
            <ShoppingCart size={18} />
            <span className="text-sm">Cart ({cartItemCount})</span>
          </button>
        </nav>
      )}
    </header>
  );
}
