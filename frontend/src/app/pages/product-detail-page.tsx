import { useState } from 'react';
import { Star, Minus, Plus, ShoppingCart, CheckCircle, Truck, CreditCard, Leaf } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { products } from '@/app/data/products';

export function ProductDetailPage() {
  const { selectedProduct, addToCart, setCurrentPage } = useApp();
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const product = selectedProduct || products[0];

  const weights = [
    { value: '500g', price: 899 },
    { value: '1kg', price: 1699 },
    { value: '2kg', price: 3199 },
    { value: '5kg', price: 7499 }
  ];

  const currentPrice = weights.find(w => w.value === selectedWeight)?.price || product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedWeight);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedWeight);
    setCurrentPage('checkout');
    window.scrollTo(0, 0);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const reviews = [
    { name: 'Priya Sharma', rating: 5, date: 'Jan 15, 2026', text: 'Excellent quality! The taste is authentic and reminds me of homemade ghee.' },
    { name: 'Rajesh Kumar', rating: 5, date: 'Jan 10, 2026', text: 'Best desi ghee I have ever purchased. Highly recommended!' },
    { name: 'Anita Patel', rating: 5, date: 'Jan 5, 2026', text: 'Pure and natural. My family loves it!' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Main Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E6B65C]/20">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-[500px] object-contain"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 border-2 border-[#E6B65C]/20 cursor-pointer hover:border-[#E6B65C] transition-colors">
                  <img 
                    src={product.image} 
                    alt={`${product.name} view ${i}`}
                    className="w-full h-20 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex">
                  {Array.from(
                    { length: Math.max(0, Math.round(product.rating || 0)) },
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-[#E6B65C] text-[#E6B65C]"
                      />
                    )
                  )}
                </div>
                <span className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {product.rating?.toFixed?.(1) ?? '5.0'} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl text-[#5F6B3C] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  PKR {currentPrice}
                </p>
                <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Inclusive of all taxes
                </p>
              </div>
            </div>

            {/* Weight Selector */}
            <div>
              <label className="block text-[#6B4A1E] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Select Weight:
              </label>
              <div className="flex flex-wrap gap-3">
                    {weights.map(weight => (
                  <button
                    key={weight.value}
                    onClick={() => setSelectedWeight(weight.value)}
                    className={`px-6 py-3 rounded-full transition-all ${
                      selectedWeight === weight.value
                        ? 'bg-[#5F6B3C] text-white shadow-lg'
                        : 'bg-white text-[#6B4A1E] border border-[#E6B65C]/20 hover:border-[#E6B65C]'
                    }`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {weight.value} - PKR {weight.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-[#6B4A1E] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Quantity:
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="w-12 h-12 bg-white rounded-full border border-[#E6B65C]/20 flex items-center justify-center hover:bg-[#FAF7F2] transition-colors"
                >
                  <Minus className="w-5 h-5 text-[#6B4A1E]" />
                </button>
                <span className="text-2xl text-[#6B4A1E] w-16 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="w-12 h-12 bg-white rounded-full border border-[#E6B65C]/20 flex items-center justify-center hover:bg-[#FAF7F2] transition-colors"
                >
                  <Plus className="w-5 h-5 text-[#6B4A1E]" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-white text-[#6B4A1E] rounded-full border-2 border-[#E6B65C] hover:bg-[#E6B65C]/10 transition-all" 
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-[#5F6B3C] text-white rounded-full hover:bg-[#6B4A1E] transition-all shadow-lg" 
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Buy Now
              </button>
            </div>

            {/* Trust Icons */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#E6B65C]/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#5F6B3C]" />
                </div>
                <div>
                  <p className="text-sm text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>100% Pure</p>
                  <p className="text-xs text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>Lab tested</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-[#5F6B3C]" />
                </div>
                <div>
                  <p className="text-sm text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>Hand-Churned</p>
                  <p className="text-xs text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>Traditional</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[#5F6B3C]" />
                </div>
                <div>
                  <p className="text-sm text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>COD Available</p>
                  <p className="text-xs text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>Pay at home</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-[#5F6B3C]" />
                </div>
                <div>
                  <p className="text-sm text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>Fast Delivery</p>
                  <p className="text-xs text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>3-5 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-[#E6B65C]/20 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-[#E6B65C]/20 overflow-x-auto">
            {['description', 'benefits', 'howItsMade', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[#5F6B3C] text-white'
                    : 'text-[#6B4A1E] hover:bg-[#FAF7F2]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {tab === 'description' && 'Description'}
                {tab === 'benefits' && 'Benefits'}
                {tab === 'howItsMade' && "How It's Made"}
                {tab === 'reviews' && 'Customer Reviews'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-2xl text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Product Description
                </h3>
                <p className="text-[#6B4A1E]/70 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {product.description}
                </p>
                <p className="text-[#6B4A1E]/70 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Our Pure Desi Ghee is made from the milk of grass-fed cows using the traditional bilona method. 
                  This ancient process involves hand-churning curd to extract butter, which is then slowly heated 
                  to create the golden, aromatic ghee that has been treasured for generations.
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
                    'Promotes healthy skin and natural glow'
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
                    { step: 1, title: 'Fresh Milk Collection', desc: 'We collect fresh milk from our grass-fed cows every morning.' },
                    { step: 2, title: 'Natural Fermentation', desc: 'The milk is converted to curd through natural fermentation.' },
                    { step: 3, title: 'Hand Churning', desc: 'Curd is hand-churned using the traditional bilona method to extract butter.' },
                    { step: 4, title: 'Slow Heating', desc: 'Butter is slowly heated on low flame to create pure golden ghee.' },
                    { step: 5, title: 'Filtering & Packaging', desc: 'The ghee is carefully filtered and packaged to preserve its purity.' }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="w-12 h-12 bg-[#E6B65C] rounded-full flex items-center justify-center flex-shrink-0 text-white text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {item.step}
                      </div>
                      <div>
                        <h4 className="text-lg text-[#6B4A1E] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
                    <div key={index} className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E6B65C]/20">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {review.name}
                          </p>
                          <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
