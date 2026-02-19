import { Heart, Award, Users, Leaf, TrendingUp, Sprout } from 'lucide-react';
import milk from '@/assets/milk.jpg';
import cow from '@/assets/cow.jpg';

// Video served from public folder
const COW_VIDEO_SRC = '/cow-grazing.mp4';
const FARM_VIDEO_SRC = '/farm.mp4';

function getImageSrc(imp: { src?: string; default?: string } | string): string {
  if (typeof imp === 'string') return imp;
  return (imp as { src?: string }).src ?? (imp as { default?: string }).default ?? '';
}

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Banner – full-width background video */}
      <section className="relative h-screen min-h-[100vh] w-full overflow-hidden">
        {/* Background video – full cover, no controls, autoplay, loop, muted, playsInline */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
          src={COW_VIDEO_SRC}
        >
          <source src={COW_VIDEO_SRC} type="video/mp4" />
        </video>
        {/* Dark + golden gradient overlay for text readability and desi ghee theme */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(43,52,30,0.75) 40%, rgba(107,74,30,0.7) 70%, rgba(0,0,0,0.6) 100%)',
          }}
        />
        {/* Centered content above video */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white text-center mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Our Story
          </h1>
          <p
            className="text-lg sm:text-xl md:text-2xl text-white/95 text-center max-w-2xl mx-auto"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            A Legacy of Purity, Tradition & Trust
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl text-[#6B4A1E] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Rizwan's Desi Ghee
              </h2>
              <div className="w-24 h-1 bg-[#E6B65C] mx-auto mb-6"></div>
            </div>

            <div className="space-y-6 text-lg text-[#6B4A1E]/80 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <p>
                Our journey began over 25 years ago in the heart of rural Punjab, Pakistan, where our founder, Rizwan Ahmed, 
                witnessed his grandmother preparing ghee using the traditional bilona method. The aroma, the golden 
                color, and most importantly, the pure taste left an indelible mark on his heart.
              </p>

              <p>
                In 2001, driven by a passion to preserve this dying art and provide families with genuine, 
                unadulterated desi ghee, Rizwan started our small dairy farm with just five cows. The principle 
                was simple but profound: treat the cows with love, feed them naturally, and never compromise on quality.
              </p>

              <p>
                Today, Rizwan's Desi Ghee is trusted by over 10,000 families across 50+ cities. Despite our growth, 
                we haven't changed our methods. Every jar of ghee is still made the traditional way – hand-churned 
                using the bilona process, just like our grandmother taught us.
              </p>

              <p>
                Our commitment goes beyond just making ghee. We're preserving a heritage, supporting traditional 
                farming practices, and ensuring that future generations can experience the authentic taste and 
                health benefits of pure desi ghee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Process */}
      <section className="py-20 bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl text-[#6B4A1E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Traditional Ghee-Making Process
            </h2>
            <p className="text-lg text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
              The time-honored bilona method passed down through generations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                title: 'Fresh Milk Collection',
                desc: 'Early morning milk from grass-fed, happy cows',
                icon: '🥛'
              },
              {
                step: '02',
                title: 'Natural Fermentation',
                desc: 'Milk is naturally fermented overnight to make curd',
                icon: '🫙'
              },
              {
                step: '03',
                title: 'Bilona Churning',
                desc: 'Hand-churned using traditional wooden bilona',
                icon: '⚙️'
              },
              {
                step: '04',
                title: 'Butter Separation',
                desc: 'Fresh butter is separated from buttermilk',
                icon: '🧈'
              },
              {
                step: '05',
                title: 'Slow Heating',
                desc: 'Butter is slowly heated on low flame',
                icon: '🔥'
              },
              {
                step: '06',
                title: 'Pure Ghee',
                desc: 'Golden, aromatic ghee is filtered and packaged',
                icon: '✨'
              }
            ].map((item) => (
              <div key={item.step} className="bg-white p-8 rounded-3xl shadow-lg border border-[#E6B65C]/20 text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-2xl text-[#E6B65C] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {item.step}
                </div>
                <h3 className="text-xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {item.title}
                </h3>
                <p className="text-sm text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl text-[#6B4A1E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Quality Promise
            </h2>
            <p className="text-lg text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
              What makes Rizwan's Desi Ghee truly special
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: '100% Organic',
                desc: 'Our cows are fed organic, pesticide-free fodder grown on our own farms.'
              },
              {
                icon: Heart,
                title: 'Grass-Fed Cows',
                desc: 'Happy, healthy cows that roam freely and graze on natural grass.'
              },
              {
                icon: Award,
                title: 'Lab Tested',
                desc: 'Every batch is tested for purity and quality in certified laboratories.'
              },
              {
                icon: Users,
                title: 'Family Tradition',
                desc: 'Recipes and methods passed down through three generations.'
              },
              {
                icon: Sprout,
                title: 'No Additives',
                desc: 'Zero preservatives, chemicals, or artificial ingredients added.'
              },
              {
                icon: TrendingUp,
                title: 'Trusted by Thousands',
                desc: 'Over 10,000 families trust us for their daily ghee needs.'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-[#FAF7F2] to-white p-8 rounded-3xl border border-[#E6B65C]/20 hover:shadow-xl transition-all"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#E6B65C] to-[#5F6B3C] rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl text-[#6B4A1E] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-[#6B4A1E]/70 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Farm Visuals */}
      <section className="py-20 bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl text-[#6B4A1E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Farm & Sourcing
            </h2>
            <p className="text-lg text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Where purity begins
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-3xl overflow-hidden shadow-2xl h-[320px]">
              <img 
                src={getImageSrc(milk as { src?: string; default?: string })}
                alt="Milk"
                className="w-full h-full object-cover object-center rounded-xl"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl h-[320px]">
              <img 
                src={getImageSrc(cow as { src?: string; default?: string })}
                alt="Cow"
                className="w-full h-full object-cover object-center rounded-xl"
              />
            </div>
          </div>

          <section className="mt-12 relative rounded-3xl overflow-hidden min-h-[280px] flex items-center justify-center">
            {/* Video background - absolute, full cover */}
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden
              src={FARM_VIDEO_SRC}
            >
              <source src={FARM_VIDEO_SRC} type="video/mp4" />
            </video>
            {/* Dark overlay for text readability - rgba(0,0,0,0.5) */}
            <div
              className="absolute inset-0 z-[1]"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              aria-hidden
            />
            {/* Content wrapper - relative, z-index above video */}
            <div className="relative z-10 w-full p-8 sm:p-10 md:p-12 text-center text-white">
              <h3 className="text-2xl sm:text-3xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Visit Our Farm
              </h3>
              <p className="text-white/90 text-base sm:text-lg mb-6 max-w-2xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
                We welcome you to visit our farm and see firsthand how we make our pure desi ghee. 
                Experience the traditional process and meet our happy cows!
              </p>
              <button className="px-8 py-4 bg-[#E6B65C] text-[#6B4A1E] rounded-full hover:bg-white transition-all" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Schedule a Visit
              </button>
            </div>
          </section>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '25+', label: 'Years of Experience' },
              { number: '10,000+', label: 'Happy Families' },
              { number: '100%', label: 'Pure & Natural' },
              { number: '50+', label: 'Cities Served' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl text-[#E6B65C] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stat.number}
                </div>
                <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
