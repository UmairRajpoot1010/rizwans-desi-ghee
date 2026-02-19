import { Home, ShoppingBag, Phone, MessageCircle } from 'lucide-react';
import { useApp } from '@/app/context/app-context';

export function MobileBottomBar() {
  const { setCurrentPage } = useApp();

  const handleWhatsApp = () => {
    window.open('https://wa.me/923287318269', '_blank');
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-all md:hidden animate-bounce"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E6B65C]/20 shadow-2xl md:hidden">
        <div className="grid grid-cols-3 gap-1 p-2">
          <button
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo(0, 0);
            }}
            className="flex flex-col items-center gap-1 py-3 px-4 rounded-2xl hover:bg-[#FAF7F2] transition-colors"
          >
            <Home className="w-6 h-6 text-[#6B4A1E]" />
            <span className="text-xs text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Home
            </span>
          </button>

          <button
            onClick={() => {
              setCurrentPage('shop');
              window.scrollTo(0, 0);
            }}
            className="flex flex-col items-center gap-1 py-3 px-4 rounded-2xl hover:bg-[#FAF7F2] transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-[#6B4A1E]" />
            <span className="text-xs text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Shop
            </span>
          </button>

          <button
            onClick={() => {
              setCurrentPage('contact');
              window.scrollTo(0, 0);
            }}
            className="flex flex-col items-center gap-1 py-3 px-4 bg-[#5F6B3C] text-white rounded-2xl shadow-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <Phone className="w-6 h-6" />
            <span className="text-xs">Buy Now</span>
          </button>
        </div>
      </div>

      {/* Bottom spacing for mobile */}
      <div className="h-20 md:hidden" />
    </>
  );
}
