import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, Edit3, Trash2, MoreVertical, 
  CheckCircle, Clock, AlertCircle, Star,
  TrendingUp, Package, X, ShoppingBag
} from 'lucide-react';

const SellerProductCard = ({ product, onRefresh, onStatusUpdateClick }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = () => {
    switch (product.status) {
      case 'active':
        return { color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400', icon: CheckCircle, text: 'Active' };
      case 'draft':
        return { color: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-400', icon: Clock, text: 'Draft' };
      case 'scheduled':
        return { color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400', icon: Clock, text: 'Scheduled' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: AlertCircle, text: 'Unknown' };
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;
  const firstVariant = product.variants?.[0];
  const discountPercent = product.discount?.value > 0 ? 
    (product.discount.type === 'percentage' ? product.discount.value : 
      ((product.discount.value / firstVariant?.mrp) * 100).toFixed(0)) : 0;

  return (
    <div className="group bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-green-100 dark:bg-green-900/30">
        {product.thumbnail ? (
          <Link to={`/seller/product/details/${product._id}`}>
            <img 
              src={product.thumbnail} 
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-green-400" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${statusBadge.color}`}>
            <StatusIcon size={12} />
            {statusBadge.text}
          </span>
          {product.isFeatured && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
              <Star size={12} />
              Featured
            </span>
          )}
          {product.isComingSoon && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-400 flex items-center gap-1">
              <Clock size={12} />
              Coming Soon
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            {discountPercent}% OFF
          </div>
        )}

        {/* Action Menu */}
        <div className="absolute bottom-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-white/90 dark:bg-black/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-black transition-colors cursor-pointer"
            >
              <MoreVertical size={16} className="text-green-700 dark:text-green-400" />
            </button>
            {showMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-40 bg-white dark:bg-black rounded-xl shadow-xl border border-green-200 dark:border-green-800 overflow-hidden z-10">
                <Link to={`/seller/product/update/${product._id}`}>
                  <button className="w-full px-4 py-2 text-left text-sm text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 flex items-center gap-2 cursor-pointer">
                    <Edit3 size={14} /> Edit Product
                  </button>
                </Link>
                <Link to={`/seller/product/details/${product._id}`}>
                  <button className="w-full px-4 py-2 text-left text-sm text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 flex items-center gap-2 cursor-pointer">
                    <Eye size={14} /> View Details
                  </button>
                </Link>
                <div className="border-t border-green-200 dark:border-green-800">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onStatusUpdateClick(product);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 flex items-center gap-2 cursor-pointer"
                  >
                    <StatusIcon size={14} /> Status Update
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-bold text-green-900 dark:text-green-100 text-lg mb-1 line-clamp-1">
          {product.title}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full">
            {product.category}
          </span>
          {product.subCategory && (
            <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full">
              {product.subCategory}
            </span>
          )}
          <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full">
            {product.brand}
          </span>
        </div>

        {/* Colors */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {product.variants.slice(0, 5).map((variant, idx) => (
                <div
                  key={idx}
                  className="w-7 h-7 rounded-full border border-green-300 shadow-sm"
                  style={{ backgroundColor: variant.colorCode }}
                  title={variant.name}
                />
              ))}
              {product.variants.length > 5 && (
                <span className="text-xs text-green-600 dark:text-green-400 ml-1">
                  +{product.variants.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price */}
        {firstVariant && (
          <div className="mb-3">
            <span className="text-xl font-bold text-green-700 dark:text-green-300">
              ₹{firstVariant.basePrice}
            </span>
            <span className="ml-2 text-sm text-green-500 line-through">
              ₹{firstVariant.mrp}
            </span>          
            <span className="ml-2 text-xs text-green-600 dark:text-green-400">
              ({firstVariant.mrp - firstVariant.basePrice} ₹ off)
            </span>
          </div>
        )}

        {/* Stock Info */}
        <div className="flex items-center justify-between text-xs text-green-600 dark:text-green-400 mb-3">
          <span className="flex items-center gap-1">
            <ShoppingBag size={12} />
            Stock: {product.totalStock || 0}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp size={12} />
            Sold: {product.totalSold || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SellerProductCard;