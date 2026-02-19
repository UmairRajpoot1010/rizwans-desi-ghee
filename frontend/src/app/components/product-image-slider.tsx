import { ChevronLeft, ChevronRight } from 'lucide-react';
import bottle2 from '@/assets/bottle2.png';

type SizeImageVariant = {
  id: string;
  label: string;
  image: string;
};

const DEFAULT_VARIANTS: SizeImageVariant[] = [
  { id: '500g', label: '500g', image: bottle2.src },
  { id: '1kg', label: '1KG', image: bottle2.src },
  { id: '2kg', label: '2KG', image: bottle2.src },
];

type ProductImageSliderProps = {
  /** Currently selected size id, e.g. "500gm" | "1kg" | "2kg" */
  selectedSizeId: string;
  /** Called whenever the slider changes the active size (arrows / thumbnails) */
  onChangeSelectedSize: (sizeId: string) => void;
  /** Optional override for size/image variants */
  variants?: SizeImageVariant[];
  /** Used for alt text */
  productName: string;
};

export function ProductImageSlider({
  selectedSizeId,
  onChangeSelectedSize,
  variants = DEFAULT_VARIANTS,
  productName,
}: ProductImageSliderProps) {
  const total = variants.length;
  if (!total) return null;

  const rawIndex = variants.findIndex((variant) => variant.id === selectedSizeId);
  const activeIndex = rawIndex >= 0 ? rawIndex : 0;

  const selectByIndex = (index: number) => {
    if (!total) return;
    const safeIndex = ((index % total) + total) % total;
    const next = variants[safeIndex];
    if (!next) return;
    onChangeSelectedSize(next.id);
  };

  const handlePrev = () => {
    selectByIndex(activeIndex - 1);
  };

  const handleNext = () => {
    selectByIndex(activeIndex + 1);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main image + arrows */}
      <div className="group relative flex w-full items-center justify-center">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous product image"
          className="absolute left-0 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-[#6B4A1E] shadow-sm transition hover:bg-[#FAF7F2]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="relative flex h-[360px] w-full items-center justify-center overflow-hidden">
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {variants.map((variant) => (
              <div
                key={variant.id}
                className="flex h-full w-full shrink-0 items-center justify-center"
              >
                <img
                  src={variant.image}
                  alt={`${productName} - ${variant.label}`}
                  className="max-h-full w-auto max-w-full transform object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next product image"
          className="absolute right-0 z-10 flex h-10 w-10 translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-[#6B4A1E] shadow-sm transition hover:bg-[#FAF7F2]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Featured thumbnails */}
      <div className="mt-6 w-full">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6B4A1E]/70">
          Featured product images
        </p>
        <div className="flex justify-center gap-3 overflow-x-auto pb-1">
          {variants.map((variant, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => selectByIndex(index)}
                className="flex flex-col items-center gap-1 focus:outline-none"
              >
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl border-2 bg-white p-2 shadow-sm transition ${
                    isActive
                      ? 'border-[#5F6B3C] ring-2 ring-[#E6B65C]/60'
                      : 'border-[#E6B65C]/30 hover:border-[#5F6B3C]/80'
                  }`}
                >
                  <img
                    src={variant.image}
                    alt={`${productName} - ${variant.label} thumbnail`}
                    className="max-h-full w-auto max-w-full object-contain"
                  />
                </div>
                <span
                  className={`text-xs font-medium uppercase tracking-wide ${
                    isActive ? 'text-[#5F6B3C]' : 'text-[#6B4A1E]/70'
                  }`}
                >
                  {variant.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

