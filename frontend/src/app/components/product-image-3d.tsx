'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useRef, useState } from 'react';

type ProductImage3DProps = Omit<ImageProps, 'style'> & {
  /** Optional max tilt in degrees for both X and Y axes */
  maxTilt?: number;
};

// Reusable 3D hover / tilt component for product hero images.
// - Uses CSS 3D transforms with perspective for a premium "card" feel.
// - Tilts based on cursor position inside the card.
// - Smoothly eases back to rest on mouse leave.
// - Respects prefers-reduced-motion and disables effect on small screens.
export function ProductImage3D({
  maxTilt = 10,
  className,
  ...imageProps
}: ProductImage3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>('translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [interactive, setInteractive] = useState(false);

  // Check motion and viewport preferences once on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mediaWidth = window.matchMedia('(max-width: 768px)');

    const updateInteractive = () => {
      // Disable 3D motion for users who prefer reduced motion and on small screens.
      const shouldDisable = mediaMotion.matches || mediaWidth.matches;
      setInteractive(!shouldDisable);
    };

    updateInteractive();

    mediaMotion.addEventListener('change', updateInteractive);
    mediaWidth.addEventListener('change', updateInteractive);

    return () => {
      mediaMotion.removeEventListener('change', updateInteractive);
      mediaWidth.removeEventListener('change', updateInteractive);
    };
  }, []);

  const resetTransform = () => {
    setTransform('translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!interactive || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    // Normalise cursor position to range [-0.5, 0.5]
    const normalizedX = offsetX / rect.width - 0.5;
    const normalizedY = offsetY / rect.height - 0.5;

    // Clamp tilt to avoid aggressive angles.
    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    const rotateY = clamp(-normalizedX * maxTilt * 2, -maxTilt, maxTilt); // left/right
    const rotateX = clamp(normalizedY * maxTilt * 2, -maxTilt, maxTilt); // up/down

    setTransform(
      `translate3d(0, 0, 0) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) scale3d(1.08, 1.08, 1.08)`
    );
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    if (!interactive) return;
    resetTransform();
  };

  return (
    <div
      ref={containerRef}
      // Perspective is applied on the parent wrapper for a realistic 3D effect.
      style={{ perspective: '1200px' }}
      className="relative flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => {
        if (!interactive) return;
        // Subtle lift on enter; rotation will be refined on move.
        setTransform('translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale3d(1.04, 1.04, 1.04)');
      }}
      aria-hidden={false}
    >
      <div
        // The actual transforming layer (no visible container styling)
        style={{
          transform,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className="relative transition-transform duration-500 ease-out"
      >
        <Image
          {...(imageProps as ImageProps)}
          className={`h-auto max-h-[420px] w-auto object-contain select-none pointer-events-none drop-shadow-xl ${className ?? ''}`}
        />
      </div>
    </div>
  );
}

