import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  if (!product) return null;

  const getFirstVariant = () => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0];
    }
    return null;
  };

  const firstVariant = getFirstVariant();
  const finalPrice = firstVariant?.basePrice || product.finalPrice || 0;
  const mrp = firstVariant?.mrp || product.mrp || 0;
  const hasDiscount = product.discount?.value > 0;
  const discountPercent = hasDiscount && product.discount.type === 'percentage' 
    ? product.discount.value 
    : null;

  // Calculate rating (if reviews exist)
  const averageRating = product.reviews?.length > 0 
    ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  return (
    <div className="group relative bg-white dark:bg-black rounded-2xl overflow-hidden border border-red-200 dark:border-red-900 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.bestSeller && (
          <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-lg">
            Best Seller
          </span>
        )}
        {discountPercent && (
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
            {discountPercent}% OFF
          </span>
        )}
        {product.isFeatured && (
          <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-lg">
            Featured
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 p-2 bg-white/90 dark:bg-black/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white">
        <Heart size={16} />
      </button>

      {/* Product Image */}
      <Link to={`/product/details/${product.category}/${product._id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <img 
            src={product.thumbnail || product.images?.[0]} 
            alt={product.title}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          />
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="px-4 py-2 bg-white dark:bg-black text-black dark:text-white rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all">
              <Eye size={16} />
              Quick View
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-black/50 dark:text-white/50 mb-1">{product.brand}</p>
        )}

        {/* Title */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-bold text-black dark:text-white text-sm line-clamp-2 mb-2 hover:text-red-500 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        {averageRating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-black dark:text-white ml-1">{averageRating}</span>
            </div>
            <span className="text-xs text-black/50 dark:text-white/50">
              ({product.reviews?.length || 0} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-black dark:text-white">
            ₹{finalPrice.toLocaleString('en-IN')}
          </span>
          {hasDiscount && mrp > finalPrice && (
            <>
              <span className="text-xs text-black/50 dark:text-white/50 line-through">
                ₹{mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-green-500 font-semibold">
                Save ₹{(mrp - finalPrice).toLocaleString('en-IN')}
              </span>
            </>
          )}
        </div>

        {/* Stock Status */}
        {firstVariant?.stock > 0 ? (
          firstVariant.stock <= 7 ? (
            <p className="text-xs text-orange-500 mb-2">Only {firstVariant.stock} left</p>
          ) : (
            <p className="text-xs text-green-500 mb-2">In Stock</p>
          )
        ) : (
          <p className="text-xs text-red-500 mb-2">Out of Stock</p>
        )}

        {/* Add to Cart Button */}
        <button 
          onClick={() => onAddToCart?.(product)}
          disabled={firstVariant?.stock === 0}
          className={`w-full py-2 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            firstVariant?.stock === 0
              ? 'bg-gray-200 dark:bg-gray-800 cursor-not-allowed text-gray-500'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          <ShoppingCart size={16} />
          {firstVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;