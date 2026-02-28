import { useEffect, useState } from 'react';
import { ChevronLeft, Truck, Clock, CheckCircle, AlertCircle, XCircle, Edit2, Play, Check, X, Package } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { ordersApi } from '@/lib/api';

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const { setCurrentPage } = useApp();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit & Cancel States
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [savingShipping, setSavingShipping] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await ordersApi.getById(orderId);
      if (res.data?.success && res.data?.data) {
        setOrder(res.data.data);
        const ship: any = res.data.data.shippingAddress || {};
        setShippingForm({
          name: ship.name || '',
          phone: ship.phone || '',
          address: ship.address || '',
          city: ship.city || '',
          state: ship.state || '',
          zipCode: ship.zipCode || '',
        });
      } else {
        setError(res.data?.message || 'Order not found');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is required');
      setLoading(false);
      return;
    }
    fetchOrder();
  }, [orderId]);

  const canEditOrCancel = order?.status === 'pending' || order?.status === 'processing';

  const handleUpdateShipping = async () => {
    if (!shippingForm.name || !shippingForm.address || !shippingForm.phone) {
      alert('Please fill out all required fields');
      return;
    }

    setSavingShipping(true);
    try {
      const res = await ordersApi.updateOrderShipping(orderId, shippingForm);
      if (res.data?.success) {
        setIsEditingShipping(false);
        await fetchOrder(); // refresh order data
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update shipping details');
    } finally {
      setSavingShipping(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you absolutely sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setCancellingOrder(true);
    try {
      const res = await ordersApi.cancelOrder(orderId);
      if (res.data?.success) {
        alert('Order has been cancelled and removed.');
        setCurrentPage('profile'); // Redirect back to profile as the order no longer exists
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingOrder(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'processing':
        return <Play className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100/50 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100/50 text-red-800 border-red-200';
      case 'shipped':
        return 'bg-blue-100/50 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-orange-100/50 text-orange-800 border-orange-200';
      case 'pending':
        return 'bg-yellow-100/50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100/50 text-gray-800 border-gray-200';
    }
  };

  const getPaymentVerificationColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100/50 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100/50 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100/50 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 border-4 border-[#E6B65C]/30 border-t-[#5F6B3C] rounded-full animate-spin"></div>
          </div>
          <p className="text-[#6B4A1E] font-medium">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-12 flex flex-col items-center">
        <div className="container mx-auto px-4 max-w-lg">
          <button
            onClick={() => setCurrentPage('profile')}
            className="flex items-center gap-2 text-[#5F6B3C] hover:text-[#6B4A1E] mb-6 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Profile
          </button>
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-red-100">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
            <h2 className="text-2xl font-bold text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Order Not Found</h2>
            <p className="text-[#6B4A1E]/70">{error || 'Unable to load order details'}</p>
          </div>
        </div>
      </div>
    );
  }

  const orderTotal = order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 md:py-16 relative w-full">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full max-w-[40rem] h-[40rem] bg-[#E6B65C]/5 rounded-full blur-3xl mix-blend-multiply opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-6xl">
        <div className="mb-6 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={() => setCurrentPage('profile')}
            className="flex items-center gap-2 text-[#5F6B3C] bg-white/50 px-4 py-2 rounded-xl hover:bg-white border border-[#E6B65C]/20 transition-all font-medium shadow-sm backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Orders
          </button>

          {canEditOrCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={cancellingOrder}
              className="flex items-center gap-2 border border-red-200 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all font-medium shadow-sm"
            >
              {cancellingOrder ? (
                <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {cancellingOrder ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#5F6B3C] to-[#E6B65C]"></div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="pl-2">
                  <p className="text-xs uppercase tracking-widest font-bold text-[#6B4A1E]/50 mb-1">
                    Order Reference
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    #{order._id?.slice(-8).toUpperCase()}
                  </h1>
                </div>
                <div className="text-left sm:text-right pl-2 sm:pl-0">
                  <p className="text-xs uppercase tracking-widest font-bold text-[#6B4A1E]/50 mb-1">
                    Date Placed
                  </p>
                  <p className="text-[#6B4A1E] font-medium text-lg">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-[#E6B65C]/10 flex flex-wrap gap-3 pl-2">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>

                {order.paymentMethod === 'ONLINE' && order.paymentVerificationStatus && (
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold border ${getPaymentVerificationColor(order.paymentVerificationStatus)}`}>
                    Payment: {order.paymentVerificationStatus.charAt(0).toUpperCase() + order.paymentVerificationStatus.slice(1)}
                  </div>
                )}
                {order.paymentMethod === 'COD' && order.paymentStatus && (
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold border ${order.paymentStatus === 'paid' ? 'bg-green-100/50 text-green-800 border-green-200' : 'bg-yellow-100/50 text-yellow-800 border-yellow-200'}`}>
                    Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#5F6B3C]/10 rounded-xl text-[#5F6B3C]">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Delivery Details
                  </h2>
                </div>

                {canEditOrCancel && !isEditingShipping && (
                  <button
                    onClick={() => setIsEditingShipping(true)}
                    className="p-2 border border-gray-200 rounded-full hover:border-[#5F6B3C] hover:text-[#5F6B3C] text-gray-500 transition-colors shadow-sm bg-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {!isEditingShipping ? (
                <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                  <div className="space-y-1.5 text-[#6B4A1E]">
                    <p className="font-bold text-lg mb-2">{order.shippingAddress?.name}</p>
                    <p>{order.shippingAddress?.address}</p>
                    <p>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                    </p>
                    <div className="flex gap-6 mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#6B4A1E]/50 font-bold mb-1">Phone</p>
                        <p className="font-medium text-sm">{order.shippingAddress?.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-[#6B4A1E]/50 font-bold mb-1">Email</p>
                        <p className="font-medium text-sm">{order.shippingAddress?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FAF7F2]/50 p-5 rounded-2xl border border-[#E6B65C]/30 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#6B4A1E]/70 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={shippingForm.name}
                        onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#5F6B3C]/20 focus:border-[#5F6B3C] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#6B4A1E]/70 mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#5F6B3C]/20 focus:border-[#5F6B3C] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#6B4A1E]/70 mb-1.5">Complete Address</label>
                    <input
                      type="text"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#5F6B3C]/20 focus:border-[#5F6B3C] outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#6B4A1E]/70 mb-1.5">City</label>
                      <input
                        type="text"
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#5F6B3C]/20 focus:border-[#5F6B3C] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#6B4A1E]/70 mb-1.5">State</label>
                      <input
                        type="text"
                        value={shippingForm.state}
                        onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#5F6B3C]/20 focus:border-[#5F6B3C] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#6B4A1E]/70 mb-1.5">Zip Code</label>
                      <input
                        type="text"
                        value={shippingForm.zipCode}
                        onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#5F6B3C]/20 focus:border-[#5F6B3C] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setIsEditingShipping(false)}
                      className="flex-1 border-2 border-gray-200 bg-white text-gray-600 rounded-xl py-2.5 font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateShipping}
                      disabled={savingShipping}
                      className="flex-1 bg-[#5F6B3C] text-white rounded-xl py-2.5 font-medium hover:bg-[#4A542E] transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {savingShipping ? 'Saving...' : <><Check className="w-4 h-4" /> Save Details</>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#E6B65C]/10 rounded-xl text-[#E6B65C]">
                  <Package className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Items Ordered
                </h2>
              </div>

              <div className="space-y-4">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-[#E6B65C]/30 transition-all">
                    {item.product?.images?.[0] ? (
                      <div className="w-20 h-20 bg-[#FAF7F2] rounded-xl p-2 flex-shrink-0 mx-auto sm:mx-0 border border-[#E6B65C]/10">
                        <img
                          src={item.product.images[0]}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-[#FAF7F2] rounded-xl flex items-center justify-center text-[#E6B65C]/30 border border-[#E6B65C]/10 mx-auto sm:mx-0">
                        <Package className="w-8 h-8" />
                      </div>
                    )}

                    <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                      <p className="font-bold text-[#6B4A1E] text-lg mb-1 leading-tight">
                        {item.product?.name || 'Unknown Product'}
                      </p>
                      {item.size && (
                        <p className="text-xs uppercase tracking-wider font-semibold text-[#6B4A1E]/50 mb-1">
                          Size: {item.size}
                        </p>
                      )}

                      <div className="flex items-center justify-between sm:justify-start gap-4 mt-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <p className="text-sm font-semibold bg-gray-50 px-3 py-1 rounded-lg text-[#6B4A1E]">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-[#5F6B3C]">
                          Rs {item.price ? item.price.toLocaleString('en-PK') : '0'} each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#6B4A1E] text-[#FAF7F2] rounded-3xl p-6 md:p-8 shadow-2xl lg:sticky lg:top-24 relative overflow-hidden">
              {/* Card texture/pattern overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-6 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-white/80">
                    <span className="font-medium text-sm">Subtotal</span>
                    <span className="font-semibold text-white">Rs {orderTotal.toLocaleString('en-PK')}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/80">
                    <span className="font-medium text-sm">Delivery Fees</span>
                    <span className="font-semibold text-[#E6B65C]">{order.deliveryCharges === 0 ? 'FREE' : `Rs ${order.deliveryCharges}`}</span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-6 mb-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-[#E6B65C] font-bold">Total Amount</span>
                    <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight break-all" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Rs {(orderTotal + (order.deliveryCharges || 0)).toLocaleString('en-PK')}
                    </span>
                  </div>
                </div>

                <div className="bg-black/20 rounded-2xl p-4 space-y-4 border border-white/5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">Payment Method</p>
                    <p className="text-sm font-semibold text-white">
                      {order.paymentMethod === 'ONLINE' ? 'Bank Transfer' : 'Cash on Delivery'}
                    </p>
                  </div>

                  {order.trackingNumber && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">Tracking Number</p>
                      <p className="text-sm font-mono text-[#E6B65C] font-medium">{order.trackingNumber}</p>
                    </div>
                  )}

                  {order.shippingNotes && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">Notes</p>
                      <p className="text-sm text-white/80">{order.shippingNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
