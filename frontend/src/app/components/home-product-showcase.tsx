'use client';

import { useMemo, useState } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { useProducts } from '@/hooks/use-products';
import { ProductImageSlider } from '@/app/components/product-image-slider';
import bottle500g from '@/assets/500g (2).png';
import bottle1kg from '@/assets/1KG.png';
import bottle2kg from '@/assets/2KG.png';

const WEIGHT_OPTIONS = [
  { id: '500g', label: '500g', image: bottle500g.src, price: 3500 },
  { id: '1kg', label: '1KG', image: bottle1kg.src, price: 6800 },
  { id: '2kg', label: '2KG', image: bottle2kg.src, price: 13000 },
];

export function HomeProductShowcase() {
  const { addToCart, addToFavourites, removeFromFavourites, isFavourite } = useApp();
  const { products, loading } = useProducts({ limit: 1 });

  const product = products[0] ?? null;

  const [selectedWeightId, setSelectedWeightId] = useState('500g');
  const [quantity, setQuantity] = useState(1);

  const inWishlist = product ? isFavourite(product.id) : false;
  const activeWeight = WEIGHT_OPTIONS.find((w) => w.id === selectedWeightId) ?? WEIGHT_OPTIONS[0];

  const currentPrice = useMemo(() => {
    const sizeOption = WEIGHT_OPTIONS.find((w) => w.id === selectedWeightId);
    return sizeOption?.price ?? product?.price ?? 0;
  }, [product?.price, selectedWeightId]);

  const oldPrice = useMemo(
    () => Math.round(currentPrice * 1.15),
    [currentPrice]
  );

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, product.weight);
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (inWishlist) removeFromFavourites(product.id);
    else addToFavourites(product);
  };

  const handleShare = async () => {
    const shareUrl =
      typeof window !== 'undefined'
        ? window.location.href
        : 'https://rizwans-desighee.com';

    const text = product
      ? `${product.name} – Pure Desi Ghee from Rizwan's Desi Ghee`
      : "Rizwan's Desi Ghee";

    try {
      if (navigator.share) {
        await navigator.share({ title: product?.name ?? "Rizwan's Desi Ghee", text, url: shareUrl });
        return;
      }
    } catch {
      // Fall through
    }

    try {
      await navigator.clipboard?.writeText?.(shareUrl);
      alert('Product link copied to clipboard.');
    } catch {
      alert('Share not supported in this browser.');
    }
  };

  const formattedWeightList = WEIGHT_OPTIONS.map((w) => w.label).join(', ');
  const sku = product ? `RDG-${product.id}-${activeWeight.label.replace(/\s/g, '')}` : 'RDG-N/A';
  const variants = WEIGHT_OPTIONS.map((w) => ({ id: w.id, label: w.label, image: w.image }));

  if (loading || !product) {
    return (
      <section className="border-t border-[#E6B65C]/20 bg-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center py-12 text-[#6B4A1E]/70">
            {loading ? 'Loading featured product…' : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-[#E6B65C]/20 bg-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Product image slider */}
          <div className="relative flex flex-col items-center">
            <div className="relative w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-2xl">
              <div className="absolute right-4 top-4 flex h-10 items-center rounded-full bg-[#ff6b35] px-4 text-xs font-semibold uppercase tracking-wide text-white">
                -13%
              </div>

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
                    className={`h-4 w-4 ${inWishlist ? 'fill-[#E6B65C] text-[#E6B65C]' : ''}`}
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

              <ProductImageSlider
                selectedSizeId={selectedWeightId}
                onChangeSelectedSize={setSelectedWeightId}
                productName={product.name}
                variants={variants}
              />
            </div>
          </div>

          {/* Right: Product details */}
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-[#6B4A1E] sm:text-3xl lg:text-4xl">
              {product.name} | 30 Days Money Back Guarantee
            </h2>

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

            <p className="text-sm text-gray-500">Shipping calculated at checkout.</p>

            <p className="text-sm leading-relaxed text-[#6B4A1E]/80">
              {product.description ||
                "Crafted in small batches from premium cow butter, our pure desi ghee delivers the authentic taste and aroma Pakistani kitchens love."}
            </p>

            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Weight: {activeWeight.label}
            </div>

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

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                  className={`h-4 w-4 ${inWishlist ? 'fill-[#E6B65C] text-[#E6B65C]' : ''}`}
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
                {product.weight || 'Pure Desi Ghee'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
