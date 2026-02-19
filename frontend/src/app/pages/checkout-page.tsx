import { useState } from 'react';
import { CheckCircle, CreditCard, Truck } from 'lucide-react';
import { useApp } from '@/app/context/app-context';

export function CheckoutPage() {
  const { cart, setCurrentPage } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryCharges = subtotal > 2000 ? 0 : 50;
  const total = subtotal + deliveryCharges;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to backend
    alert('Order placed successfully! Thank you for your purchase.');
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  if (cart.length === 0) {
    setCurrentPage('cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#5F6B3C] to-[#6B4A1E] py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl text-white text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Checkout
          </h1>
          <p className="text-white/90 text-center text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Complete your order
          </p>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <form onSubmit={handlePlaceOrder}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left - Shipping & Payment Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Information */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E6B65C]/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#5F6B3C] rounded-full flex items-center justify-center text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      1
                    </div>
                    <h2 className="text-2xl text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Shipping Information
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[#6B4A1E] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E]"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-[#6B4A1E] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E]"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-[#6B4A1E] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E]"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="Enter pincode"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[#6B4A1E] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-6 py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E] resize-none"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="House No., Street, Area"
                      />
                    </div>

                    <div>
                      <label className="block text-[#6B4A1E] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E]"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="block text-[#6B4A1E] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E]"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E6B65C]/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#5F6B3C] rounded-full flex items-center justify-center text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      2
                    </div>
                    <h2 className="text-2xl text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Cash on Delivery */}
                    <label className={`flex items-start gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod' 
                        ? 'border-[#5F6B3C] bg-[#5F6B3C]/5' 
                        : 'border-[#E6B65C]/20 hover:border-[#E6B65C]'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 w-5 h-5 accent-[#5F6B3C]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Truck className="w-6 h-6 text-[#5F6B3C]" />
                          <h3 className="text-lg text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Cash on Delivery
                          </h3>
                        </div>
                        <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Pay when you receive your order at home
                        </p>
                      </div>
                      {paymentMethod === 'cod' && (
                        <CheckCircle className="w-6 h-6 text-[#5F6B3C]" />
                      )}
                    </label>

                    {/* Online Payment */}
                    <label className={`flex items-start gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'online' 
                        ? 'border-[#5F6B3C] bg-[#5F6B3C]/5' 
                        : 'border-[#E6B65C]/20 hover:border-[#E6B65C]'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 w-5 h-5 accent-[#5F6B3C]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CreditCard className="w-6 h-6 text-[#5F6B3C]" />
                          <h3 className="text-lg text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Online Payment
                          </h3>
                        </div>
                        <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Pay online via bank transfer and upload your payment proof
                        </p>

                        {paymentMethod === 'online' && (
                          <div className="mt-4 space-y-4">
                            <div className="rounded-2xl bg-[#FAF7F2] border border-[#E6B65C]/40 p-4 text-sm text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              <p className="font-semibold mb-1">Account Details</p>
                              <p>MUHAMMAD RIZWAN</p>
                              <p>60010106902027</p>
                              <p>PK49MEZN0060010106902027</p>
                              <p>LODHRAN BRANCH</p>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Upload payment screenshot
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] ?? null;
                                  setPaymentScreenshot(file);
                                }}
                                className="w-full cursor-pointer rounded-2xl border border-[#E6B65C]/30 bg-[#FAF7F2] px-4 py-3 text-sm text-[#6B4A1E] file:mr-4 file:rounded-full file:border-0 file:bg-[#5F6B3C] file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:text-white hover:border-[#5F6B3C]"
                              />
                              {paymentScreenshot && (
                                <p className="text-xs text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                  Selected file: {paymentScreenshot.name}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {paymentMethod === 'online' && (
                        <CheckCircle className="w-6 h-6 text-[#5F6B3C]" />
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Right - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E6B65C]/20 sticky top-24">
                  <h2 className="text-2xl text-[#6B4A1E] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Order Summary
                  </h2>

                  {/* Product List */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div 
                        key={`${item.id}-${item.selectedWeight}`}
                        className="flex gap-4 pb-4 border-b border-[#E6B65C]/20"
                      >
                        <div className="w-16 h-16 bg-[#FAF7F2] rounded-xl p-2">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[#6B4A1E] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {item.name}
                          </p>
                          <p className="text-xs text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {item.selectedWeight} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-[#6B4A1E]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          PKR {item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <span>Subtotal</span>
                      <span>PKR {subtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <span>Delivery</span>
                      <span>{deliveryCharges === 0 ? 'FREE' : `PKR ${deliveryCharges}`}</span>
                    </div>
                    <div className="border-t border-[#E6B65C]/20 pt-3">
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

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#5F6B3C] text-white rounded-full hover:bg-[#6B4A1E] transition-all shadow-lg"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Place Order
                  </button>

                  <p className="text-xs text-[#6B4A1E]/60 text-center mt-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    By placing your order, you agree to our terms and conditions
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
