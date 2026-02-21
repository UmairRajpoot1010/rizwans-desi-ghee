import { useEffect, useState } from 'react';
import { ChevronLeft, Truck, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { ordersApi } from '@/lib/api';

export function OrderDetailPage({ orderId }: { orderId: string }) {
  const { setCurrentPage } = useApp();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is required');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await ordersApi.getById(orderId);
        if (res.data?.success && res.data?.data) {
          setOrder(res.data.data);
        } else {
          setError(res.data?.message || 'Order not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'processing':
        return <Clock className="w-6 h-6 text-orange-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentVerificationColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <svg className="spinner h-12 w-12 text-[#5F6B3C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-[#6B4A1E]">Loading order details...</p>
          <style jsx>{`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
            .spinner {
              animation: spin 1s linear infinite;
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setCurrentPage('profile')}
            className="flex items-center gap-2 text-[#5F6B3C] hover:text-[#6B4A1E] mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Profile
          </button>
          <div className="bg-white rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl text-[#6B4A1E] mb-2">Order Not Found</h2>
            <p className="text-[#6B4A1E]/70">{error || 'Unable to load order details'}</p>
          </div>
        </div>
      </div>
    );
  }

  const orderTotal = order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <button
          onClick={() => setCurrentPage('profile')}
          className="flex items-center gap-2 text-[#5F6B3C] hover:text-[#6B4A1E] mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Orders
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Order #
                  </p>
                  <h1 className="text-2xl font-bold text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {order._id?.slice(-8)}
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Placed on
                  </p>
                  <p className="text-[#6B4A1E] font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="border-t border-[#E6B65C]/20 pt-4 flex flex-wrap gap-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
                {order.paymentMethod === 'ONLINE' && order.paymentVerificationStatus && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getPaymentVerificationColor(order.paymentVerificationStatus)}`}>
                    Payment: {order.paymentVerificationStatus.charAt(0).toUpperCase() + order.paymentVerificationStatus.slice(1)}
                  </div>
                )}
                {order.paymentMethod === 'COD' && order.paymentStatus && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-[#6B4A1E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Shipping Address
              </h2>
              <div className="space-y-2 text-[#6B4A1E]">
                <p className="font-semibold">{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                </p>
                <p className="text-sm">Phone: {order.shippingAddress?.phone}</p>
                <p className="text-sm">Email: {order.shippingAddress?.email}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-[#6B4A1E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b border-[#E6B65C]/20 last:border-0">
                    {item.product?.images?.[0] && (
                      <div className="w-20 h-20 bg-[#FAF7F2] rounded-xl p-2 flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-[#6B4A1E]">
                        {item.product?.name || 'Unknown Product'}
                      </p>
                      <p className="text-sm text-[#6B4A1E]/70">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-[#5F6B3C] mt-1">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h2 className="text-lg font-semibold text-[#6B4A1E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#6B4A1E]">
                  <span>Subtotal</span>
                  <span>PKR {orderTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6B4A1E]/70">
                  <span>Delivery</span>
                  <span>{order.deliveryCharges === 0 ? 'FREE' : `PKR ${order.deliveryCharges}`}</span>
                </div>
                <div className="border-t border-[#E6B65C]/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#6B4A1E]">Total</span>
                    <span className="text-2xl font-bold text-[#5F6B3C]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      PKR {(orderTotal + (order.deliveryCharges || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-6 border-t border-[#E6B65C]/20">
                <p className="text-sm font-semibold text-[#6B4A1E]">Payment Method</p>
                <p className="text-sm text-[#6B4A1E]/70">
                  {order.paymentMethod === 'ONLINE' ? 'Online Transfer' : 'Cash on Delivery'}
                </p>
              </div>

              {order.trackingNumber && (
                <div className="space-y-2 mt-4 pt-4 border-t border-[#E6B65C]/20">
                  <p className="text-sm font-semibold text-[#6B4A1E]">Tracking Number</p>
                  <p className="text-sm font-mono text-[#5F6B3C]">{order.trackingNumber}</p>
                </div>
              )}

              {order.shippingNotes && (
                <div className="space-y-2 mt-4 pt-4 border-t border-[#E6B65C]/20">
                  <p className="text-sm font-semibold text-[#6B4A1E]">Shipping Notes</p>
                  <p className="text-sm text-[#6B4A1E]/70">{order.shippingNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
