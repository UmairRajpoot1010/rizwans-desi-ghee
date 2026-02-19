import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/app/context/app-context';
import { products as catalogProducts } from '@/app/data/products';
import bottle500gm from '@/assets/500gm.jpeg';
import bottle1kg from '@/assets/1kg.jpeg';
import bottle2kg from '@/assets/2kg.jpeg';

const showcaseProducts = [
  {
    id: 1,
    name: '500GM Buffalo Desi Ghee',
    weight: '500GM',
    description: 'Rich traditional buffalo desi ghee with authentic aroma.',
    image: bottle500gm.src,
    price: 1500,
  },
  {
    id: 2,
    name: '1KG Pure Desi Ghee',
    weight: '1KG',
    description: 'Premium hand-churned pure desi ghee for daily use.',
    image: bottle1kg.src,
    price: 3000,
  },
  {
    id: 3,
    name: '2KG Pure Desi Ghee',
    weight: '2KG',
    description: 'Farm fresh ghee with golden texture and rich taste.',
    image: bottle2kg.src,
    price: 6000,
  },
] as const;

export function TopCollection() {
  const { addToCart, setCurrentPage, setSelectedProduct } = useApp();
  const [isMobile, setIsMobile] = useState(false);

  // Duplicate list to create seamless infinite scrolling track.
  const scrollingTrack = useMemo(
    () => [...showcaseProducts, ...showcaseProducts],
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handleQuickShop = (productId: number) => {
    // Map showcase card to an actual catalog product for cart + detail view.
    const catalogProduct = catalogProducts.find((p) => p.id === productId) ?? catalogProducts[0];
    const defaultWeight = catalogProduct.weight || '500g';

    addToCart(catalogProduct, 1, defaultWeight);
    setSelectedProduct(catalogProduct);
    setCurrentPage('product');
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading with elegant underline */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6B4A1E]/60">
            Top Collection
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold text-[#6B4A1E]">
            Handpicked Premium Ghee Jars
          </h2>
          <div className="mt-4 flex justify-center">
            <span className="inline-block h-[2px] w-24 rounded-full bg-[#E6B65C]" />
          </div>
        </div>

        {/* Auto-sliding product row */}
        <div
          className={`group relative ${
            isMobile ? 'overflow-x-auto pb-2' : 'overflow-hidden'
          }`}
        >
          <div
            className={[
              'flex gap-8 will-change-transform',
              isMobile
                ? 'min-w-full'
                : 'w-max animate-top-collection-marquee group-hover:[animation-play-state:paused]',
            ].join(' ')}
          >
            {scrollingTrack.map((product, index) => (
              <article
                key={`${product.id}-${index}`}
                className="relative w-72 shrink-0 rounded-3xl bg-[#FAF7F2] p-[1px] shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
              >
                <div className="relative h-full rounded-[22px] bg-gradient-to-b from-white/90 to-white/70 p-5">
                  {/* Product image with glassmorphism hover overlay */}
                  <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-white">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-52 w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    />

                    {/* Glassmorphism overlay */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_18px_40px_rgba(0,0,0,0.25)] opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0" />

                    {/* Quick Shop button (interactive layer) */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleQuickShop(product.id)}
                        className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-[#5F6B3C] px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_14px_30px_rgba(95,107,60,0.55)] transition-transform duration-300 ease-out hover:scale-105 hover:shadow-[0_18px_40px_rgba(95,107,60,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E6B65C]"
                      >
                        Quick Shop
                      </button>
                    </div>
                  </div>

                  {/* Card meta */}
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-[#6B4A1E]">
                      {product.name}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#5F6B3C]/80">
                      {product.weight}
                    </p>
                    <p className="text-sm text-[#6B4A1E]/70">
                      {product.description}
                    </p>
                    <p className="pt-1 text-lg font-semibold text-[#5F6B3C]">
                      Rs.{product.price.toLocaleString('en-PK')}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

