'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/app/context/app-context';
import hero1 from '@/assets/hero1.png';
import hero4 from '@/assets/hero4.png';
import hero3 from '@/assets/hero3.jpeg';

function getImageSrc(imp: { src?: string; default?: string } | string): string {
  if (typeof imp === 'string') return imp;
  return imp?.src ?? (imp as { default?: string })?.default ?? '';
}

type Slide = {
  id: number;
  image: string;
  heading: string;
  subheading: string;
};

const slides: Slide[] = [
  {
    id: 1,
    image: getImageSrc(hero1 as { src?: string; default?: string }),
    heading: "Rizwan's Pure Desi Ghee",
    subheading: '100% Natural & Traditional',
  },
  {
    id: 2,
    image: getImageSrc(hero4 as { src?: string; default?: string }),
    heading: "A taste of tradition in every drop",
    subheading: 'Feel the purity',
  },
  {
    id: 3,
    image: getImageSrc(hero3 as { src?: string; default?: string }),
    heading: 'Believe in Quality',
    subheading: 'Premium Quality Ghee',
  },
];

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [parallax, setParallax] = useState({
    bgX: 0,
    bgY: 0,
    fgX: 0,
    fgY: 0,
  });
  const { setCurrentPage } = useApp();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const handleChange = () => setIsMobile(mq.matches);
    handleChange();
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleShopNow = () => {
    setCurrentPage('shop');
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  const handleMouseMove: React.MouseEventHandler<HTMLElement> = (event) => {
    if (isMobile) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (event.clientX - centerX) / (rect.width / 2);
    const dy = (event.clientY - centerY) / (rect.height / 2);

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    const clampedX = clamp(dx, -1, 1);
    const clampedY = clamp(dy, -1, 1);

    // Keep background stable so the full image remains visible.
    const maxBgShift = 0;
    const maxFgShift = 16;

    setParallax({
      bgX: -clampedX * maxBgShift,
      bgY: -clampedY * maxBgShift,
      fgX: clampedX * maxFgShift,
      fgY: clampedY * maxFgShift,
    });
  };

  const resetParallax = () => {
    setParallax({ bgX: 0, bgY: 0, fgX: 0, fgY: 0 });
  };

  return (
    <section
      className="hero-slider text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        resetParallax();
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        className="hero-slider__track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const isFirstSlide = index === 0;
          const isLastSlide = index === slides.length - 1;
          const isSecondSlide = index === 1;
          // Avoid zooming the background so the full image remains visible.
          const scale = 1;
          const bgTransform =
            isActive && !isMobile
              ? `translate3d(${parallax.bgX}px, ${parallax.bgY}px, 0) scale(${scale})`
              : `translate3d(0, 0, 0) scale(${scale})`;
          const fgTransform =
            isActive && !isMobile
              ? `translate3d(${parallax.fgX}px, ${parallax.fgY}px, 0)`
              : 'translate3d(0, 0, 0)';

          return (
            <article
              key={slide.id}
              className={`hero-slide ${isActive ? 'hero-slide--active' : ''}`}
            >
              <div
                className="hero-slide__bg"
                style={{
                  transform: bgTransform,
                  filter: isActive ? 'brightness(1.05)' : 'brightness(0.95)',
                }}
              >
                <img
                  src={slide.image}
                  alt=""
                  className="hero-slide__bg-img"
                />
              </div>

              <div className="hero-slide__content-wrapper">
                {isSecondSlide ? (
                  <div
                    className="hero-slide__content w-full flex flex-col items-center justify-start px-6 md:px-10 pt-[100px] md:pt-16 text-center"
                    style={{ transform: fgTransform }}
                  >
                    <div className="flex flex-col items-center space-y-4 max-w-2xl text-center">
                      <h1 className="hero-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white">
                        {slide.heading}
                      </h1>
                      <p className="hero-subheading text-sm sm:text-base md:text-lg text-white/85">
                        {slide.subheading}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`hero-slide__content w-full flex flex-col items-start justify-start px-6 md:px-10 ${isFirstSlide ? 'pt-[100px] md:pt-16' : 'pt-6 md:pt-10'
                      }`}
                    style={{ transform: fgTransform }}
                  >
                    <div className="flex flex-col items-start space-y-4 max-w-md text-left">
                      <h1
                        className={`hero-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white ${isLastSlide ? 'max-w-xl' : ''
                          }`}
                      >
                        {slide.heading}
                      </h1>
                      <p className="hero-subheading text-sm sm:text-base md:text-lg text-white/85">
                        {slide.subheading}
                      </p>
                      {isFirstSlide && (
                        <button
                          type="button"
                          onClick={handleShopNow}
                          className="hero-cta inline-flex items-center justify-center rounded-full bg-[#5F6B3C] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_16px_40px_rgba(95,107,60,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6B65C] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                          Shop Now
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="hero-dots">
        {slides.map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDotClick(index)}
              className={`hero-dots__dot ${isActive ? 'hero-dots__dot--active' : ''
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
}
