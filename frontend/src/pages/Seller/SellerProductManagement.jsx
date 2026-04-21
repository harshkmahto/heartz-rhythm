import React, { useState, useEffect, useRef } from 'react'
import { Plus, ChevronLeft, ChevronRight, Package, TrendingUp, ShoppingBag, Calendar, Star, Clock, AlertCircle, Percent, Layers } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getMyProducts } from '../../utils/product.apiRequest'
import SellerProductCard from '../../components/Seller/Products/SellerProductCard'
import SellingOnOff from '../../components/Seller/Products/sellingOnOff'

const SellerProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    scheduled: 0,
    featured: 0,
    comingSoon: 0,
    discount: 0,
    lowStock: 0
  })
  const navigate = useNavigate()

  // Refs for horizontal scroll
  const featuredRef = useRef(null)
  const scheduledRef = useRef(null)
  const draftRef = useRef(null)
  const activeRef = useRef(null)
  const comingSoonRef = useRef(null)
  const discountRef = useRef(null)
  const lowStockRef = useRef(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getMyProducts()
      if (response.success) {
        const allProducts = response.data.products
        setProducts(allProducts)
        
        // Calculate stats
        const total = allProducts.length
        const active = allProducts.filter(p => p.status === 'active').length
        const draft = allProducts.filter(p => p.status === 'draft').length
        const scheduled = allProducts.filter(p => p.status === 'scheduled').length
        const featured = allProducts.filter(p => p.isFeatured === true).length
        const comingSoon = allProducts.filter(p => p.isComingSoon === true).length
        const discount = allProducts.filter(p => p.discount?.value > 0).length
        const lowStock = allProducts.filter(p => 
          p.variants?.some(v => v.stock > 0 && v.stock <= 10)
        ).length
        
        setStats({ total, active, draft, scheduled, featured, comingSoon, discount, lowStock })
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    navigate('/seller/product/create')
  }

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  const StatCard = ({ title, count, icon: Icon, color, bgColor }) => (
    <div className={`${bgColor} rounded-2xl p-4 border border-green-200/50 dark:border-green-800/30 transition-all duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-700 dark:text-green-400">{title}</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{count}</p>
        </div>
        <div className={`${color} p-3 rounded-xl`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )

  const SectionHeader = ({ title, icon: Icon, onScrollLeft, onScrollRight, count }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">{title}</h2>
        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-full text-xs">
          {count}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onScrollLeft}
          className="p-2 rounded-full bg-white/80 dark:bg-black/40 border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all cursor-pointer"
        >
          <ChevronLeft size={18} className="text-green-600" />
        </button>
        <button
          onClick={onScrollRight}
          className="p-2 rounded-full bg-white/80 dark:bg-black/40 border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all cursor-pointer"
        >
          <ChevronRight size={18} className="text-green-600" />
        </button>
      </div>
    </div>
  )

  const HorizontalScroll = ({ products, refProp, onRefresh }) => {
    if (!products || products.length === 0) {
      return (
        <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-8 text-center border border-green-200 dark:border-green-800">
          <Package className="w-12 h-12 text-green-300 mx-auto mb-2" />
          <p className="text-green-600 dark:text-green-400">No products found</p>
        </div>
      )
    }

    return (
      <div
        ref={refProp}
        className="flex overflow-x-auto gap-5 pb-4 scroll-smooth hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product._id} className="flex-shrink-0 w-80">
            <SellerProductCard 
              product={product} 
              onRefresh={onRefresh}
              onStatusUpdateClick={() => {}}
            />
          </div>
        ))}
      </div>
    )
  }

  // Filter products by category
  const featuredProducts = products.filter(p => p.isFeatured === true)
  const scheduledProducts = products.filter(p => p.status === 'scheduled')
  const draftProducts = products.filter(p => p.status === 'draft')
  const activeProducts = products.filter(p => p.status === 'active')
  const comingSoonProducts = products.filter(p => p.isComingSoon === true)
  const discountProducts = products.filter(p => p.discount?.value > 0)
  const lowStockProducts = products.filter(p => 
    p.variants?.some(v => v.stock > 0 && v.stock <= 10)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-black dark:via-green-950/20 dark:to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-black dark:via-green-950/20 dark:to-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-green-500 dark:from-green-400 dark:to-green-300 bg-clip-text text-transparent">
            Seller Product Management
          </h1>
          <p className="text-green-600 dark:text-green-400 mt-2">Manage and track all your products in one place</p>
        </div>

        {/* Create Product Button & Selling Toggle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Create Product Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-700 dark:to-emerald-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="p-8 text-center">
              <button
                onClick={handleCreate}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all rounded-2xl px-6 py-4"
              >
                <div className="flex items-center justify-center gap-3">
                  <Plus className="w-8 h-8 text-white hover:rotate-90 transition-transform duration-300" />
                  <span className="text-2xl font-bold text-white">Create New Product</span>
                </div>
              </button>
              <p className="text-white/80 mt-3 text-sm">Add a new product to your inventory</p>
            </div>
          </div>

          {/* Selling On/Off Card */}
          <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <SellingOnOff />
              </div>
              <p className="text-white font-semibold text-lg">Selling Switch</p>
              <p className="text-white/70 text-sm mt-1">Turn your store on/off instantly</p>
            </div>
          </div>
        </div>

        {/* Stats Cards - First Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Products" count={stats.total} icon={Package} color="bg-green-100 dark:bg-green-900/50 text-green-600" bgColor="bg-white/80 dark:bg-black/40" />
          <StatCard title="Active" count={stats.active} icon={ShoppingBag} color="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600" bgColor="bg-white/80 dark:bg-black/40" />
          <StatCard title="Draft" count={stats.draft} icon={Layers} color="bg-amber-100 dark:bg-amber-900/50 text-amber-600" bgColor="bg-white/80 dark:bg-black/40" />
          <StatCard title="Scheduled" count={stats.scheduled} icon={Calendar} color="bg-blue-100 dark:bg-blue-900/50 text-blue-600" bgColor="bg-white/80 dark:bg-black/40" />
        </div>

        {/* Stats Cards - Second Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard title="Featured" count={stats.featured} icon={Star} color="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600" bgColor="bg-white/80 dark:bg-black/40" />
          <StatCard title="Coming Soon" count={stats.comingSoon} icon={Clock} color="bg-purple-100 dark:bg-purple-900/50 text-purple-600" bgColor="bg-white/80 dark:bg-black/40" />
          <StatCard title="Discounted" count={stats.discount} icon={Percent} color="bg-red-100 dark:bg-red-900/50 text-red-600" bgColor="bg-white/80 dark:bg-black/40" />
          <StatCard title="Low Stock" count={stats.lowStock} icon={AlertCircle} color="bg-orange-100 dark:bg-orange-900/50 text-orange-600" bgColor="bg-white/80 dark:bg-black/40" />
        </div>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <div className="mb-8">
            <SectionHeader 
              title="Featured Products" 
              icon={Star} 
              onScrollLeft={() => scrollLeft(featuredRef)}
              onScrollRight={() => scrollRight(featuredRef)}
              count={featuredProducts.length}
            />
            <HorizontalScroll products={featuredProducts} refProp={featuredRef} onRefresh={fetchProducts} />
          </div>
        )}

        {/* Scheduled Products Section */}
        {scheduledProducts.length > 0 && (
          <div className="mb-8">
            <SectionHeader 
              title="Scheduled Products" 
              icon={Calendar} 
              onScrollLeft={() => scrollLeft(scheduledRef)}
              onScrollRight={() => scrollRight(scheduledRef)}
              count={scheduledProducts.length}
            />
            <HorizontalScroll products={scheduledProducts} refProp={scheduledRef} onRefresh={fetchProducts} />
          </div>
        )}

        {/* Draft Products Section */}
        {draftProducts.length > 0 && (
          <div className="mb-8">
            <SectionHeader 
              title="Draft Products" 
              icon={Layers} 
              onScrollLeft={() => scrollLeft(draftRef)}
              onScrollRight={() => scrollRight(draftRef)}
              count={draftProducts.length}
            />
            <HorizontalScroll products={draftProducts} refProp={draftRef} onRefresh={fetchProducts} />
          </div>
        )}

        {/* Active Products Section */}
        {activeProducts.length > 0 && (
          <div className="mb-8">
            <SectionHeader 
              title="Active Products" 
              icon={ShoppingBag} 
              onScrollLeft={() => scrollLeft(activeRef)}
              onScrollRight={() => scrollRight(activeRef)}
              count={activeProducts.length}
            />
            <HorizontalScroll products={activeProducts} refProp={activeRef} onRefresh={fetchProducts} />
          </div>
        )}

        {/* Coming Soon Products Section */}
        {comingSoonProducts.length > 0 && (
          <div className="mb-8">
            <SectionHeader 
              title="Coming Soon" 
              icon={Clock} 
              onScrollLeft={() => scrollLeft(comingSoonRef)}
              onScrollRight={() => scrollRight(comingSoonRef)}
              count={comingSoonProducts.length}
            />
            <HorizontalScroll products={comingSoonProducts} refProp={comingSoonRef} onRefresh={fetchProducts} />
          </div>
        )}

        {/* Discounted Products Section */}
        {discountProducts.length > 0 && (
          <div className="mb-8">
            <SectionHeader 
              title="Discounted Products" 
              icon={Percent} 
              onScrollLeft={() => scrollLeft(discountRef)}
              onScrollRight={() => scrollRight(discountRef)}
              count={discountProducts.length}
            />
            <HorizontalScroll products={discountProducts} refProp={discountRef} onRefresh={fetchProducts} />
          </div>
        )}

        {/* Low Stock Products Section */}
        {lowStockProducts.length > 0 && (
          <div className="mb-8">
            <SectionHeader 
              title="Low Stock Alert" 
              icon={AlertCircle} 
              onScrollLeft={() => scrollLeft(lowStockRef)}
              onScrollRight={() => scrollRight(lowStockRef)}
              count={lowStockProducts.length}
            />
            <HorizontalScroll products={lowStockProducts} refProp={lowStockRef} onRefresh={fetchProducts} />
          </div>
        )}

        {/* No Products Message */}
        {products.length === 0 && (
          <div className="text-center py-16 bg-white/80 dark:bg-black/40 rounded-2xl border border-green-200 dark:border-green-800">
            <Package className="w-20 h-20 text-green-300 dark:text-green-700 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-2">No Products Yet</h3>
            <p className="text-green-600 dark:text-green-400 mb-6">Get started by creating your first product</p>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Create Product
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default SellerProductManagement