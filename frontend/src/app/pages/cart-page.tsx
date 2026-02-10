import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '@/app/context/app-context';

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, setCurrentPage } = useApp();

  const subtotal = cart.reduce((total, item) => {
    const price = item.price;
    return total + (price * item.quantity);
  }, 0);

  const deliveryCharges = subtotal > 2000 ? 0 : 50;
  const total = subtotal + deliveryCharges;

  const handleProceedToCheckout = () => {
    setCurrentPage('checkout');
    window.scrollTo(0, 0);
  };

  const handleContinueShopping = () => {
    setCurrentPage('shop');
    window.scrollTo(0, 0);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-[#E6B65C]/10 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-12 h-12 text-[#E6B65C]" />
          </div>
          <h2 className="text-3xl text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your Cart is Empty
          </h2>
          <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Add some delicious desi ghee to your cart to get started!
          </p>
          <button
            onClick={handleContinueShopping}
            className="px-8 py-4 bg-[#5F6B3C] text-white rounded-full hover:bg-[#6B4A1E] transition-all"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#5F6B3C] to-[#6B4A1E] py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl text-white text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shopping Cart
          </h1>
          <p className="text-white/90 text-center text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Product List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div 
                  key={`${item.id}-${item.selectedWeight}`}
                  className="bg-white rounded-3xl p-6 shadow-lg border border-[#E6B65C]/20"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 bg-[#FAF7F2] rounded-2xl p-4 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-xl text-[#6B4A1E] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {item.name}
                        </h3>
                        <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Weight: {item.selectedWeight}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedWeight, item.quantity - 1)}
                            className="w-8 h-8 bg-[#FAF7F2] rounded-full border border-[#E6B65C]/20 flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Minus className="w-4 h-4 text-[#6B4A1E]" />
                          </button>
                          <span className="text-lg text-[#6B4A1E] w-8 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedWeight, item.quantity + 1)}
                            className="w-8 h-8 bg-[#FAF7F2] rounded-full border border-[#E6B65C]/20 flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Plus className="w-4 h-4 text-[#6B4A1E]" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl text-[#5F6B3C]" style={{ fontFamily: 'Playfair Display, serif' }}>
                            PKR {item.price * item.quantity}
                          </p>
                          <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            PKR {item.price} each
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedWeight)}
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E6B65C]/20 sticky top-24">
                <h2 className="text-2xl text-[#6B4A1E] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Subtotal
                    </span>
                    <span className="text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      PKR {subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Delivery Charges
                    </span>
                    <span className="text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {deliveryCharges === 0 ? 'FREE' : `PKR ${deliveryCharges}`}
                    </span>
                  </div>

                  {subtotal < 2000 && (
                    <p className="text-xs text-[#5F6B3C] bg-[#E6B65C]/10 p-3 rounded-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Add PKR {2000 - subtotal} more to get FREE delivery!
                    </p>
                  )}

                  <div className="border-t border-[#E6B65C]/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Total
                      </span>
                      <span className="text-3xl text-[#5F6B3C]" style={{ fontFamily: 'Playfair Display, serif' }}>
                        PKR {total}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#5F6B3C] text-white rounded-full hover:bg-[#6B4A1E] transition-all shadow-lg mb-4"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={handleContinueShopping}
                  className="w-full py-4 bg-white text-[#6B4A1E] rounded-full border-2 border-[#E6B65C] hover:bg-[#E6B65C]/10 transition-all"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
