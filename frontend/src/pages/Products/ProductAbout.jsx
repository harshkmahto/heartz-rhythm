// ProductAbout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Share2, Shield, RotateCcw, Truck, Clock, 
  X, ZoomIn, ChevronLeft, ChevronRight,
  Play, Pause, Check, AlertCircle,
  TagsIcon,
  CopyIcon,
  Crown
} from 'lucide-react';
import { getSinglePublicProduct } from '../../utils/product.apiRequest';
import Loader from '../../components/ShowCaseSection/Loader';
import CheckPin from '../../components/Products/CheckPin';
import AddToCartButton from '../../components/ShowCaseSection/AddToCartButton';
import BuyNowButton from '../../components/ShowCaseSection/BuyNowButton';
import SellerInProduct from '../../components/Products/SellerInProduct';
import SimmilerPRoduct from '../../components/Products/SimmilerPRoduct';
import SameSellerProduct from '../../components/Products/SameSellerProduct';
import AddToWishlist from '../../components/Products/AddToWishlist';
import ProductReviews from '../../components/Products/ProductReviews';

const ProductAbout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showHoverZoom, setShowHoverZoom] = useState(false);
  const [hoverZoomPosition, setHoverZoomPosition] = useState({ x: 0, y: 0 });
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const stickyTriggerRef = useRef(null);
  const mainImageRef = useRef(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const id = productId;
        if (!id) {
          setError('Product ID not found');
          setLoading(false);
          return;
        }
        
        const response = await getSinglePublicProduct(id);
        if (response.success) {
          setProduct(response.data.product);
          const availableVariant = response.data.product.variants?.find(v => v.stock > 0) || response.data.product.variants?.[0];
          if (availableVariant) {
            setSelectedColor(availableVariant);
          }
        } else {
          setError(response.message || 'Failed to fetch product');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const handleScroll = () => {
      if (stickyTriggerRef.current) {
        const triggerPosition = stickyTriggerRef.current.getBoundingClientRect();
        setShowStickyBar(triggerPosition.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMoveForPopup = (e) => {
    if (!mainImageRef.current || isMobile) return;
    
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    // Constrain to 0-100
    const constrainedX = Math.min(Math.max(x, 0), 100);
    const constrainedY = Math.min(Math.max(y, 0), 100);
    
    setHoverZoomPosition({ x: constrainedX, y: constrainedY });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-white to-red-50 dark:from-red-950 dark:via-black dark:to-red-950">
        <Loader/>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-white to-red-50 dark:from-red-950 dark:via-black dark:to-red-950">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
          <Link to="/shop" className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.thumbnail];
  const currentImage = images[selectedImage];
  const variants = product.variants || [];
  const currentVariant = selectedColor || variants[0];
  const isOutOfStock = currentVariant?.stock === 0;
  const isLowStock = currentVariant?.stock > 0 && currentVariant?.stock <= 7;
  const hasDiscount = product.discount?.value > 0;
  
  const finalPrice = currentVariant?.finalPrice || product.finalPrice || 0;
  const mrp = currentVariant?.mrp || product.mrp || 0;

  // Get stock status
  const getStockStatus = () => {
    if (isOutOfStock) return { text: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950' };
    if (isLowStock) return { text: `Only ${currentVariant.stock} left in stock`, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950' };
    return { text: 'In Stock', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' };
  };

  const stockStatus = getStockStatus();

  const getSafeStringValue = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.name) return value.name;
    if (typeof value === 'object' && value._id) return value._id;
    return String(value);
  };

const renderAboutSection = () => {
  if (product.about && Array.isArray(product.about) && product.about.length > 0) {
    return (
      <div>
        <div className="space-y-3">
          {product.about.map((item, index) => {

        if (!item.key || !item.value) return null;
            
            return (
              <div key={item._id || index} className="flex flex-col sm:flex-row justify-center py-3 border-b border-red-100 dark:border-red-900">
                <span className="text-black/60 dark:text-white/60 font-medium mb-1 sm:mb-0 sm:min-w-[200px]">
                  {item.key}
                </span>
                <span className="text-black dark:text-white font-medium break-words sm:text-right sm:flex-1">
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
   
  return null;
};

  
  const getCategoryName = () => {
    return getSafeStringValue(product.category);
  };

  const getSubCategoryName = () => {
    return getSafeStringValue(product.subCategory);
  };

  // Handle add to cart with selected color
  const handleAddToCart = () => {
    if (isOutOfStock) return;
 
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (isOutOfStock) return;
  };

  const copyHandler = () => {
    navigator.clipboard.writeText(product.discount?.code);
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-red-50 dark:from-red-950 dark:via-black dark:to-red-950">
      <main className="pt-20 md:pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
         
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
            <div className="space-y-4">
          
              <div 
                className="relative"
                onMouseEnter={() => !isMobile && setShowHoverZoom(true)}
                onMouseLeave={() => !isMobile && setShowHoverZoom(false)}
                onMouseMove={handleMouseMoveForPopup}
              >
                <div 
                  ref={mainImageRef}
                  className="relative aspect-square bg-white/50 dark:bg-black/50 rounded-2xl overflow-hidden border border-red-200 dark:border-red-900"
                >
                  <img 
                    src={currentImage} 
                    alt={product.title}
                    className="w-full h-full object-contain p-4 cursor-zoom-in"
                  />
                </div>
                
               
                {showHoverZoom && !isMobile && (
                  <div 
                    className="hidden md:block fixed z-50 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border-2 border-red-500"
                    style={{
                      width: '400px',
                      height: '400px',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(10%, -50%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${currentImage})`,
                        backgroundSize: '200%',
                        backgroundPosition: `${hoverZoomPosition.x}% ${hoverZoomPosition.y}%`,
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail Images  */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === idx 
                        ? 'border-red-500 shadow-lg' 
                        : 'border-red-200 dark:border-red-900 hover:border-red-400'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className="space-y-6" ref={stickyTriggerRef}>
             
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-black dark:text-white mb-2">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="text-black/60 dark:text-white/60 text-sm">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* Category and Subcategory */}
              <div className="flex flex-wrap gap-6">
                {getCategoryName() && (
                  <span className="px-3 py-1 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full text-sm capitalize">
                    {getCategoryName()}
                  </span>
                )}
                {getSubCategoryName() && (
                  <span className="px-3 py-1 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full text-sm capitalize">
                    {getSubCategoryName()}
                  </span>
                )}
              </div>

              {/* Brand Name */}
              <Link to={`/seller/brand/${product.sellerPanel?.brandName}`} className='flex' >
              <div className="flex items-center gap-3">
                {product.sellerPanel?.logo && (
                  <img src={product.sellerPanel.logo} alt={product.brand} className="w-8 h-8 rounded-full object-cover" />
                )}
                <span className="text-black dark:text-white font-medium">{product.brand || 'Unknown Brand'}</span>
              </div>
              </Link>

              {/* Wishlist & Share Icons */}
              <div className="flex gap-3">


                   <AddToWishlist
                    productId={product._id}
                    variantId={selectedColor?._id}
                    className="p-3 rounded-full bg-white dark:bg-black border border-red-200 dark:border-red-900 hover:bg-red-200 dark:hover:bg-red-900 hover:border-red-500 transition-all cursor-pointer"
                    iconSize={20}
                  />

                <button className="p-3 rounded-full bg-white dark:bg-black border border-blue-200 dark:border-blue-900 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all cursor-pointer">
                  <Share2 size={20} />
                </button>
              </div>

              {/* Available Colors */}
              {variants.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-black dark:text-white mb-3">Available Colors</h3>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((variant, idx) => {
                      const isSelected = selectedColor?._id === variant._id;
                      const isDisabled = variant.stock === 0;
                      return (
                        <button
                          key={variant._id || idx}
                          onClick={() => !isDisabled && setSelectedColor(variant)}
                          disabled={isDisabled}
                          className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
                            isSelected 
                              ? 'bg-red-500 text-white' 
                              : isDisabled
                                ? 'opacity-40 cursor-not-allowed'
                                : 'bg-white dark:bg-black border border-red-200 dark:border-red-900 hover:border-red-500'
                          }`}
                        >
                          <div 
                            className="w-10 h-10 rounded-full border-2 border-white dark:border-black shadow-md"
                            style={{ backgroundColor: variant.colorCode || '#ccc' }}
                          />
                          <span className="text-xs capitalize">{variant.name}</span>
                          {isDisabled && <span className="text-[10px]">Out of Stock</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${stockStatus.bg}`}>
                {isOutOfStock ? (
                  <AlertCircle size={14} className={stockStatus.color} />
                ) : isLowStock ? (
                  <Clock size={14} className={stockStatus.color} />
                ) : (
                  <Check size={14} className={stockStatus.color} />
                )}
                <span className={`text-sm font-medium ${stockStatus.color}`}>{stockStatus.text}</span>
              </div>

              {/* Price Section */}
              <div className="border-t border-b border-red-200 dark:border-red-900 py-4">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-black text-black dark:text-white">
                    ₹{finalPrice.toLocaleString('en-IN')}
                  </span>
                  {hasDiscount && mrp > finalPrice && (
                    <span className="text-lg text-black/50 dark:text-white/50 line-through">
                      ₹{mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart & Buy Now Buttons - Using Imported Components */}
              <div className="flex flex-col sm:flex-row gap-4">
                <AddToCartButton 
                  product={product}
                  selectedColor={selectedColor}
                  isOutOfStock={isOutOfStock}
                  onAddToCart={handleAddToCart}
                />
                <BuyNowButton 
                  product={product}
                  selectedColor={selectedColor}
                  isOutOfStock={isOutOfStock}
                  onBuyNow={handleBuyNow}
                />
              </div>
            </div>
          </div>

          {/* Features & About Section - Fixed Object Object Issue */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Side - Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">Features</h2>
                <div className="space-y-4">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white/50 dark:bg-black/50 rounded-xl border border-red-200 dark:border-red-900">
                      <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                      <p className="text-black/80 dark:text-white/80">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Right Side - Key Specs & About */}
            <div className="space-y-6">
              {renderAboutSection()}
            </div>
          </div>

          {/* CheckPin, Return/Replacement & Description Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Side - CheckPin & Return/Replacement */}
            <div className="flex flex-col gap-8">
              <CheckPin
                product={product}
                productId={product._id}
                isOutOfStock={isOutOfStock} 
              />
              
              {/* Return & Replacement Policies */}
              {(product.return?.isAvailable || product.replacement?.isAvailable) && (
                <div className="flex flex-col gap-4">
                  {product.return?.isAvailable && (
                    <div className="flex items-center gap-4 p-6 bg-white/50 dark:bg-black/50 rounded-2xl border border-red-200 dark:border-red-900">
                      <div className="p-3 bg-red-100 dark:bg-red-950 rounded-full">
                        <RotateCcw size={24} className="text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-black dark:text-white">Easy Returns</h3>
                        <p className="text-black/60 dark:text-white/60 text-sm">
                          Return within {product.return.duration} days of delivery
                        </p>
                      </div>
                    </div>
                  )}
                  {product.replacement?.isAvailable && (
                    <div className="flex items-center gap-4 p-6 bg-white/50 dark:bg-black/50 rounded-2xl border border-red-200 dark:border-red-900">
                      <div className="p-3 bg-red-100 dark:bg-red-950 rounded-full">
                        <Shield size={24} className="text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-black dark:text-white">Replacement Guarantee</h3>
                        <p className="text-black/60 dark:text-white/60 text-sm">
                          Replacement within {product.replacement.duration} days
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Discount */}
                {hasDiscount && (
                  <div className="flex flex-col items-center justify-center w-full h-46 gap-3 p-6  bg-white/50 dark:bg-black/50 rounded-2xl border border-red-200 dark:border-red-900 ">
                    <div className='flex items-center gap-4'>
                      <div className='p-3 bg-red-100 dark:bg-red-950 rounded-full'>
                        <TagsIcon size={24} className="text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-black dark:text-white text-xl">Discount</h3>       
                      </div>
                    </div>
                  
                    <div>
                      <span className='flex text-2xl font-bold text-red-600 dark:text-red-500'>
                        {product.discount?.code} <span className='flex items-end active:scale-105 cursor-pointer'>
                           <CopyIcon size={14}
                           onClick={copyHandler}
                           /> 
                           </span>
                      </span>
                      <p className='flex items-center gap-2 text-xl text-black dark:text-white font-bold mt-2'> <Crown className='text-red-500'/> {product.discount?.value}% off</p>
                      <p className='text-sm text-black dark:text-white mt-4'>{product.discount?.description}</p>
                    </div>
                  </div>
                )}
              
            </div>

            {/* Right Side - Product Description */}
            {product.description && (
              <div>
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Description</h2>
                <div className="prose prose-red max-w-none">
                  <p className="text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Showcase Section - Mobile Optimized */}
          {product.showCase && product.showCase.length > 0 && (
            <div className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {product.showCase.map((item, idx) => (
                  <div key={idx} className="flex flex-col justify-center gap-6">
                    <div className='w-56 h-56 rounded-2xl ml-5'>
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.key || 'Showcase'} 
                        className="w-full h-full rounded-2xl md:h-64 object-cover" 
                      />
                    )}

                    </div>          
                    {item.key && item.value && (
                      <div className="p-4">
                        <div className="flex flex-col  sm:justify-between gap-2">
                          <span className="text-black dark:text-white font-bold text-xl">
                            {item.key}
                          </span>
                          <span className="text-black dark:text-white font-medium text-sm">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Reviews section */}
          <ProductReviews 
            product={product}
            productId={productId}
          />


          {/* Videos Section - Full Width Horizontal Scroll */}
          {product.videos && product.videos.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Videos</h2>
              <div className="relative">
                <div 
                  ref={scrollContainerRef}
                  className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  {product.videos.map((video, idx) => (
                    <div key={idx} className="flex-shrink-0 w-full sm:w-[400px] md:w-[500px]">
                      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
                        <video 
                          ref={el => videoRefs.current[idx] = el}
                          src={video}
                          className="w-full h-full object-cover"
                          loop
                          playsInline
                          muted
                        />
                        <button 
                          onClick={() => {
                            const videoEl = videoRefs.current[idx];
                            if (videoEl.paused) {
                              videoRefs.current.forEach((v, i) => {
                                if (v && i !== idx && !v.paused) {
                                  v.pause();
                                }
                              });
                              videoEl.play();
                              setIsPlaying(true);
                              setActiveVideoIndex(idx);
                            } else {
                              videoEl.pause();
                              setIsPlaying(false);
                            }
                          }}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-all group"
                        >
                          {videoRefs.current[idx]?.paused ? (
                            <Play size={40} className="text-white" />
                          ) : (
                            <Pause size={40} className="text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {product.videos.length > 1 && (
                  <>
                    <button 
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                        }
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/80 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                        }
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/80 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          

          {/* Gallery Section with Hover Effect - Mobile Optimized */}
          {product.gallery && product.gallery.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {product.gallery.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-red-200 dark:border-red-900"
                    onClick={() => {
                      setGalleryStartIndex(idx);
                      setShowGalleryModal(true);
                    }}
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn size={20} className="text-white" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <SellerInProduct 
        seller={product.sellerPanel}
        product={product}
        productId={productId}
      />
      <SimmilerPRoduct 
        product={product}
        productId={productId}
      />
      <SameSellerProduct 
        seller={product.sellerPanel}
        product={product}
        productId={productId}
      />

      {/* Sticky Bottom Bar  */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-4 left-4 right-4 md:bottom-0 md:left-0 md:right-0 bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-red-200 dark:border-red-900 shadow-2xl z-40 rounded-none md:rounded-full"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4">
              <div className="flex  items-center justify-between w-full gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <img src={product.thumbnail} alt={product.title} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-black dark:text-white text-sm line-clamp-1">{product.title}</h4>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-bold text-black dark:text-white">₹{finalPrice.toLocaleString('en-IN')}</span>
                      {hasDiscount && mrp > finalPrice && (
                        <span className="text-xs text-black/50 dark:text-white/50 line-through">₹{mrp.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    {/* Selected Color Display */}
                    {selectedColor && (
                      <div className="flex items-center gap-1 mt-1">
                        <div 
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: selectedColor.colorCode || '#ccc' }}
                        />
                        <span className="text-xs text-black/60 dark:text-white/60 capitalize">{selectedColor.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full ">
                  <div className={` px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                    {stockStatus.text}
                  </div>
                  <AddToCartButton 
                    product={product}
                    selectedColor={selectedColor}
                    isOutOfStock={isOutOfStock}
                    onAddToCart={handleAddToCart}
                    isSticky={true}
                  />
                  <BuyNowButton 
                    product={product}
                    selectedColor={selectedColor}
                    isOutOfStock={isOutOfStock}
                    onBuyNow={handleBuyNow}
                    isSticky={true}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
          >
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setShowGalleryModal(false)}
                className="p-2 bg-white/10 rounded-full hover:bg-red-500 cursor-pointer transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            <div className="flex items-center justify-center h-full p-4">
              <img 
                src={(product.gallery || images)[galleryStartIndex]} 
                alt="Gallery"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-4">
                {(product.gallery || images).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGalleryStartIndex(idx)}
                    className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      galleryStartIndex === idx ? 'border-red-500' : 'border-white/30'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover cursor-pointer" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductAbout;