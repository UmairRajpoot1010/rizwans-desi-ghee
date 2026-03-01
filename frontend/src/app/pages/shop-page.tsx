import { useState, useMemo } from 'react';
import { Heart, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { useProducts } from '@/hooks/use-products';
import type { Product } from '@/app/context/app-context';

const COW_VIDEO_SRC = '/white-cow.mp4';

export function ShopPage() {
  const { setSelectedProduct, setCurrentPage, addToCart, addToFavourites, removeFromFavourites, isFavourite } = useApp();
  const [selectedFilters, setSelectedFilters] = useState({
    category: '' as string,
    priceRange: 'all' as string,
    availability: 'all' as string,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const apiParams = useMemo(() => {
    const params: { page?: number; limit?: number; category?: string; minPrice?: number; maxPrice?: number; inStock?: boolean } = {};
    params.limit = 50;
    if (selectedFilters.category) params.category = selectedFilters.category;
    if (selectedFilters.availability === 'instock') params.inStock = true;
    if (selectedFilters.priceRange === 'under1000') {
      params.maxPrice = 1000;
    } else if (selectedFilters.priceRange === '1000-3000') {
      params.minPrice = 1000;
      params.maxPrice = 3000;
    } else if (selectedFilters.priceRange === 'above3000') {
      params.minPrice = 3000;
    }
    return params;
  }, [selectedFilters]);

  const { products, loading, error, refetch } = useProducts(apiParams);

  const handleViewProduct = (product: Product) => {
    setCurrentPage('product', { product });
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (product: Product) => {
    // Use the product's own weight if available, otherwise find 1kg or first variant
    // @ts-ignore
    const defaultSize = product.weight || product.variants?.find((v: any) => v.size === '1kg')?.size || product.variants?.[0]?.size || '1kg';
    addToCart(product, 1, defaultSize);
  };

  const imageForProduct = (p: Product) => p.image || '';

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Page Header with Video Background */}
      <section className="relative w-full aspect-video md:aspect-video min-h-64 md:min-h-80 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={COW_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 lg:px-8">
          <h1 className="text-2xl md:text-4xl lg:text-5xl mb-2 md:mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shop Pure Desi Ghee
          </h1>
          <p className="mt-2 md:mt-4 text-sm md:text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Choose from our range of premium quality products
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-4 md:mb-6 lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-[#E6B65C]/20 w-full justify-center text-sm md:text-base"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <SlidersHorizontal className="w-4 h-4 md:w-5 md:h-5 text-[#6B4A1E]" />
              Filters
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-4 md:gap-8">
            {/* Sidebar Filters */}
            <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} space-y-4 md:space-y-6`}>
              <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border border-[#E6B65C]/20">
                <h3 className="text-lg md:text-xl text-[#6B4A1E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Filters
                </h3>

                <div className="mb-4 md:mb-6">
                  <h4 className="text-base md:text-lg text-[#6B4A1E] mb-2 md:mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Prices' },
                      { value: 'under1000', label: 'Under PKR 1,000' },
                      { value: '1000-3000', label: 'PKR 1,000 - PKR 3,000' },
                      { value: 'above3000', label: 'Above PKR 3,000' },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          value={opt.value}
                          checked={selectedFilters.priceRange === opt.value}
                          onChange={(e) =>
                            setSelectedFilters((prev) => ({ ...prev, priceRange: e.target.value }))
                          }
                          className="w-4 h-4 accent-[#5F6B3C]"
                        />
                        <span className="text-xs md:text-sm text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-base md:text-lg text-[#6B4A1E] mb-2 md:mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Availability
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value="all"
                        checked={selectedFilters.availability === 'all'}
                        onChange={(e) =>
                          setSelectedFilters((prev) => ({ ...prev, availability: e.target.value }))
                        }
                        className="w-4 h-4 accent-[#5F6B3C]"
                      />
                      <span className="text-xs md:text-sm text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        All Products
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value="instock"
                        checked={selectedFilters.availability === 'instock'}
                        onChange={(e) =>
                          setSelectedFilters((prev) => ({ ...prev, availability: e.target.value }))
                        }
                        className="w-4 h-4 accent-[#5F6B3C]"
                      />
                      <span className="text-xs md:text-sm text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        In Stock
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setSelectedFilters({
                      category: '',
                      priceRange: 'all',
                      availability: 'all',
                    })
                  }
                  className="w-full mt-4 md:mt-6 py-3 bg-[#FAF7F2] text-[#6B4A1E] rounded-full hover:bg-[#E6B65C]/10 transition-colors border border-[#E6B65C]/20 text-sm md:text-base"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Clear Filters
                </button>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading && (
                <div className="text-center py-12 md:py-16 text-[#6B4A1E]/70 text-sm md:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Loading products…
                </div>
              )}
              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 px-4 md:px-6 py-3 md:py-4 text-red-700 text-xs md:text-sm mb-4 md:mb-6">
                  {error}
                  <button
                    onClick={() => refetch()}
                    className="ml-2 md:ml-4 underline"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!loading && !error && products.length === 0 && (
                <div className="text-center py-12 md:py-16 text-[#6B4A1E]/70 text-sm md:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  No products found.
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                {!loading &&
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[#E6B65C]/20"
                    >
                      <div
                        className="relative overflow-hidden bg-[#FAF7F2] p-3 md:p-6 cursor-pointer"
                        onClick={() => handleViewProduct(product)}
                      >
                        <img
                          src={imageForProduct(product)}
                          alt={product.name}
                          className="w-full aspect-square object-contain group-hover:scale-110 group-hover:translate-y-1 transition-transform duration-500 ease-out"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="%23E6B65C20"><rect width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236B4A1E" font-size="14">No image</text></svg>';
                          }}
                        />
                        {product.tag && (
                          <div
                            className="absolute top-2 left-2 md:top-4 md:left-4 px-2 md:px-3 py-1 bg-[#E6B65C] text-white text-xs rounded-full"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {product.tag}
                          </div>
                        )}
                        <button
                          type="button"
                          aria-label={isFavourite(product.id) ? 'Remove from favourites' : 'Add to favourites'}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isFavourite(product.id)) removeFromFavourites(product.id);
                            else addToFavourites(product);
                          }}
                          className="absolute top-2 right-2 md:top-4 md:right-4 flex h-8 md:h-9 w-8 md:w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                          <Heart
                            className={`h-3 h-4 md:h-4 md:w-4 ${isFavourite(product.id) ? 'fill-[#E6B65C] text-[#E6B65C]' : ''
                              }`}
                          />
                        </button>
                      </div>

                      <div className="p-3 md:p-6 space-y-2 md:space-y-4">
                        <div>
                          <h3
                            className="text-sm md:text-xl text-[#6B4A1E] mb-1"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                          >
                            {product.name}
                          </h3>
                          <p
                            className="text-xs md:text-sm text-[#6B4A1E]/60 line-clamp-2"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs md:text-sm text-[#6B4A1E]/60"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {product.weight}
                          </span>
                        </div>

                        <div>
                          <p
                            className="text-lg md:text-2xl text-[#5F6B3C]"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                          >
                            PKR {product.price.toLocaleString('en-PK')}
                          </p>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full flex items-center justify-center gap-2 py-2 md:py-3 bg-[#E6B65C] text-[#6B4A1E] rounded-full hover:bg-[#5F6B3C] hover:text-white transition-colors text-xs md:text-sm"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          <ShoppingCart className="w-3 h-3 md:w-5 md:h-5" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
