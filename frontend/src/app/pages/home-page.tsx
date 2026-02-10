import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Leaf, Award, Heart, Truck, CreditCard, CheckCircle, Star, Quote } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { products } from '@/app/data/products';
import bottle from '@/assets/bottle.png';

export function HomePage() {
  const { setCurrentPage, setSelectedProduct, addToCart } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const bottleImages = [bottle];

  const handleShopNow = () => {
    setCurrentPage('shop');
    window.scrollTo(0, 0);
  };

  const handleLearnMore = () => {
    setCurrentPage('about');
    window.scrollTo(0, 0);
  };

  const handleViewProduct = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setCurrentPage('product');
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, 1, product.weight);
  };

  const testimonials = [
    {
      name: 'Ayesha Khan',
      location: 'Karachi',
      rating: 5,
      text: 'The taste reminds me of my grandmother\'s home-made ghee. Absolutely authentic and pure!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    {
      name: 'Hamza Ali',
      location: 'Lahore',
      rating: 5,
      text: 'Best quality desi ghee. The aroma and taste are exceptional. Highly recommended!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    },
    {
      name: 'Fatima Siddiqui',
      location: 'Islamabad',
      rating: 5,
      text: 'Using for 2 years now. The quality is consistently excellent. Worth every rupee!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section with single bottle carousel */}
      <section className="relative bg-[#FAF7F2] pt-10 pb-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Text */}
          <div className="space-y-6">
            <p className="uppercase tracking-[0.2em] text-sm text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Pure • Traditional • Authentic
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Rizwan&apos;s <span className="text-[#E6B65C]">Desi Ghee</span>
            </h1>
            <p className="text-lg md:text-xl text-[#5F6B3C] max-w-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Handcrafted bilona ghee with rich aroma and golden color, made from farm-fresh milk in Punjab, Pakistan.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleShopNow}
                className="bg-[#E6B65C] hover:bg-[#D9A74F] text-[#6B4A1E] px-8 py-3 rounded-full font-semibold shadow-lg transition-transform duration-200 hover:scale-105"
              >
                Shop Now
              </button>
              <button
                onClick={handleLearnMore}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#E6B65C] text-[#6B4A1E] hover:bg-[#E6B65C] hover:text-[#6B4A1E] transition-colors"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Bottle carousel (single image, slider-ready) */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-[#FFE8B3] via-[#FFF7E0] to-[#FFE0A0] rounded-[2rem] blur-2xl opacity-60" />
            <div className="relative bg-white rounded-[2rem] shadow-2xl border border-[#E6B65C]/30 px-4 py-6 md:px-8 md:py-10 overflow-hidden">
              <div className="flex items-center justify-between gap-4">
                {/* Prev */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide(
                      (currentSlide - 1 + bottleImages.length) % bottleImages.length
                    )
                  }
                  className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-[#E6B65C]/60 text-[#6B4A1E] hover:bg-[#FAF7F2] transition-colors"
                  aria-label="Previous image"
                >
                  ‹
                </button>

                {/* Image area */}
                <div className="flex-1 flex justify-center">
                  <div className="max-h-[420px] w-auto flex items-center justify-center">
                    <Image
                      src={bottleImages[currentSlide]}
                      alt="Rizwan's Desi Ghee bottle"
                      priority
                      width={400}
                      height={420}
                      sizes="(max-width: 768px) 280px, 360px"
                      className="h-auto max-h-[420px] w-auto object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Next */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide((currentSlide + 1) % bottleImages.length)
                  }
                  className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-[#E6B65C]/60 text-[#6B4A1E] hover:bg-[#FAF7F2] transition-colors"
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>

              {/* Dots */}
              <div className="mt-4 flex justify-center gap-2">
                {bottleImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      currentSlide === index
                        ? 'bg-[#E6B65C]'
                        : 'bg-[#FAF7F2] border border-[#E6B65C]/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Row */}
      <section className="bg-white py-12 border-y border-[#E6B65C]/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E6B65C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#5F6B3C]" />
              </div>
              <h3 className="text-lg text-[#6B4A1E] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>100% Pure</h3>
              <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>No additives</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E6B65C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-[#5F6B3C]" />
              </div>
              <h3 className="text-lg text-[#6B4A1E] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Traditional Method</h3>
              <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>Hand-churned</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E6B65C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-[#5F6B3C]" />
              </div>
              <h3 className="text-lg text-[#6B4A1E] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Cash on Delivery</h3>
              <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>Pay at home</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E6B65C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-[#5F6B3C]" />
              </div>
              <h3 className="text-lg text-[#6B4A1E] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Fast Delivery</h3>
              <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>Within 3-5 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl text-[#6B4A1E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Featured Products
            </h2>
            <p className="text-lg text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Choose from our range of pure desi ghee
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[#E6B65C]/20">
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

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl text-[#6B4A1E] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Weight: {product.weight}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-2xl text-[#5F6B3C]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      PKR {product.price}
                    </p>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-3 bg-[#5F6B3C] text-white rounded-full hover:bg-[#6B4A1E] transition-colors" 
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Farm Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1664961118874-32d918343e7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2aWxsYWdlJTIwZmFybSUyMG9yZ2FuaWN8ZW58MXx8fHwxNzY5ODUzNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Our Farm"
                className="w-full h-[500px] object-cover"
              />
            </div>

            {/* Right: Bullet Points */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl text-[#6B4A1E] mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                Why Choose Us?
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-[#5F6B3C]" />
                  </div>
                  <div>
                    <h3 className="text-xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Farm-Fresh Milk
                    </h3>
                    <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      From grass-fed cows on our organic farms
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-[#5F6B3C]" />
                  </div>
                  <div>
                    <h3 className="text-xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Hand-Churned Ghee
                    </h3>
                    <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Traditional bilona method for authentic taste
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-[#5F6B3C]" />
                  </div>
                  <div>
                    <h3 className="text-xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      No Chemicals
                    </h3>
                    <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      100% pure with no additives or preservatives
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-[#5F6B3C]" />
                  </div>
                  <div>
                    <h3 className="text-xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Traditional Process
                    </h3>
                    <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Methods passed down through generations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl text-[#6B4A1E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Traditional Process
            </h2>
            <p className="text-lg text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
              From farm to jar, every step is done with care
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {([
              { step: '01', icon: '🥛', title: 'Fresh Milk', desc: 'Collected from grass-fed cows' },
              { step: '02', icon: '🧈', title: 'Butter Making', desc: 'Cultured and fermented naturally' },
              { step: '03', icon: '⚙️', title: 'Hand Churning', desc: 'Traditional bilona method' },
              { step: '04', icon: '✨', title: 'Pure Ghee', desc: 'Filtered and packed with care' }
            ]).map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#E6B65C]/20">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-3xl text-[#E6B65C] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {item.step}
                  </div>
                  <h3 className="text-xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {item.desc}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-3xl text-[#E6B65C]">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl text-[#6B4A1E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Customer Reviews
            </h2>
            <p className="text-lg text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Trusted by thousands of happy families
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-[#FAF7F2] p-8 rounded-3xl shadow-lg border border-[#E6B65C]/20 relative"
              >
                <div className="absolute -top-4 left-8 w-12 h-12 bg-[#E6B65C] rounded-full flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                <div className="flex gap-1 mb-4 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#E6B65C] text-[#E6B65C]" />
                  ))}
                </div>

                <p className="text-[#6B4A1E]/80 mb-6 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-[#E6B65C]/20">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
