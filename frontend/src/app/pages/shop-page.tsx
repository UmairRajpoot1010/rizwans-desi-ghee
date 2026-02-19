import { useState } from 'react';
import { Heart, ShoppingCart, Star, SlidersHorizontal } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { products } from '@/app/data/products';
import bottle500gm from '@/assets/500gm.jpeg';
import bottle1kg from '@/assets/1kg.jpeg';
import bottle2kg from '@/assets/2kg.jpeg';
// Video served from public folder
const COW_VIDEO_SRC = '/white-cow.mp4';

export function ShopPage() {
  const { setSelectedProduct, setCurrentPage, addToCart, addToFavourites, removeFromFavourites, isFavourite } = useApp();
  const [selectedWeight, setSelectedWeight] = useState<{ [key: number]: string }>({});
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [selectedFilters, setSelectedFilters] = useState({
    weights: [] as string[],
    priceRange: 'all',
    availability: 'all'
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const weights = ['500g', '1kg', '2kg'];

  // Helper function to get the correct bottle image based on weight
  const getImageForWeight = (weight: string): string => {
    const normalizedWeight = weight.toLowerCase().trim();
    if (normalizedWeight === '500g' || normalizedWeight === '500gm') {
      return bottle500gm.src;
    } else if (normalizedWeight === '1kg') {
      return bottle1kg.src;
    } else if (normalizedWeight === '2kg') {
      return bottle2kg.src;
    }
    return bottle500gm.src;
  };

  // Price by weight: 500g=1500, 1kg=3000, 2kg=6000
  const getPriceForWeight = (weight: string): number => {
    const normalizedWeight = weight.toLowerCase().trim();
    if (normalizedWeight === '500g' || normalizedWeight === '500gm') return 1500;
    if (normalizedWeight === '1kg') return 3000;
    if (normalizedWeight === '2kg') return 6000;
    return 1500;
  };
  
  const handleViewProduct = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo(0, 0);
  };

  const handleWeightSelect = (productId: number, weight: string) => {
    setSelectedWeight(prev => ({ ...prev, [productId]: weight }));
  };

  const handleAddToCart = (product: typeof products[0]) => {
    const weight = selectedWeight[product.id] || product.weight;
    addToCart(product, 1, weight);
  };

  const toggleWeightFilter = (weight: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      weights: prev.weights.includes(weight)
        ? prev.weights.filter(w => w !== weight)
        : [...prev.weights, weight]
    }));
  };

  const filteredProducts = products.filter(product => {
    if (selectedFilters.weights.length > 0) {
      const normalizedProductWeight = product.weight.toLowerCase().trim();
      const normalizedSelectedWeights = selectedFilters.weights.map(w =>
        w.toLowerCase().trim()
      );
      if (!normalizedSelectedWeights.includes(normalizedProductWeight)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Page Header with Video Background */}
      <section className="relative w-full h-[70vh] overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={COW_VIDEO_SRC} type="video/mp4" />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shop Pure Desi Ghee
          </h1>
          <p className="mt-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Choose from our range of premium quality products
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Mobile Filter Toggle */}
          <div className="mb-6 lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-[#E6B65C]/20 w-full justify-center"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <SlidersHorizontal className="w-5 h-5 text-[#6B4A1E]" />
              Filters
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Filters */}
            <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} space-y-6`}>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#E6B65C]/20">
                <h3 className="text-xl text-[#6B4A1E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Filters
                </h3>

                {/* Weight Filter */}
                <div className="mb-6">
                  <h4 className="text-lg text-[#6B4A1E] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Weight
                  </h4>
                  <div className="space-y-2">
                    {weights.map(weight => (
                      <label key={weight} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.weights.includes(weight)}
                          onChange={() => toggleWeightFilter(weight)}
                          className="w-4 h-4 accent-[#5F6B3C]"
                        />
                        <span className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {weight}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="text-lg text-[#6B4A1E] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value="all"
                        checked={selectedFilters.priceRange === 'all'}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                        className="w-4 h-4 accent-[#5F6B3C]"
                      />
                      <span className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        All Prices
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value="under1000"
                        checked={selectedFilters.priceRange === 'under1000'}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                        className="w-4 h-4 accent-[#5F6B3C]"
                      />
                      <span className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Under PKR 1,000
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value="1000-3000"
                        checked={selectedFilters.priceRange === '1000-3000'}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                        className="w-4 h-4 accent-[#5F6B3C]"
                      />
                      <span className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        PKR 1,000 - PKR 3,000
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value="above3000"
                        checked={selectedFilters.priceRange === 'above3000'}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                        className="w-4 h-4 accent-[#5F6B3C]"
                      />
                      <span className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Above PKR 3,000
                      </span>
                    </label>
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <h4 className="text-lg text-[#6B4A1E] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Availability
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value="all"
                        checked={selectedFilters.availability === 'all'}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, availability: e.target.value }))}
                        className="w-4 h-4 accent-[#5F6B3C]"
                      />
                      <span className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        All Products
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        value="instock"
                        checked={selectedFilters.availability === 'instock'}
                        onChange={(e) => setSelectedFilters(prev => ({ ...prev, availability: e.target.value }))}
                        className="w-4 h-4 accent-[#5F6B3C]"
                      />
                      <span className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        In Stock
                      </span>
                    </label>
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => setSelectedFilters({ weights: [], priceRange: 'all', availability: 'all' })}
                  className="w-full mt-6 py-3 bg-[#FAF7F2] text-[#6B4A1E] rounded-full hover:bg-[#E6B65C]/10 transition-colors border border-[#E6B65C]/20"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* Main Products Grid - 3 products in one row */}
                  <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {filteredProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[#E6B65C]/20">
                    {/* Product Image */}
                    <div 
                      className="relative overflow-hidden bg-[#FAF7F2] p-6 cursor-pointer"
                      onClick={() => handleViewProduct(product)}
                    >
                      <img 
                        src={getImageForWeight(selectedWeight[product.id] || product.weight)} 
                        alt={product.name}
                        className="w-full h-80 object-contain group-hover:scale-110 group-hover:translate-y-1 transition-transform duration-500 ease-out"
                      />
                      {product.tag && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-[#E6B65C] text-white text-xs rounded-full" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
                        className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        <Heart
                          className={`h-4 w-4 ${isFavourite(product.id) ? 'fill-[#E6B65C] text-[#E6B65C]' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl text-[#6B4A1E] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {product.name}
                        </h3>
                        <p className="text-sm text-[#6B4A1E]/60 line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {product.description}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => setRatings(prev => ({ ...prev, [product.id]: star }))}
                              className={`text-2xl transition-colors ${
                                star <= (ratings[product.id] || 0) ? "text-yellow-500" : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span
                          className="text-sm text-[#6B4A1E]/60"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          ({product.reviews})
                        </span>
                      </div>

                      {/* Price - by selected weight */}
                      <div>
                        <p className="text-2xl text-[#5F6B3C]" style={{ fontFamily: 'Playfair Display, serif' }}>
                          PKR {getPriceForWeight(selectedWeight[product.id] || product.weight)}
                        </p>
                      </div>

                      {/* Weight Selector */}
                      <div>
                        <p className="text-sm text-[#6B4A1E] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Select Weight:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {weights.map(weight => (
                            <button
                              key={weight}
                              onClick={() => handleWeightSelect(product.id, weight)}
                              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                (selectedWeight[product.id] || product.weight) === weight
                                  ? 'bg-[#5F6B3C] text-white'
                                  : 'bg-[#FAF7F2] text-[#6B4A1E] border border-[#E6B65C]/20'
                              }`}
                              style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                              {weight}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#E6B65C] text-[#6B4A1E] rounded-full hover:bg-[#5F6B3C] hover:text-white transition-colors" 
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        <ShoppingCart className="w-5 h-5" />
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
