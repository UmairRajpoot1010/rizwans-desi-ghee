import { useEffect, useState } from 'react'
import { useApp } from '@/app/context/app-context'
import { ordersApi } from '@/lib/api'
import { ChevronRight, Edit2, LogOut, Check, X } from 'lucide-react'

export function ProfilePage() {
  const { user, isAuthenticated, setCurrentPage, logout, setSelectedOrderId } = useApp() as any
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
  })
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    setCurrentPage('profile')
  }, [setCurrentPage])

  useEffect(() => {
    if (user) {
      setEditForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }))
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
    // For now, profile editing is UI only. In production, you'd send to backend
    setSavingProfile(true)
    try {
      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsEditingProfile(false)
    } finally {
      setSavingProfile(false)
    }
  }

  const handleOrderClick = (orderId: string) => {
    setSelectedOrderId(orderId)
    setCurrentPage('order-detail')
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
      <div className="min-h-screen bg-[#FAF7F2] py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl text-[#6B4A1E] mb-4">Profile</h2>
          <p className="text-[#6B4A1E]/70">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-6 md:py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-2xl md:text-4xl text-[#5F6B3C] mb-6 md:mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          My Profile
        </h2>

        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-[#E6B65C]/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-[#6B4A1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Profile Info
                </h3>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="p-2 hover:bg-[#FAF7F2] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 md:w-5 md:h-5 text-[#5F6B3C]" />
                  </button>
                )}
              </div>

              {!isEditingProfile ? (
                <div className="space-y-3 md:space-y-4 text-[#6B4A1E]">
                  <div>
                    <p className="text-xs md:text-sm text-[#6B4A1E]/70">Name</p>
                    <p className="font-semibold text-sm md:text-base">{user?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-[#6B4A1E]/70">Email</p>
                    <p className="font-semibold text-xs md:text-sm break-all">{user?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-[#6B4A1E]/70">Phone</p>
                    <p className="font-semibold text-sm md:text-base">{user?.phone || '-'}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm text-[#6B4A1E] mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-[#E6B65C]/20 rounded-lg focus:outline-none focus:border-[#5F6B3C] text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm text-[#6B4A1E] mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-[#E6B65C]/20 rounded-lg focus:outline-none focus:border-[#5F6B3C] text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm text-[#6B4A1E] mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 border border-[#E6B65C]/20 rounded-lg focus:outline-none focus:border-[#5F6B3C] text-sm md:text-base"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleEditProfile}
                      disabled={savingProfile}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#5F6B3C] text-white py-2 rounded-lg hover:bg-[#6B4A1E] transition-colors disabled:opacity-60 text-xs md:text-sm"
                    >
                      <Check className="w-3 h-3 md:w-4 md:h-4" />
                      {savingProfile ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 flex items-center justify-center gap-2 border border-[#6B4A1E] text-[#6B4A1E] py-2 rounded-lg hover:bg-[#FAF7F2] transition-colors text-xs md:text-sm"
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 md:pt-6 border-t border-[#E6B65C]/20 mt-4 md:mt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors font-semibold text-xs md:text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-[#E6B65C]/20">
              <h3 className="text-lg md:text-xl font-semibold text-[#6B4A1E] mb-4 md:mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Order History
              </h3>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center">
                    <svg className="spinner h-6 h-8 md:h-8 text-[#5F6B3C] w-6 md:w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="mt-2 text-xs md:text-sm text-[#6B4A1E]/70">Loading orders...</p>
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
              ) : error ? (
                <div className="text-center py-8 text-red-600 text-xs md:text-sm">
                  <p>{error}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-xs md:text-sm text-[#6B4A1E]/70">
                  <p>No orders yet. Start shopping!</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {orders.map((o: any) => (
                    <button
                      key={o._id}
                      onClick={() => handleOrderClick(o._id)}
                      className="w-full text-left p-3 md:p-4 border border-[#E6B65C]/20 rounded-lg hover:border-[#5F6B3C] hover:bg-[#FAF7F2]/50 transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm md:text-base text-[#6B4A1E]">Order #{o._id?.slice(-8)}</div>
                          <div className="text-xs md:text-sm text-[#6B4A1E]/70 mt-1">
                            {new Date(o.createdAt).toLocaleDateString()} • {o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? 's' : ''}
                          </div>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="inline-block px-2 py-1 bg-[#E6B65C]/20 text-[#6B4A1E] text-xs rounded-full">
                              {o.status?.charAt(0).toUpperCase() + o.status?.slice(1) || 'Pending'}
                            </span>
                            {o.paymentStatus && (
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                Payment: {o.paymentStatus.charAt(0).toUpperCase() + o.paymentStatus.slice(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-base md:text-lg font-semibold text-[#5F6B3C]">PKR {(o.totalAmount || 0).toLocaleString()}</div>
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#5F6B3C] mt-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
