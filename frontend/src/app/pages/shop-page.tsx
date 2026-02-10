import { useState } from 'react';
import { ShoppingCart, Star, SlidersHorizontal } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { products } from '@/app/data/products';

export function ShopPage() {
  const { setSelectedProduct, setCurrentPage, addToCart } = useApp();
  const [selectedWeight, setSelectedWeight] = useState<{ [key: number]: string }>({});
  const [selectedFilters, setSelectedFilters] = useState({
    weights: [] as string[],
    priceRange: 'all',
    availability: 'all'
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const weights = ['500g', '1kg', '2kg', '5kg'];
  
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
    if (selectedFilters.weights.length > 0 && !selectedFilters.weights.includes(product.weight)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#5F6B3C] to-[#6B4A1E] py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl text-white text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shop Pure Desi Ghee
          </h1>
          <p className="text-white/90 text-center text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
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

            {/* Main Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Showing {filteredProducts.length} products
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#E6B65C]/20">
                    {/* Product Image */}
                    <div 
                      className="relative overflow-hidden bg-[#FAF7F2] p-6 cursor-pointer"
                      onClick={() => handleViewProduct(product)}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.tag && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-[#E6B65C] text-white text-xs rounded-full" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {product.tag}
                        </div>
                      )}
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
                        <div className="flex">
                          {Array.from(
                            { length: Math.max(0, Math.round(product.rating || 0)) },
                            (_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-[#E6B65C] text-[#E6B65C]"
                              />
                            )
                          )}
                        </div>
                        <span
                          className="text-sm text-[#6B4A1E]/60"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          ({product.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div>
                        <p className="text-2xl text-[#5F6B3C]" style={{ fontFamily: 'Playfair Display, serif' }}>
                          PKR {product.price}
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
