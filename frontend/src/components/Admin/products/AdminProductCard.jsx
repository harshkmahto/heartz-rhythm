// AdminProductCard.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminProductCard = ({ product, onClick }) => {
  const navigate = useNavigate()
  const [showAllColors, setShowAllColors] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(`/admin/product/details/${product._id}`)
    }
  }


  const variants = product.variants || []
  const displayedColors = showAllColors ? variants : variants.slice(0, 3)
  

  const firstVariant = variants[0] || {}
  const mrp = firstVariant.mrp || 0
  const basePrice = firstVariant.basePrice || 0
  const finalPrice = firstVariant.finalPrice || 0
  
  
  const discount = product.discount || {}
  const discountValue = discount.value || 0
  const discountType = discount.type || ''
  const discountCode = discount.code || ''
  

  let discountPercentage = 0
  if (discountValue > 0 && basePrice > 0) {
    if (discountType === 'percentage') {
      discountPercentage = discountValue
    } else if (discountType === 'fixed') {
      discountPercentage = ((discountValue / basePrice) * 100).toFixed(0)
    }
  }


  const getStatusBadge = () => {
    const statusConfig = {
      active: { bg: 'bg-green-100 dark:bg-green-950', text: 'text-green-700 dark:text-green-400', label: 'Active' },
      draft: { bg: 'bg-yellow-100 dark:bg-yellow-950', text: 'text-yellow-700 dark:text-yellow-400', label: 'Draft' },
      scheduled: { bg: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-400', label: 'Scheduled' }
    }
    const config = statusConfig[product.status] || statusConfig.draft
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div 
      onClick={handleClick}
      className="bg-white dark:bg-black/80 rounded-lg shadow-md overflow-hidden hover:shadow-xl dark:hover:shadow-red-500/10 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-red-100 dark:border-red-900/30"
    >
      {/* Thumbnail Image */}
      <div className="relative h-48 bg-red-50 dark:bg-red-950/20 overflow-hidden">
        {product.thumbnail ? (
          <img 
            src={product.thumbnail} 
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-red-100 dark:bg-red-950/30">
            <span className="text-red-400 dark:text-red-600 text-sm">No Image</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          {getStatusBadge()}
        </div>
        
        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              Featured
            </span>
          </div>
        )}

        {/* Coming Soon Badge */}
        {product.isComingSoon && (
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-600 text-orange-600 dark:text-white">
              Coming Soon
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-9 right-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-600 text-red-700 dark:text-white">
              {discountPercentage}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-black dark:text-white text-lg mb-1 line-clamp-1">
          {product.title}
        </h3>
        
        {/* Category & Subcategory */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-xs text-black/60 dark:text-white/50 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
            {product.category || 'Uncategorized'}
          </span>
          {product.subCategory && (
            <span className="text-xs text-black/60 dark:text-white/50 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
              {product.subCategory}
            </span>
          )}
        </div>

        {/* Colors Section with Stock */}
        {variants.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-black/70 dark:text-white/60">Available Colors & Stock</span>
              {variants.length > 3 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowAllColors(!showAllColors); }}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  {showAllColors ? 'Show Less' : `+${variants.length - 3} more`}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {displayedColors.map((variant, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border border-red-200 dark:border-red-800 shadow-sm"
                      style={{ backgroundColor: variant.colorCode || variant.color || '#000000' }} 
                    />
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        {variant.name || variant.color || 'Standard'}
                      </p>
                      <p className="text-xs text-black/50 dark:text-white/40">
                        Stock: {variant.stock || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Section - MRP, Base Price, Final Price */}
        <div className="border-t border-red-100 dark:border-red-900/30 pt-3 mt-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <span className="text-xs text-black/40 dark:text-white/30 line-through">
                  MRP: ₹{mrp.toLocaleString()}
                </span>
                <span className="text-xs text-black/60 dark:text-white/50">
                  Base: ₹{basePrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-black/60 dark:text-white/50">Final:</span>
                <span className="text-base font-bold text-red-600 dark:text-red-400">
                  ₹{finalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-3 pt-2 border-t border-red-100 dark:border-red-900/30">
          <div className="flex items-center justify-between text-xs">
            {discountCode && (
              <span className="text-black/50 dark:text-white/40">
                Coupon: {discountCode}
              </span>
            )}
            {product.totalStock !== undefined && (
              <span className={`font-medium ${product.totalStock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                Total Stock: {product.totalStock}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProductCard