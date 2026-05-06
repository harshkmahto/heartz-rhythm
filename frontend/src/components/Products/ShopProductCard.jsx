// ShopProductCard.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';

const ShopProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart, isInCart: checkInCart, cartItems } = useCart();

  const getAvailableVariant = useCallback(() => {
    if (!product.variants || product.variants.length === 0) {
      return null;
    }
    
    const availableVariant = product.variants.find(variant => variant.stock > 0);
    
    return availableVariant || product.variants[0];
  }, [product.variants]);

  const firstVariant = selectedVariant || getAvailableVariant() || product.variants?.[0] || {};
  const mrp = firstVariant.mrp || product.mrp || 0;
  const finalPrice = firstVariant.finalPrice || product.finalPrice || 0;
  const isOutOfStock = firstVariant.stock === 0 || !firstVariant.stock;
  
  // Check if variant is in cart
  useEffect(() => {
    const checkCartStatus = async () => {
      if (product._id && firstVariant._id) {
        const inCart = await checkInCart(product._id, firstVariant._id);
        setIsInCart(inCart);
      }
    };
    checkCartStatus();
  }, [product._id, firstVariant._id, checkInCart, cartItems]);

  // Auto-select the best variant when product loads
  useEffect(() => {
    const availableVariant = getAvailableVariant();
    if (availableVariant) {
      setSelectedVariant(availableVariant);
    }
  }, [getAvailableVariant]);

  const averageRating = (() => {
    if (product.averageRating) return product.averageRating;
    if (product.reviews && product.reviews.length > 0) {
      const sum = product.reviews.reduce((total, review) => total + (review.rating || 0), 0);
      return (sum / product.reviews.length).toFixed(1);
    }
    return null;
  })();

  const reviewCount = product.reviews?.length || 0;
  const category = product.category?.name || product.category || '';
  const subcategory = product.subcategory?.name || product.subcategory || '';
  const productImage = product.thumbnail || product.images?.[0] || '/placeholder-image.jpg';
  const previewVideo = product.previewVideo || product.videoUrl || null;

  // Handle video play/pause on hover
  useEffect(() => {
    if (isHovered && previewVideo && videoRef.current) {
      setShowVideo(true);
      videoRef.current.play().catch(err => console.log('Video play error:', err));
    } else if (!isHovered && videoRef.current) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setShowVideo(false);
    }
  }, [isHovered, previewVideo]);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) {
      toast.error('This product is out of stock!');
      return;
    }

    if (!firstVariant._id) {
      toast.error('Product variant not available');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product._id, firstVariant._id, 1);
      toast.success('Added to cart successfully!');
      setIsInCart(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderVariantSelector = () => {
    if (!product.variants || product.variants.length <= 1) return null;

    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {product.variants.map((variant, idx) => {
          const isSelected = selectedVariant?._id === variant._id;
          const isVariantOutOfStock = variant.stock === 0;
          
          return (
            <button
              key={variant._id || idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isVariantOutOfStock) {
                  setSelectedVariant(variant);
                }
              }}
              className={`text-xs px-2 py-1 rounded-full transition-all duration-200 ${
                isSelected
                  ? 'bg-red-500 text-white'
                  : isVariantOutOfStock
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100'
              }`}
              disabled={isVariantOutOfStock}
            >
              {variant.size || variant.color || variant.name || `Variant ${idx + 1}`}
              {isVariantOutOfStock && ' (Out of Stock)'}
              {isSelected && ' ✓'}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="group relative bg-white dark:bg-black/50 backdrop-blur-sm border border-red-200 dark:border-red-900 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:border-red-500 overflow-hidden block">
        {/* Background Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 blur-[80px] group-hover:bg-red-500/20 transition-all duration-700"></div>
        
        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-4 left-4 z-20 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-4 left-4 z-20 bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            Out of Stock
          </div>
        )}

        {/* In Cart Badge */}
        {isInCart && !isOutOfStock && (
          <div 
            onClick={() => navigate('/cart')}
            className="absolute top-4 left-4 z-20 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 cursor-pointer">
            <CheckCircle size={12} 
              
            />
            In Cart
          </div>
        )}

        {/* Video Indicator Badge */}
        {previewVideo && (
          <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Play size={10} fill="white" />
            Preview
          </div>
        )}
        
        {/* Image/Video Container */}
        <div 
          onClick={() => navigate(`/product/details/${product.category}/${product._id}`)}
          className="relative h-80 mb-8 flex items-center justify-center overflow-hidden rounded-xl cursor-pointer"
        >
          {/* Thumbnail Image */}
          <img 
            alt={product.title} 
            className={`h-[90%] object-contain drop-shadow-2xl transition-all duration-700 ${
              isHovered && showVideo ? 'opacity-0 scale-0' : 'opacity-100 scale-100 group-hover:scale-110 group-hover:-rotate-3'
            }`} 
            src={productImage}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
          
          {/* Preview Video */}
          {previewVideo && showVideo && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-contain rounded-xl"
              loop
              muted
              playsInline
              onLoadedData={handleVideoLoad}
              style={{ opacity: isVideoLoaded ? 1 : 0 }}
            >
              <source src={previewVideo} type="video/mp4" />
            </video>
          )}
          
          {/* Loading placeholder for video */}
          {previewVideo && showVideo && !isVideoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-4">
          {/* Title and Brand */}
          <div>
            <h3 className="text-xl font-black tracking-tight text-black dark:text-white group-hover:text-red-500 transition-colors line-clamp-1">
              {product.title}
            </h3>
            <p className="text-black/60 dark:text-white/60 text-xs uppercase tracking-widest mt-1">
              {product.brand || product.sellerPanel?.brandName || 'Unknown Brand'}
            </p>
          </div>
          
          {/* Category and Subcategory */}
          {(category || subcategory) && (
            <div className="flex flex-wrap gap-2">
              {category && (
                <span className="text-xs px-2 py-1 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full">
                  {category}
                </span>
              )}
              {subcategory && (
                <span className="text-xs px-2 py-1 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full">
                  {subcategory}
                </span>
              )}
            </div>
          )}
          
          {/* Variant Selector */}
          {renderVariantSelector()}
          
          {/* Rating Section */}
          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center gap-1">
              {averageRating ? (
                <>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={`${
                          star <= Math.round(averageRating)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-black dark:text-white ml-1">
                    {averageRating}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className="text-gray-300 dark:text-gray-600" />
                  ))}
                  <span className="text-xs text-black/50 dark:text-white/50 ml-1">No ratings</span>
                </div>
              )}
            </div>
            {reviewCount > 0 && (
              <span className="text-xs text-black/50 dark:text-white/50">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </div>
          
          {/* Price Section */}
          <div className="flex items-center justify-between pt-4 border-t border-red-100 dark:border-red-900/50">
            <div className="flex flex-col">
              <>
                <span className="text-2xl font-black tracking-tighter text-black dark:text-white">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
                {mrp > finalPrice && (
                  <span className="text-sm text-black/50 dark:text-white/50 line-through">
                    ₹{mrp.toLocaleString('en-IN')}
                  </span>
                )}
              </>         
            </div>
            
            {/* Cart Button */}
            <button 
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                isInCart
                  ? 'bg-green-500 text-white border-green-500 cursor-pointer'
                  : isOutOfStock
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-white dark:bg-black border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 cursor-pointer'
              }`}
              onClick={handleAddToCart}
              disabled={isOutOfStock || isInCart || isAddingToCart}
            >
              {isAddingToCart ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin "></div>
              ) : isInCart ? (
                <CheckCircle size={20} />
              ) : (
                <ShoppingCart size={20} />
              )}
            </button>
          </div>

          {/* Stock Info */}
          {!isOutOfStock && firstVariant.stock < 10 && (
            <p className="text-xs text-orange-500 mt-2">
              Only {firstVariant.stock} left in stock!
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ShopProductCard;