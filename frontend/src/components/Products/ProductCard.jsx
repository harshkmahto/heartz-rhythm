import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, CheckCircle, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import AddToWishlist from './AddToWishlist';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addToCart, isInCart: checkInCart, cartItems } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const getAvailableVariant = () => {
    if (!product.variants?.length) return null;
    const inStock = product.variants.find(v => v.stock > 0);
    return inStock || product.variants[0];
  };

  const currentVariant = selectedVariant || getAvailableVariant() || {};
  const finalPrice = currentVariant?.basePrice || product.finalPrice || currentVariant?.finalPrice || 0;
  const mrp = currentVariant?.mrp || product.mrp || 0;
  const discountPercent = mrp > finalPrice ? Math.round(((mrp - finalPrice) / mrp) * 100) : null;
  const isOutOfStock = currentVariant?.stock === 0;

  useEffect(() => {
    const checkCart = async () => {
      if (product._id && currentVariant?._id) {
        const inCart = await checkInCart(product._id, currentVariant._id);
        setIsInCart(inCart);
      }
    };
    checkCart();
  }, [product._id, currentVariant?._id, checkInCart, cartItems]);

  const averageRating = product.reviews?.length > 0 
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) {
      toast.error('Out of stock!');
      return;
    }

    if (!currentVariant?._id) {
      toast.error('Variant not available');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product._id, currentVariant._id, 1);
      toast.success('Added to cart!');
      setIsInCart(true);
    } catch (error) {
      toast.error(error.message || 'Failed to add');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleGoToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/cart');
  };

  const renderVariants = () => {
    if (!product.variants?.length || product.variants.length === 1) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {product.variants.map((variant, idx) => {
          const isSelected = selectedVariant?._id === variant._id;
          const isVariantOutOfStock = variant.stock === 0;
          
          return (
            <button
              key={variant._id || idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isVariantOutOfStock) setSelectedVariant(variant);
              }}
              className={`text-xs px-2 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-red-500 text-white'
                  : isVariantOutOfStock
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-red-50 dark:bg-red-950 text-red-600 hover:bg-red-100 cursor-pointer'
              }`}
              disabled={isVariantOutOfStock}
            >
              {variant.size || variant.color || variant.name || `Variant ${idx + 1}`}
              {isVariantOutOfStock && ' (Out)'}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="group relative bg-white dark:bg-black rounded-2xl overflow-hidden border border-red-200 dark:border-red-900 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.bestSeller && (
          <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-lg">
            Best Seller
          </span>
        )}
        {discountPercent > 0 && (
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

      {/* Reviews Badge - Bottom Left of Thumbnail */}
      {averageRating && (
        <div className="absolute bottom-3 left-3 z-10 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-white text-xs font-bold">{averageRating}</span>
          <span className="text-white/70 text-xs">({product.reviews?.length || 0})</span>
        </div>
      )}

      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10">
        <AddToWishlist 
          productId={product._id}
          variantId={currentVariant?._id}
          className="p-2 bg-white/90 dark:bg-black/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white cursor-pointer"
          iconSize={16}
        />
      </div>

      {/* Product Image */}
      <Link to={`/product/details/${product.category}/${product._id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <img 
            src={product.thumbnail || product.images?.[0] || '/placeholder-image.jpg'} 
            alt={product.title}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            onError={(e) => e.target.src = '/placeholder-image.jpg'}
          />
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button className="px-4 py-2 bg-white dark:bg-black text-black dark:text-white rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer">
              <Eye size={16} />
              Quick View
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {product.brand && (
          <p className="text-xs text-black/50 dark:text-white/50 mb-1">{product.brand}</p>
        )}

        <Link to={`/product/details/${product.category}/${product._id}`}>
          <h3 className="font-bold text-black dark:text-white text-sm line-clamp-2 mb-2 hover:text-red-500 transition-colors duration-200">
            {product.title}
          </h3>
        </Link>

        {renderVariants()}

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold">₹{finalPrice.toLocaleString('en-IN')}</span>
          {mrp > finalPrice && (
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

        {!isOutOfStock && currentVariant?.stock <= 7 && (
          <p className="text-xs text-orange-500 mb-2">Only {currentVariant.stock} left</p>
        )}

        {isOutOfStock && (
          <p className="text-xs text-red-500 mb-2">Out of Stock</p>
        )}

        {/* Animated Buttons */}
        {isInCart ? (
          <button 
            onClick={handleGoToCart}
            className="relative w-full py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-green-500 text-white overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer group/btn"
          >
            <div className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
            <ShoppingCart size={16} className="relative z-10" />
            <span className="relative z-10">Go to Cart</span>
          </button>
        ) : (
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart}
            className={`relative w-full py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 ${
              isOutOfStock
                ? 'bg-gray-200 dark:bg-gray-800 cursor-not-allowed text-gray-500'
                : 'bg-red-500 text-white hover:scale-105 cursor-pointer group/btn'
            }`}
          >
            {!isOutOfStock && (
              <div className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
            )}
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10"></div>
                <span className="relative z-10">Adding...</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingCart size={16} className="relative z-10" />
                <span className="relative z-10">Add to Cart</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;