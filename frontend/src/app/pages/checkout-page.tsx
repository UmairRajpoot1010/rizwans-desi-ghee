import { useState, useEffect } from 'react';
import { CheckCircle, CreditCard, Truck, Package } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { ordersApi, getErrorMessage } from '@/lib/api';
import { AxiosError } from 'axios';

export function CheckoutPage() {
  const { cart, setCurrentPage, isAuthenticated, user, clearCart, setSelectedOrderId, setHasNewOrder } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderPlacementStage, setOrderPlacementStage] = useState<'placing' | 'placed'>('placing');
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
  });

  const subtotal: number = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryCharges: number = 0;
  const total: number = subtotal + deliveryCharges;

  useEffect(() => {
    if (cart.length === 0) {
      setCurrentPage('cart');
    }
  }, [cart.length, setCurrentPage]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user?.name, user?.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setOrderError(null);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);
    if (!isAuthenticated) {
      setOrderError('Please log in to place an order.');
      return;
    }
    if (cart.length === 0) return;

    // Validation for online payment
    if (paymentMethod === 'online') {
      if (!paymentScreenshot) {
        setOrderError('Please upload payment screenshot for online payments.')
        return
      }
      const allowed = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowed.includes(paymentScreenshot.type)) {
        setOrderError('Screenshot must be an image (jpg/png/webp).')
        return
      }
    }

    setSubmitting(true);
    try {
      let base64Screenshot: string | null = null;
      if (paymentMethod === 'online' && paymentScreenshot) {
        base64Screenshot = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(paymentScreenshot);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      }

      const items = cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        size: item.selectedWeight,
      }));
      const shippingAddress = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.pincode.trim(),
      };

      const res = await ordersApi.create(
        items,
        shippingAddress,
        paymentMethod === 'online' ? 'online' : 'cod',
        base64Screenshot
      );
      const payload = res.data;
      if (payload?.success) {

        clearCart();
        setPaymentScreenshot(null);
        setHasNewOrder(true);

        // Capture order ID and show placement stages
        setLastOrderId(payload.data?._id || null);
        setOrderPlacementStage('placing');
        setShowSuccess(true);

        // Transition from "placing" to "placed" after 1.5 seconds
        window.setTimeout(() => {
          setOrderPlacementStage('placed');
          // Auto-vanish after 8 seconds if not clicked
          window.setTimeout(() => {
            setShowSuccess(false);
          }, 8000);
        }, 1500);

        return;
      }
      setOrderError(payload?.message ?? 'Order failed. Please try again.');
    } catch (err) {
      const msg = err instanceof AxiosError ? getErrorMessage(err) : 'Order failed. Please try again.';
      setOrderError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <section className="bg-gradient-to-r from-[#5F6B3C] to-[#6B4A1E] py-8 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h1
            className="text-2xl md:text-4xl lg:text-5xl text-white text-center mb-2 md:mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Checkout
          </h1>
          <p
            className="text-white/90 text-center text-sm md:text-lg"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Complete your order
          </p>
        </div>
      </section>

      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {!isAuthenticated && (
            <div className="mb-4 md:mb-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 md:px-6 py-3 md:py-4 text-amber-800 text-xs md:text-sm">
              Please log in to place your order.
            </div>
          )}

          {orderError && (
            <div className="mb-4 md:mb-6 rounded-2xl bg-red-50 border border-red-200 px-4 md:px-6 py-3 md:py-4 text-red-700 text-xs md:text-sm">
              {orderError}
            </div>
          )}

          <form onSubmit={handlePlaceOrder}>
            <div className="grid md:grid-cols-3 gap-4 md:gap-8">
              <div className="md:col-span-2 space-y-4 md:space-y-8">
                <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg border border-[#E6B65C]/20">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div
                      className="w-8 h-8 md:w-10 md:h-10 bg-[#5F6B3C] rounded-full flex items-center justify-center text-white text-xs md:text-base"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      1
                    </div>
                    <h2
                      className="text-lg md:text-2xl text-[#6B4A1E]"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      Shipping Information
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 md:gap-6">
                    <div className="sm:col-span-2">
                      <label
                        className="block text-xs md:text-base text-[#6B4A1E] mb-2"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 md:px-6 py-2 md:py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-lg md:rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E] text-sm md:text-base"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        className="block text-xs md:text-base text-[#6B4A1E] mb-2"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 md:px-6 py-2 md:py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-lg md:rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E] text-sm md:text-base"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs md:text-base text-[#6B4A1E] mb-2"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 md:px-6 py-2 md:py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-lg md:rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E] text-sm md:text-base"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs md:text-base text-[#6B4A1E] mb-2"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Pincode / Zip Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 md:px-6 py-2 md:py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-lg md:rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E] text-sm md:text-base"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="Enter pincode"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        className="block text-xs md:text-base text-[#6B4A1E] mb-2"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 md:px-6 py-2 md:py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-lg md:rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E] resize-none text-sm md:text-base"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="House No., Street, Area"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs md:text-base text-[#6B4A1E] mb-2"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 md:px-6 py-2 md:py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-lg md:rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E] text-sm md:text-base"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs md:text-base text-[#6B4A1E] mb-2"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 md:px-6 py-2 md:py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-lg md:rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E] text-sm md:text-base"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg border border-[#E6B65C]/20">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div
                      className="w-8 h-8 md:w-10 md:h-10 bg-[#5F6B3C] rounded-full flex items-center justify-center text-white text-xs md:text-base"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      2
                    </div>
                    <h2
                      className="text-lg md:text-2xl text-[#6B4A1E]"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <label
                      className={`flex items-start gap-3 md:gap-4 p-3 md:p-6 rounded-lg md:rounded-2xl border-2 cursor-pointer transition-all text-sm md:text-base ${paymentMethod === 'cod'
                        ? 'border-[#5F6B3C] bg-[#5F6B3C]/5'
                        : 'border-[#E6B65C]/20 hover:border-[#E6B65C]'
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 w-4 h-4 md:w-5 md:h-5 accent-[#5F6B3C] flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                          <Truck className="w-4 h-4 md:w-6 md:h-6 text-[#5F6B3C] flex-shrink-0" />
                          <h3
                            className="text-sm md:text-lg text-[#6B4A1E]"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            Cash on Delivery
                          </h3>
                        </div>
                        <p
                          className="text-xs md:text-sm text-[#6B4A1E]/60"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          Pay when you receive your order at home
                        </p>
                      </div>
                      {paymentMethod === 'cod' && (
                        <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-[#5F6B3C] flex-shrink-0" />
                      )}
                    </label>

                    <label
                      className={`flex items-start gap-3 md:gap-4 p-3 md:p-6 rounded-lg md:rounded-2xl border-2 cursor-pointer transition-all text-sm md:text-base ${paymentMethod === 'online'
                        ? 'border-[#5F6B3C] bg-[#5F6B3C]/5'
                        : 'border-[#E6B65C]/20 hover:border-[#E6B65C]'
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 w-4 h-4 md:w-5 md:h-5 accent-[#5F6B3C] flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                          <CreditCard className="w-4 h-4 md:w-6 md:h-6 text-[#5F6B3C] flex-shrink-0" />
                          <h3
                            className="text-sm md:text-lg text-[#6B4A1E]"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            Online Payment
                          </h3>
                        </div>
                        <p
                          className="text-xs md:text-sm text-[#6B4A1E]/60"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          Pay online via bank transfer and upload your payment proof
                        </p>

                        {paymentMethod === 'online' && (
                          <div className="mt-4 space-y-4">
                            <div
                              className="rounded-2xl bg-[#FAF7F2] border border-[#E6B65C]/40 p-4 text-sm text-[#6B4A1E]"
                              style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                              <p className="font-semibold mb-1">Account Details</p>
                              <p>MUHAMMAD RIZWAN</p>
                              <p>60010106902027</p>
                              <p>PK49MEZN0060010106902027</p>
                              <p>LODHRAN BRANCH</p>
                            </div>

                            <div className="space-y-2">
                              <label
                                className="block text-[#6B4A1E]"
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                              >
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
                                <p
                                  className="text-xs text-[#6B4A1E]/60"
                                  style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
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

              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E6B65C]/20 sticky top-24">
                  <h2
                    className="text-2xl text-[#6B4A1E] mb-6"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.cartItemId}
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
                          <p
                            className="text-sm text-[#6B4A1E] mb-1"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {item.name}
                          </p>
                          <p
                            className="text-xs text-[#6B4A1E]/60"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {item.selectedWeight} × {item.quantity}
                          </p>
                        </div>
                        <p
                          className="text-[#6B4A1E]"
                          style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                          PKR {(item.price * item.quantity).toLocaleString('en-PK')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div
                      className="flex justify-between text-[#6B4A1E]/70"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      <span>Subtotal</span>
                      <span>PKR {subtotal.toLocaleString('en-PK')}</span>
                    </div>
                    <div
                      className="flex justify-between text-[#6B4A1E]/70"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      <span>Delivery</span>
                      <span>
                        {deliveryCharges === 0 ? 'FREE' : `PKR ${deliveryCharges.toLocaleString('en-PK')}`}
                      </span>
                    </div>
                    <div className="border-t border-[#E6B65C]/20 pt-3">
                      <div className="flex justify-between items-center">
                        <span
                          className="text-xl text-[#6B4A1E]"
                          style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                          Total
                        </span>
                        <span
                          className="text-3xl text-[#5F6B3C]"
                          style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                          PKR {total.toLocaleString('en-PK')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !isAuthenticated}
                    className="w-full py-4 bg-[#5F6B3C] text-white rounded-full hover:bg-[#6B4A1E] transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {submitting ? 'Placing Order…' : 'Place Order'}
                  </button>

                  <p
                    className="text-xs text-[#6B4A1E]/60 text-center mt-4"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    By placing your order, you agree to our terms and conditions
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
      {/* Order success modal - Multi-stage popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowSuccess(false)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in zoom-in">
            {orderPlacementStage === 'placing' ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 border-4 border-[#5F6B3C]/20 border-t-[#5F6B3C] rounded-full animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>Placing Order...</h3>
                <p className="text-sm text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>Please wait while we secure your ghee.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Order Placed!</h3>
                  <p className="text-sm text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>Thank you for choosing purity. Your order is confirmed.</p>
                </div>

                {lastOrderId && (
                  <div className="bg-[#FAF7F2] py-2 px-4 rounded-full border border-[#E6B65C]/20 inline-block">
                    <p className="text-xs font-mono font-bold text-[#5F6B3C]">#{lastOrderId.slice(-8).toUpperCase()}</p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowSuccess(false);
                      if (lastOrderId) {
                        setSelectedOrderId(lastOrderId);
                        setCurrentPage('order-detail');
                      } else {
                        setCurrentPage('profile');
                      }
                      window.scrollTo(0, 0);
                    }}
                    className="w-full py-4 bg-[#5F6B3C] text-white rounded-full hover:bg-[#6B4A1E] transition-all font-bold shadow-lg flex items-center justify-center gap-2 group"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    <Package className="w-5 h-5 transition-transform group-hover:scale-110" />
                    See Order Details
                  </button>
                </div>

                <p className="text-[10px] text-[#6B4A1E]/40" style={{ fontFamily: 'Poppins, sans-serif' }}>Closing automatically in a moment...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
