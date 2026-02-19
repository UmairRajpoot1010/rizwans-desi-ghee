'use client';

import { useMemo, useState } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { products } from '@/app/data/products';
import { ProductImageSlider } from '@/app/components/product-image-slider';

const WEIGHT_OPTIONS = [
  { id: '500g', label: '500g', price: 1500 },
  { id: '1kg', label: '1KG', price: 3000 },
  { id: '2kg', label: '2KG', price: 6000 },
] as const;

export function HomeProductShowcase() {
  const { addToCart, addToFavourites, removeFromFavourites, isFavourite } = useApp();

  // Use the first product from your catalog for this hero showcase.
  const product = products[0];

  const [selectedWeightId, setSelectedWeightId] = useState<(typeof WEIGHT_OPTIONS)[number]['id']>(
    '500g'
  );
  const [quantity, setQuantity] = useState(1);

  const inWishlist = isFavourite(product.id);
  const activeWeight = WEIGHT_OPTIONS.find((w) => w.id === selectedWeightId) ?? WEIGHT_OPTIONS[0];

  const currentPrice = useMemo(() => {
    return activeWeight.price;
  }, [activeWeight.price]);

  const oldPrice = useMemo(
    () => Math.round(currentPrice * 1.15),
    [currentPrice]
  );

  const handleAddToCart = () => {
    const weightLabel = activeWeight.label;
    addToCart(product, quantity, weightLabel);
  };

  const handleToggleWishlist = () => {
    if (inWishlist) removeFromFavourites(product.id);
    else addToFavourites(product);
  };

  const handleShare = async () => {
    const shareUrl =
      typeof window !== 'undefined'
        ? window.location.href
        : 'https://rizwans-desighee.com';

    const text = `${product.name} – Pure Desi Ghee from Rizwan's Desi Ghee`;

    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text, url: shareUrl });
        return;
      }
    } catch {
      // Fall through to clipboard/alert
    }

    try {
      await navigator.clipboard?.writeText?.(shareUrl);
      // eslint-disable-next-line no-alert
      alert('Product link copied to clipboard.');
    } catch {
      // eslint-disable-next-line no-alert
      alert('Share not supported in this browser.');
    }
  };

  const formattedWeightList = WEIGHT_OPTIONS.map((w) => w.label).join(', ');

  const sku = `RDG-${product.id}-${activeWeight.label.replace(/\s/g, '')}`;

  return (
    <section className="border-t border-[#E6B65C]/20 bg-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Product image slider */}
          <div className="relative flex flex-col items-center">
            <div className="relative w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-2xl">
              {/* Discount badge */}
              <div className="absolute right-4 top-4 flex h-10 items-center rounded-full bg-[#ff6b35] px-4 text-xs font-semibold uppercase tracking-wide text-white">
                -13%
              </div>

              {/* Wishlist + Share icons */}
              <div className="absolute right-4 top-16 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label="Add to wishlist"
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm shadow-sm transition-colors ${
                    inWishlist
                      ? 'border-[#E6B65C] bg-[#E6B65C]/10 text-[#5F6B3C]'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      inWishlist ? 'fill-[#E6B65C] text-[#E6B65C]' : ''
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share product"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              {/* Image with arrows */}
              <ProductImageSlider
                selectedSizeId={selectedWeightId}
                onChangeSelectedSize={setSelectedWeightId}
                productName={product.name}
              />
            </div>
          </div>

          {/* Right: Product details */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-[#6B4A1E] sm:text-3xl lg:text-4xl">
              {product.name} | 30 Days Money Back Guarantee
            </h2>

            {/* Pricing */}
            <div className="flex items-end gap-3">
              <div className="space-y-1">
                <div className="text-sm text-gray-400 line-through">
                  Rs.{oldPrice.toLocaleString('en-PK')}
                </div>
                <div className="text-2xl font-semibold text-[#d4183d] sm:text-3xl">
                  Rs.{currentPrice.toLocaleString('en-PK')}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Shipping calculated at checkout.
            </p>

            <p className="text-sm leading-relaxed text-[#6B4A1E]/80">
              Crafted in small batches from premium cow butter, our pure desi ghee
              delivers the authentic taste and aroma Pakistani kitchens love.
              Slow-cooked to preserve the classic grainy texture and golden colour.
            </p>

            {/* Weight label */}
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Weight: {activeWeight.label}
            </div>

            {/* Weight selector */}
            <div className="flex flex-wrap gap-2">
              {WEIGHT_OPTIONS.map((weight) => (
                <button
                  key={weight.id}
                  type="button"
                  onClick={() => setSelectedWeightId(weight.id)}
                  className={`min-w-[64px] rounded-md px-4 py-2 text-xs font-medium uppercase tracking-wide transition ${
                    selectedWeightId === weight.id
                      ? 'bg-[#5F6B3C] text-white shadow-sm'
                      : 'bg-white text-[#6B4A1E] ring-1 ring-gray-200 hover:bg-[#FAF7F2]'
                  }`}
                >
                  {weight.label}
                </button>
              ))}
            </div>

            {/* Quantity + buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Quantity
                </span>
                <div className="flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-gray-700 hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold text-[#6B4A1E]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-gray-700 hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Main action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#5F6B3C] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-[#6B4A1E]"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm shadow-sm transition ${
                  inWishlist
                    ? 'border-[#E6B65C] bg-[#E6B65C]/10 text-[#5F6B3C]'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={`h-4 w-4 ${
                    inWishlist ? 'fill-[#E6B65C] text-[#E6B65C]' : ''
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
                aria-label="Share product"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Meta info */}
            <div className="space-y-1 pt-4 text-sm text-[#6B4A1E]/80">
              <p>
                <span className="font-semibold text-[#6B4A1E]">Weight: </span>
                {formattedWeightList}
              </p>
              <p>
                <span className="font-semibold text-[#6B4A1E]">SKU: </span>
                {sku}
              </p>
              <p>
                <span className="font-semibold text-[#6B4A1E]">Availability: </span>
                In Stock
              </p>
              <p>
                <span className="font-semibold text-[#6B4A1E]">Categories: </span>
                Best Sellers, New Arrivals, Pure Desi Ghee
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

