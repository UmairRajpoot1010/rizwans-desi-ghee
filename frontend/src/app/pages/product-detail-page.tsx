import { useState, useEffect } from 'react';
import { Star, Minus, Plus, ShoppingCart, CheckCircle, Truck, CreditCard, Leaf } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { useProduct } from '@/hooks/use-product';
import { ProductImageZoom } from '@/app/components/product-image-zoom';

export function ProductDetailPage() {
  const { selectedProduct, addToCart, setCurrentPage } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Use selectedProduct from context, or fetch by ID if we have it in URL/localStorage
  const productId = selectedProduct?.id ?? null;
  const { product: fetchedProduct, loading, error } = useProduct(productId);
  const product = selectedProduct ?? fetchedProduct ?? null;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, product.weight);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity, product.weight);
      setCurrentPage('checkout');
      window.scrollTo(0, 0);
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const reviews = [
    {
      name: 'Priya Sharma',
      rating: 5,
      date: 'Jan 15, 2026',
      text: 'Excellent quality! The taste is authentic and reminds me of homemade ghee.',
    },
    {
      name: 'Rajesh Kumar',
      rating: 5,
      date: 'Jan 10, 2026',
      text: 'Best desi ghee I have ever purchased. Highly recommended!',
    },
    {
      name: 'Anita Patel',
      rating: 5,
      date: 'Jan 5, 2026',
      text: 'Pure and natural. My family loves it!',
    },
  ];

  if (!product && !loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl text-[#6B4A1E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            No product selected
          </h2>
          <p className="text-[#6B4A1E]/70 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Please choose a product from our shop.
          </p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-8 py-4 bg-[#5F6B3C] text-white rounded-full hover:bg-[#6B4A1E] transition-all"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Browse Shop
          </button>
        </div>
      </div>
    );
  }

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Loading…
        </p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-8 py-4 bg-[#5F6B3C] text-white rounded-full hover:bg-[#6B4A1E] transition-all"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const imageSrc = product.image || '';

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="container mx-auto px-4 lg:px-8 py-6 md:py-12">
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-16">
          {/* Left - Product Images */}
          <div className="space-y-3 md:space-y-4">
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg border border-[#E6B65C]/20">
              <ProductImageZoom
                imageSrc={imageSrc}
                zoomImageSrc={imageSrc}
                alt={product.name}
              />
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <h1 className="text-2xl md:text-4xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {product.name}
              </h1>

              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="flex gap-1">
                  {Array.from(
                    { length: Math.max(0, Math.round(product.rating || 0)) },
                    (_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-[#E6B65C] text-[#E6B65C]" />
                    )
                  )}
                </div>
                <span className="text-xs md:text-sm text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {product.rating?.toFixed?.(1) ?? '5.0'} ({product.reviews} reviews)
                </span>
              </div>

              <div className="mb-4 md:mb-6">
                <p className="text-2xl md:text-4xl text-[#5F6B3C] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  PKR {product.price}
                </p>
                <p className="text-xs md:text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Inclusive of all taxes • {product.weight}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs md:text-base text-[#6B4A1E] mb-2 md:mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Quantity:
              </label>
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border border-[#E6B65C]/20 flex items-center justify-center hover:bg-[#FAF7F2] transition-colors"
                >
                  <Minus className="w-4 h-4 md:w-5 md:h-5 text-[#6B4A1E]" />
                </button>
                <span
                  className="text-xl md:text-2xl text-[#6B4A1E] w-12 md:w-16 text-center"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border border-[#E6B65C]/20 flex items-center justify-center hover:bg-[#FAF7F2] transition-colors"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5 text-[#6B4A1E]" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 md:py-4 bg-white text-[#6B4A1E] rounded-full border-2 border-[#E6B65C] hover:bg-[#E6B65C]/10 transition-all text-sm md:text-base"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 md:py-4 bg-[#5F6B3C] text-white rounded-full hover:bg-[#6B4A1E] transition-all shadow-lg text-sm md:text-base"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Buy Now
              </button>
            </div>

            {/* Trust Icons */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-[#E6B65C]/20">
              <div className="flex items-start md:items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-[#5F6B3C]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    100% Pure
                  </p>
                  <p className="text-xs text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Lab tested
                  </p>
                </div>
              </div>
              <div className="flex items-start md:items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 md:w-6 md:h-6 text-[#5F6B3C]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Hand-Churned
                  </p>
                  <p className="text-xs text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Traditional
                  </p>
                </div>
              </div>
              <div className="flex items-start md:items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-[#5F6B3C]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    COD Available
                  </p>
                  <p className="text-xs text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Pay at home
                  </p>
                </div>
              </div>
              <div className="flex items-start md:items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 md:w-6 md:h-6 text-[#5F6B3C]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Fast Delivery
                  </p>
                  <p className="text-xs text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    3-5 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-[#E6B65C]/20 overflow-hidden">
          <div className="flex border-b border-[#E6B65C]/20 overflow-x-auto">
            {['description', 'benefits', 'howItsMade', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-8 py-3 md:py-4 transition-colors whitespace-nowrap text-xs md:text-base ${
                  activeTab === tab ? 'bg-[#5F6B3C] text-white' : 'text-[#6B4A1E] hover:bg-[#FAF7F2]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {tab === 'description' && 'Description'}
                {tab === 'benefits' && 'Benefits'}
                {tab === 'howItsMade' && "How It's Made"}
                {tab === 'reviews' && 'Reviews'}
              </button>
            ))}
          </div>

          <div className="p-4 md:p-8">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-2xl text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Product Description
                </h3>
                <p
                  className="text-[#6B4A1E]/70 leading-relaxed"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="space-y-6">
                <h3 className="text-2xl text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Health Benefits
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Boosts immunity and strengthens the body',
                    'Rich in vitamins A, E, and K',
                    'Improves digestion and gut health',
                    'Supports heart health with healthy fats',
                    'Enhances brain function and memory',
                    'Promotes healthy skin and natural glow',
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#5F6B3C] flex-shrink-0 mt-1" />
                      <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'howItsMade' && (
              <div className="space-y-6">
                <h3 className="text-2xl text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Traditional Bilona Method
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      title: 'Fresh Milk Collection',
                      desc: 'We collect fresh milk from our grass-fed cows every morning.',
                    },
                    {
                      step: 2,
                      title: 'Natural Fermentation',
                      desc: 'The milk is converted to curd through natural fermentation.',
                    },
                    {
                      step: 3,
                      title: 'Hand Churning',
                      desc: 'Curd is hand-churned using the traditional bilona method to extract butter.',
                    },
                    {
                      step: 4,
                      title: 'Slow Heating',
                      desc: 'Butter is slowly heated on low flame to create pure golden ghee.',
                    },
                    {
                      step: 5,
                      title: 'Filtering & Packaging',
                      desc: 'The ghee is carefully filtered and packaged to preserve its purity.',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div
                        className="w-12 h-12 bg-[#E6B65C] rounded-full flex items-center justify-center flex-shrink-0 text-white text-lg"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {item.step}
                      </div>
                      <div>
                        <h4
                          className="text-lg text-[#6B4A1E] mb-1"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          {item.title}
                        </h4>
                        <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Customer Reviews
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#E6B65C] text-[#E6B65C]" />
                      ))}
                    </div>
                    <span className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      5.0 ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E6B65C]/20"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {review.name}
                          </p>
                          <p
                            className="text-sm text-[#6B4A1E]/60"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {review.date}
                          </p>
                        </div>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-[#E6B65C] text-[#E6B65C]" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
