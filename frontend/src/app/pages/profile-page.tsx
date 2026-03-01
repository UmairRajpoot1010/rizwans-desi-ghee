import { useEffect, useState } from 'react'
import { useApp } from '@/app/context/app-context'
import { ordersApi, authApi } from '@/lib/api'
import { ChevronRight, Edit2, LogOut, Check, X, User as UserIcon, MapPin, Phone, Mail, Package } from 'lucide-react'

export function ProfilePage() {
  const {
    user,
    isAuthenticated,
    setCurrentPage,
    logout,
    updateUser,
    setHasNewOrder,
    setIsAuthOpen,
    setAuthMode,
  } = useApp() as any
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
  })
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    setHasNewOrder(false)
  }, [setHasNewOrder])

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (!isAuthenticated) return
    setLoading(true)
    ordersApi
      .getMy()
      .then((res) => {
        if (res.data?.success) setOrders(res.data.data || [])
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleEditProfile = async () => {
    if (!editForm.name.trim()) return;
    setSavingProfile(true)
    try {
      const addressObj = {
        street: editForm.address,
        city: editForm.city,
        state: editForm.state
      };

      const res = await authApi.updateProfile({
        name: editForm.name,
        phone: editForm.phone,
        address: addressObj
      });

      if (res.data.success && res.data.data) {
        updateUser(res.data.data);
        setIsEditingProfile(false);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false)
    }
  }

  const handleOrderClick = (orderId: string) => {
    setCurrentPage('order-detail', { orderId })
    window.scrollTo(0, 0)
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout()
      setCurrentPage('home')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-20 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-[#E6B65C]/30 text-center max-w-md w-full mx-4">
          <UserIcon className="w-16 h-16 text-[#E6B65C] mx-auto mb-4" />
          <h2 className="text-3xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Authentication Required</h2>
          <p className="text-[#6B4A1E]/70 mb-6">Please log in to view and manage your profile.</p>
          <button
            onClick={() => {
              setAuthMode('login')
              setIsAuthOpen(true)
            }}
            className="w-full bg-[#5F6B3C] text-white py-3 rounded-xl hover:bg-[#4A542E] transition-all shadow-md font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 md:py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#E6B65C]/10 rounded-full blur-3xl mix-blend-multiply opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-[#5F6B3C]/5 rounded-full blur-3xl mix-blend-multiply opacity-70 pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl text-[#5F6B3C] font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              My Account
            </h2>
            <p className="text-[#6B4A1E]/70 mt-2 text-sm md:text-base">Manage your personal information and orders</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/50 border border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm text-sm font-medium backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-white/50 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#5F6B3C] to-[#E6B65C]"></div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#5F6B3C]/10 rounded-xl text-[#5F6B3C]">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Profile Details
                  </h3>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="p-2 bg-white rounded-full shadow-sm hover:shadow-md border border-gray-100 transition-all text-[#5F6B3C] hover:text-[#E6B65C]"
                    title="Edit Profile"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {!isEditingProfile ? (
                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/50 transition-colors">
                    <UserIcon className="w-5 h-5 text-[#E6B65C] mt-0.5" />
                    <div>
                      <p className="text-xs text-[#6B4A1E]/60 uppercase tracking-wider font-semibold mb-1">Full Name</p>
                      <p className="font-medium text-[#6B4A1E] text-base">{user?.name || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/50 transition-colors">
                    <Mail className="w-5 h-5 text-[#E6B65C] mt-0.5" />
                    <div>
                      <p className="text-xs text-[#6B4A1E]/60 uppercase tracking-wider font-semibold mb-1">Email Address</p>
                      <p className="font-medium text-[#6B4A1E] text-sm break-all">{user?.email || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/50 transition-colors">
                    <Phone className="w-5 h-5 text-[#E6B65C] mt-0.5" />
                    <div>
                      <p className="text-xs text-[#6B4A1E]/60 uppercase tracking-wider font-semibold mb-1">Phone Number</p>
                      <p className="font-medium text-[#6B4A1E] text-base">{user?.phone || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/50 transition-colors border-t border-gray-100 pt-5 mt-2">
                    <MapPin className="w-5 h-5 text-[#E6B65C] mt-0.5" />
                    <div className="w-full">
                      <p className="text-xs text-[#6B4A1E]/60 uppercase tracking-wider font-semibold mb-1">Default Address</p>
                      {user?.address?.street ? (
                        <div className="text-sm text-[#6B4A1E] mt-1 space-y-1">
                          <p className="font-medium">{user.address.street}</p>
                          <p>{user.address.city}{user.address.state ? `, ${user.address.state}` : ''}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No address provided</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-white/40 p-5 rounded-2xl border border-white">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B4A1E]/70 uppercase tracking-wider mb-1.5 ml-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-[#E6B65C]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F6B3C]/20 focus:border-[#5F6B3C] text-[#6B4A1E] transition-all shadow-sm"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B4A1E]/70 uppercase tracking-wider mb-1.5 ml-1">Email (Cannot be changed)</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B4A1E]/70 uppercase tracking-wider mb-1.5 ml-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-[#E6B65C]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F6B3C]/20 focus:border-[#5F6B3C] text-[#6B4A1E] transition-all shadow-sm"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="pt-2 border-t border-[#E6B65C]/10 mt-2">
                    <label className="block text-xs font-semibold text-[#6B4A1E]/70 uppercase tracking-wider mb-1.5 ml-1">Street Address</label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-[#E6B65C]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F6B3C]/20 focus:border-[#5F6B3C] text-[#6B4A1E] transition-all shadow-sm mb-3"
                      placeholder="Street address"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#6B4A1E]/70 uppercase tracking-wider mb-1.5 ml-1">City</label>
                        <input
                          type="text"
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-[#E6B65C]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F6B3C]/20 focus:border-[#5F6B3C] text-[#6B4A1E] transition-all shadow-sm"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#6B4A1E]/70 uppercase tracking-wider mb-1.5 ml-1">State\Province</label>
                        <input
                          type="text"
                          value={editForm.state}
                          onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-[#E6B65C]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5F6B3C]/20 focus:border-[#5F6B3C] text-[#6B4A1E] transition-all shadow-sm"
                          placeholder="State"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditProfile}
                      disabled={savingProfile || !editForm.name.trim()}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#5F6B3C] to-[#4A542E] text-white py-2.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60 disabled:hover:scale-100 shadow-md font-medium"
                    >
                      {savingProfile ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Check className="w-4 h-4" /> Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-8">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border border-white/50 h-full">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#E6B65C]/20">
                <div className="p-2.5 bg-[#E6B65C]/10 rounded-xl text-[#E6B65C]">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Order History
                  </h3>
                  <p className="text-sm text-[#6B4A1E]/60">Track, edit, or cancel your orders</p>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-12 h-12 border-4 border-[#E6B65C]/20 border-t-[#5F6B3C] rounded-full animate-spin mb-4"></div>
                  <p className="text-[#6B4A1E]/70 font-medium">Loading your orders...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center flex flex-col items-center justify-center">
                  <X className="w-8 h-8 mb-2 opacity-50" />
                  <p className="font-medium">{error}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-white/40 rounded-2xl border border-dashed border-[#E6B65C]/30 flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Package className="w-10 h-10 text-[#E6B65C]/50" />
                  </div>
                  <h4 className="text-lg font-bold text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>No orders found</h4>
                  <p className="text-[#6B4A1E]/60 max-w-sm mb-6">Looks like you haven't placed any orders yet. Discover our premium organic desi ghee.</p>
                  <button
                    onClick={() => setCurrentPage('shop')}
                    className="bg-[#E6B65C] text-[#6B4A1E] px-8 py-3 rounded-xl font-bold hover:bg-[#DDA94B] transition-colors shadow-md hover:shadow-lg"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o: any) => {
                    const statusColor =
                      o.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                        o.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                          o.status === 'shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            'bg-orange-100 text-orange-700 border-orange-200';

                    const dateStr = new Date(o.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

                    return (
                      <button
                        key={o._id}
                        onClick={() => handleOrderClick(o._id)}
                        className="w-full text-left p-5 border border-white bg-white/40 rounded-2xl hover:border-[#E6B65C]/50 hover:bg-white/80 transition-all duration-300 group shadow-sm hover:shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 relative overflow-hidden"
                      >
                        {/* Hover accent left border */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E6B65C] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex-1 min-w-0 pl-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-lg text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>#{o._id?.slice(-6).toUpperCase()}</span>
                            <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-md border ${statusColor}`}>
                              {o.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6B4A1E]/70 font-medium">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#E6B65C]"></div>
                              {dateStr}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#E6B65C]"></div>
                              {o.items?.length || 0} Item{(o.items?.length || 0) !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pt-4 sm:pt-0 border-t sm:border-t-0 border-[#E6B65C]/10">
                          <div className="text-left sm:text-right">
                            <div className="text-xs text-[#6B4A1E]/50 uppercase tracking-widest font-semibold mb-0.5">Total</div>
                            <div className="text-xl font-bold text-[#5F6B3C]">
                              Rs {(o.totalAmount || 0).toLocaleString('en-PK')}
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-[#5F6B3C] group-hover:text-white transition-colors border border-gray-100 text-[#5F6B3C]">
                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
