'use client';

import { useApp } from '@/app/context/app-context';
import { ShoppingBag } from 'lucide-react';

export function FavouritesPage() {
  const { favourites, removeFromFavourites, setSelectedProduct, setCurrentPage } = useApp();

  const handleBuyNow = (product: (typeof favourites)[0]) => {
    setCurrentPage('product', { product });
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <section className="bg-gradient-to-r from-[#5F6B3C] to-[#6B4A1E] py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl text-white text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Favourites
          </h1>
          <p className="text-white/90 text-center text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Your saved products – buy now when you&apos;re ready
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {favourites.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E6B65C]/20 shadow-lg">
              <p className="text-[#6B4A1E]/80 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                No favourites yet. Add products from the Shop or Featured section.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E6B65C]/20 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="relative bg-[#FAF7F2] p-6 h-56 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full w-full object-contain"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#6B4A1E]/60 line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {product.description}
                    </p>
                    <p className="text-2xl text-[#5F6B3C]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      PKR {product.price}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleBuyNow(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#5F6B3C] text-white rounded-full hover:bg-[#6B4A1E] transition-colors"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Buy Now
                      </button>
                      <button
                        onClick={() => removeFromFavourites(product.id)}
                        className="px-4 py-3 rounded-full border border-[#E6B65C]/40 text-[#6B4A1E] hover:bg-[#FAF7F2] transition-colors"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
