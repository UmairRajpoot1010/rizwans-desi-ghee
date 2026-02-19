'use client';

import { useEffect, useRef, useState } from 'react';

type ProductImageZoomProps = {
  imageSrc: string;
  zoomImageSrc?: string;
  alt: string;
};

export function ProductImageZoom({ imageSrc, zoomImageSrc, alt }: ProductImageZoomProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  // Enable zoom only on medium+ screens for better UX.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsZoomEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!isZoomEnabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    const xPercent = clamp((offsetX / rect.width) * 100, 0, 100);
    const yPercent = clamp((offsetY / rect.height) * 100, 0, 100);

    setPosition({ x: xPercent, y: yPercent });
    setIsActive(true);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const zoomSrc = zoomImageSrc ?? imageSrc;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
      {/* Main image with hover tracking */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden rounded-3xl bg-[#FAF7F2]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={imageSrc}
          alt={alt}
          className="h-[320px] w-full object-contain transition-transform duration-300 ease-out md:group-hover:scale-105"
        />
      </div>

      {/* Zoomed preview (desktop only) */}
      <div
        className={`hidden md:block w-64 flex-none overflow-hidden rounded-3xl border border-[#E6B65C]/30 bg-[#141414] shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition-all duration-200 ease-out ${
          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
        }`}
        style={{
          backgroundImage: `url(${zoomSrc})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '220%',
          backgroundPosition: `${position.x}% ${position.y}%`,
        }}
        aria-hidden={!isActive}
      />
    </div>
  );
}

