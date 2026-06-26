import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiLayout, FiPackage, FiShoppingBag, FiUsers, FiLogOut, 
  FiDollarSign, FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiHome, FiTrendingUp 
} from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService'
import { getOrders, updateOrderStatus, getOrderStats } from '../services/orderService'
import { getUsers, updateUser, deleteUser, getUserStats } from '../services/userService'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

const AdminPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  // Data states
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalProducts: 0 })
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals & Form states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    discountPrice: '',
    description: '',
    category: 'Lifestyle',
    brand: '',
    stock: '',
    sizes: ['US 9', 'US 9.5', 'US 10'],
    images: [{ url: '/assets/sneaker-1.webp', isMain: true }]
  })

  // Authorize user
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        toast.error('Access Denied. Admins Only.')
        navigate('/')
      } else {
        fetchAdminData()
      }
    }
  }, [authLoading, isAuthenticated, user, navigate])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      // Fetch stats
      const ordStats = await getOrderStats()
      const usrStats = await getUserStats()
      const prodData = await getProducts({ limit: 100 })
      const ordData = await getOrders({ limit: 100 })
      const usrData = await getUsers({ limit: 100 })

      setStats({
        totalOrders: ordStats.data.totalOrders,
        totalRevenue: ordStats.data.totalRevenue,
        totalUsers: usrStats.data.totalUsers,
        totalProducts: prodData.data.products.length
      })

      setProducts(prodData.data.products)
      setOrders(ordData.data.orders)
      setUsers(usrData.data.users)
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Handle product mutations
  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
        stock: Number(productForm.stock)
      }

      if (editingProduct) {
        await updateProduct(editingProduct._id, payload)
        toast.success('Product updated successfully!')
      } else {
        await createProduct(payload)
        toast.success('Product created successfully!')
      }

      setIsProductModalOpen(false)
      setEditingProduct(null)
      fetchAdminData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing product')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id)
        toast.success('Product deleted')
        fetchAdminData()
      } catch (error) {
        toast.error('Failed to delete product')
      }
    }
  }

  const openEditProduct = (prod) => {
    setEditingProduct(prod)
    setProductForm({
      name: prod.name,
      price: prod.price,
      discountPrice: prod.discountPrice || '',
      description: prod.description,
      category: prod.category,
      brand: prod.brand,
      stock: prod.stock,
      sizes: prod.sizes,
      images: prod.images.length ? prod.images : [{ url: '/assets/sneaker-1.webp', isMain: true }]
    })
    setIsProductModalOpen(true)
  }

  const openCreateProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: '',
      price: '',
      discountPrice: '',
      description: '',
      category: 'Lifestyle',
      brand: '',
      stock: '',
      sizes: ['US 8', 'US 9', 'US 10'],
      images: [{ url: '/assets/sneaker-1.webp', isMain: true }]
    })
    setIsProductModalOpen(true)
  }

  // Handle order status change
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success(`Order updated to ${newStatus}`)
      fetchAdminData()
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  // Handle user role update
  const handleToggleUserRole = async (usr) => {
    const newRole = usr.role === 'admin' ? 'user' : 'admin'
    try {
      await updateUser(usr._id, { role: newRole })
      toast.success(`User role updated to ${newRole}`)
      fetchAdminData()
    } catch (error) {
      toast.error('Failed to update user role')
    }
  }

  // Delete user
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id)
        toast.success('User account removed')
        fetchAdminData()
      } catch (error) {
        toast.error('Failed to delete user')
      }
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: FiLayout },
    { id: 'products', name: 'Products', icon: FiPackage },
    { id: 'orders', name: 'Orders', icon: FiShoppingBag },
    { id: 'users', name: 'Users', icon: FiUsers }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans overflow-x-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between fixed h-full z-20">
        <div>
          <div className="h-20 flex items-center justify-center border-b border-slate-800">
            <span className="text-xl font-display font-extrabold text-white tracking-wider flex items-center gap-2">
              SOLE<span className="text-sky-500">STYLE</span>
              <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full border border-sky-500/30">ADMIN</span>
            </span>
          </div>

          <nav className="mt-8 px-4 space-y-2">
            {sidebarItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === item.id 
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link 
            to="/" 
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-xl text-sm font-medium transition-all"
          >
            <FiHome className="w-5 h-5" />
            Back to Site
          </Link>
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-all"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen p-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold capitalize">{activeTab}</h1>
            <p className="text-sm text-slate-400">Manage your online retail operations</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">Welcome, {user?.name}</span>
            <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white uppercase shadow-lg shadow-sky-500/30">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Tab contents */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400' },
                { name: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400' },
                { name: 'Active Users', value: stats.totalUsers, icon: FiUsers, color: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400' },
                { name: 'Catalog Products', value: stats.totalProducts, icon: FiPackage, color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400' }
              ].map((card, i) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-gradient-to-br ${card.color} border p-6 rounded-2xl flex items-center justify-between shadow-xl`}
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{card.name}</p>
                      <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50">
                      <Icon className="w-6 h-6" />
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Quick Analytics & Recent Orders */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Sales Chart / Visual Progress */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                    <FiTrendingUp className="text-sky-500" /> Sales Progress
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">Delivery completion rate analysis</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, pct: orders.length ? (orders.filter(o => o.status === 'Delivered').length / orders.length) * 100 : 0, color: 'bg-emerald-500' },
                    { label: 'Shipped / Processing', value: orders.filter(o => ['Processing', 'Shipped'].includes(o.status)).length, pct: orders.length ? (orders.filter(o => ['Processing', 'Shipped'].includes(o.status)).length / orders.length) * 100 : 0, color: 'bg-sky-500' },
                    { label: 'Pending Payment', value: orders.filter(o => o.status === 'Pending').length, pct: orders.length ? (orders.filter(o => o.status === 'Pending').length / orders.length) * 100 : 0, color: 'bg-amber-500' },
                    { label: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length, pct: orders.length ? (orders.filter(o => o.status === 'Cancelled').length / orders.length) * 100 : 0, color: 'bg-red-500' }
                  ].map((bar, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{bar.label}</span>
                        <span className="text-slate-400">{bar.value} ({bar.pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Grid */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold mb-4">Recent Store Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-800">
                        <th className="pb-3 font-semibold">Order ID</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold">Total</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {orders.slice(0, 5).map(ord => (
                        <tr key={ord._id} className="text-slate-300 hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 font-mono text-xs text-sky-400">#{ord._id.slice(-6)}</td>
                          <td className="py-3">{ord.user?.name || 'Guest'}</td>
                          <td className="py-3 text-xs">{new Date(ord.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 font-bold">${ord.totalPrice.toFixed(2)}</td>
                          <td className="py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              ord.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                              ord.status === 'Shipped' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                              ord.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-800 rounded-2xl shadow-md">
              <span className="text-sm text-slate-400">{products.length} products loaded</span>
              <button 
                onClick={openCreateProduct}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20"
              >
                <FiPlus /> Add New Product
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-850 border-b border-slate-800 text-slate-400">
                    <th className="p-4">Product Info</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map(prod => (
                    <tr key={prod._id} className="hover:bg-slate-800/20 text-slate-300 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img 
                          src={prod.images?.[0]?.url || '/assets/sneaker-1.webp'} 
                          alt={prod.name} 
                          className="w-10 h-10 object-contain bg-slate-800 rounded-lg border border-slate-700"
                        />
                        <span className="font-semibold text-white">{prod.name}</span>
                      </td>
                      <td className="p-4">{prod.brand}</td>
                      <td className="p-4">{prod.category}</td>
                      <td className="p-4 font-bold text-white">
                        {prod.discountPrice ? (
                          <div className="space-y-0.5">
                            <span className="text-emerald-400">${prod.discountPrice.toFixed(2)}</span>
                            <span className="block text-xs line-through text-slate-500">${prod.price.toFixed(2)}</span>
                          </div>
                        ) : `$${prod.price.toFixed(2)}`}
                      </td>
                      <td className="p-4">
                        <span className={`font-mono ${prod.stock === 0 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => openEditProduct(prod)}
                            className="p-2 bg-slate-800 hover:bg-sky-500 hover:text-white rounded-lg text-slate-400 transition-all border border-slate-700"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="p-2 bg-slate-800 hover:bg-red-500 hover:text-white rounded-lg text-slate-400 transition-all border border-slate-700"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-850 border-b border-slate-800 text-slate-400">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map(ord => (
                  <tr key={ord._id} className="hover:bg-slate-800/20 text-slate-300 transition-colors">
                    <td className="p-4 font-mono text-xs text-sky-400">#{ord._id.slice(-8)}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{ord.user?.name || 'Guest'}</div>
                      <div className="text-xs text-slate-500">{ord.user?.email || 'N/A'}</div>
                    </td>
                    <td className="p-4 text-xs">{new Date(ord.createdAt).toLocaleString()}</td>
                    <td className="p-4 font-medium text-white">{ord.items?.length || 0} items</td>
                    <td className="p-4 font-bold text-white">${ord.totalPrice.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        ord.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        ord.status === 'Shipped' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                        ord.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                        className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs p-1.5 focus:outline-none focus:border-sky-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-850 border-b border-slate-800 text-slate-400">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Registration Date</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map(usr => (
                  <tr key={usr._id} className="hover:bg-slate-800/20 text-slate-300 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center text-xs">
                        {usr.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-white">{usr.name}</span>
                    </td>
                    <td className="p-4 text-slate-400">{usr.email}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        usr.role === 'admin' 
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="p-4 text-xs">{new Date(usr.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleToggleUserRole(usr)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-sky-500 hover:text-white rounded-lg text-xs font-semibold text-slate-400 transition-all border border-slate-700"
                        >
                          <FiUsers className="w-3.5 h-3.5" /> Toggle Role
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(usr._id)}
                          className="p-2 bg-slate-800 hover:bg-red-500 hover:text-white rounded-lg text-slate-400 transition-all border border-slate-700"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Product Add/Edit Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Sneaker'}
                </h3>
                <button 
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Product Name</label>
                    <input 
                      type="text" 
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Brand</label>
                    <input 
                      type="text" 
                      value={productForm.brand}
                      onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Discount Price</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={productForm.discountPrice}
                      onChange={(e) => setProductForm({...productForm, discountPrice: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Stock Quantity</label>
                    <input 
                      type="number" 
                      value={productForm.stock}
                      onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Category</label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Running">Running</option>
                    <option value="Classic">Classic</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Limited Edition">Limited Edition</option>
                    <option value="Training">Training</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Description</label>
                  <textarea 
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500 min-h-[100px]"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminPage
