import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Leaf, Award, Heart, Truck, CreditCard, CheckCircle, Star, Quote, MessageCircle } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import bottle from '@/assets/bottle.png';
import { ProductImage3D } from '@/app/components/product-image-3d';
import { HomeProductShowcase } from '@/app/components/home-product-showcase';
import { TopCollection } from '@/app/components/top-collection';
import { HeroSlider } from '@/app/components/hero-slider';

export function HomePage() {
  const { setCurrentPage } = useApp();
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
      {/* Premium cinematic hero slider */}
      <HeroSlider />

      {/* Trust Badges Row */}
      <section className="bg-white py-6 md:py-12 border-y border-[#E6B65C]/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#E6B65C]/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-[#5F6B3C]" />
              </div>
              <h3 className="text-sm md:text-lg text-[#6B4A1E] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>100% Pure</h3>
              <p className="text-xs md:text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>No additives</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#E6B65C]/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                <Leaf className="w-6 h-6 md:w-8 md:h-8 text-[#5F6B3C]" />
              </div>
              <h3 className="text-sm md:text-lg text-[#6B4A1E] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Traditional Method</h3>
              <p className="text-xs md:text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>Hand-churned</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#E6B65C]/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-[#5F6B3C]" />
              </div>
              <h3 className="text-sm md:text-lg text-[#6B4A1E] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Cash on Delivery</h3>
              <p className="text-xs md:text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>Pay at home</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#E6B65C]/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
                <Truck className="w-6 h-6 md:w-8 md:h-8 text-[#5F6B3C]" />
              </div>
              <h3 className="text-sm md:text-lg text-[#6B4A1E] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Fast Delivery</h3>
              <p className="text-xs md:text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>Within 3-5 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp order marquee above featured products */}
      <div className="bg-black">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="group relative flex h-8 sm:h-9 md:h-10 items-center overflow-hidden">
            <div className="flex w-max items-center gap-10 pr-6 animate-announcement-marquee group-hover:[animation-play-state:paused]">
              {Array.from({ length: 2 }).map((_, idx) => (
                <span
                  key={idx}
                  className="whitespace-nowrap text-xs sm:text-sm font-semibold text-white"
                >
                  Order on WhatsApp +92-3287318269 • Order on WhatsApp +92-3287318269 • Order on WhatsApp +92-3287318269
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top collection section */}
      <TopCollection />

      {/* Free Delivery headline above Featured Products */}
      <div className="bg-black">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="group relative flex h-8 sm:h-9 md:h-10 items-center overflow-hidden">
            <div className="flex w-max items-center gap-10 pr-6 animate-announcement-marquee group-hover:[animation-play-state:paused]">
              {Array.from({ length: 2 }).map((_, idx) => (
                <span
                  key={idx}
                  className="whitespace-nowrap text-xs sm:text-sm font-semibold text-white"
                >
                  Free Delivery all over the pakistan - Fast delivery • Free Delivery all over the pakistan - Fast delivery
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="pt-10 md:pt-20 pb-4 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl lg:text-5xl text-[#6B4A1E] mb-1 md:mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Featured Products
            </h2>
            <p className="text-sm md:text-lg text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Choose from our range of pure desi ghee
            </p>
          </div>
        </div>
      </section>

      {/* Interactive product showcase section (detail-style) */}
      <HomeProductShowcase />

      {/* Floating WhatsApp icon */}
      <button
        type="button"
        onClick={() => window.open('https://wa.me/923287318269', '_blank')}
        aria-label="Chat with us on WhatsApp"
        className="fixed left-4 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-xl hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
