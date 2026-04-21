// ProductAbout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Share2, ShoppingCart, Zap, 
  Shield, RotateCcw, Truck, Clock, 
  X, ZoomIn, ChevronLeft, ChevronRight,
  Play, Pause, Check, AlertCircle
} from 'lucide-react';
import { getSinglePublicProduct } from '../../utils/product.apiRequest';
import Loader from '../ShowCaseSection/Loader';
import CheckPin from './CheckPin';

const ProductAbout = () => {
  const {  productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const stickyTriggerRef = useRef(null);

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
  
  const finalPrice = currentVariant?.finalPrice || product.finalPrice || 0 ;
  const mrp = currentVariant?.mrp || product.mrp || 0;

  // Handle zoom on mouse move
  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // Get stock status
  const getStockStatus = () => {
    if (isOutOfStock) return { text: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950' };
    if (isLowStock) return { text: `Only ${currentVariant.stock} left in stock`, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950' };
    return { text: 'In Stock', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' };
  };

  const stockStatus = getStockStatus();

  // Helper function to safely get string value from category/subcategory
  const getSafeStringValue = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.name) return value.name;
    if (typeof value === 'object' && value._id) return value._id;
    return String(value);
  };

  // Get category name
  const getCategoryName = () => {
    return getSafeStringValue(product.category);
  };

  // Get subcategory name
  const getSubCategoryName = () => {
    return getSafeStringValue(product.subCategory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-red-50 dark:from-red-950 dark:via-black dark:to-red-950">
      <main className="pt-20 md:pt-24 pb-20 px-4 md:px-8">
        <div className=" mx-auto">
          
          {/* Product Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left Side - Images */}
            <div className="space-y-4">
              {/* Main Image with Zoom */}
              <div 
                className="relative aspect-square bg-white/50 dark:bg-black/50 rounded-2xl overflow-hidden border border-red-200 dark:border-red-900 cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img 
                  src={currentImage} 
                  alt={product.title}
                  className="w-full h-full object-contain p-4 transition-transform duration-200"
                  style={{
                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  }}
                />
               
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
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
                <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white mb-2">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="text-black/60 dark:text-white/60 text-sm">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* Category and Subcategory */}
              <div className="flex flex-wrap gap-2">
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
              <div className="flex items-center gap-3">
                {product.sellerPanel?.logo && (
                  <img src={product.sellerPanel.logo} alt={product.brand} className="w-8 h-8 rounded-full object-cover" />
                )}
                <span className="text-black dark:text-white font-medium">{product.brand || 'Unknown Brand'}</span>
              </div>

              {/* Wishlist & Share Icons */}
              <div className="flex gap-3">
                <button className="p-3 rounded-full bg-white dark:bg-black border border-red-200 dark:border-red-900 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                  <Heart size={20} />
                </button>
                <button className="p-3 rounded-full bg-white dark:bg-black border border-red-200 dark:border-red-900 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
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
                      <span className="text-lg text-black/50 dark:text-white/50 line-through">
                        ₹{mrp.toLocaleString('en-IN')}
                      </span>
                    
                </div>
              </div>

              {/* Add to Cart & Buy Now Buttons */}
              <div className="flex gap-4">
                <button 
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed text-gray-500'
                      : 'bg-white dark:bg-black border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
                <button 
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed text-gray-500'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  <Zap size={18} />
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Features & About Section */}
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
              {product.about && typeof product.about === 'object' && Object.keys(product.about).length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Key Specifications</h2>
                  <div className="space-y-3">
                    {Object.entries(product.about).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-red-100 dark:border-red-900">
                        <span className="text-black/60 dark:text-white/60 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-black dark:text-white font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>


            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16'>
          <div className='flex flex-col gap-8 mb-16'>
              <CheckPin/>
          
          {/* PIN & Return & Replacement Policies */}
          {(product.return?.isAvailable || product.replacement?.isAvailable) && (
            <div className="flex flex-col gap-6 ">
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

          {/* Product Description */}
          {product.description && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Description</h2>
              <div className="prose prose-red max-w-none">
                <p className="text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </div>
            </div>
          )}
          </div>
          </div>

          {/* Showcase Section */}
          {product.showCase && product.showCase.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Product Showcase</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.showCase.map((item, idx) => (
                  <div key={idx} className="bg-white/50 dark:bg-black/50 rounded-2xl overflow-hidden border border-red-200 dark:border-red-900">
                    {item.image && (
                      <img src={item.image} alt={item.title || 'Showcase'} className="w-full h-64 object-cover" />
                    )}
                    <div className="p-6">
                      {item.title && <h3 className="text-xl font-bold text-black dark:text-white mb-2">{item.title}</h3>}
                      {item.description && (
                        <p className="text-black/60 dark:text-white/60">{item.description}</p>
                      )}
                      {item.specs && typeof item.specs === 'object' && Object.keys(item.specs).length > 0 && (
                        <div className="mt-4 space-y-2">
                          {Object.entries(item.specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-black/50 dark:text-white/50">{key}</span>
                              <span className="text-black dark:text-white font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                    <div key={idx} className="flex-shrink-0 w-full md:w-[500px]">
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
                            <Play size={48} className="text-white" />
                          ) : (
                            <Pause size={48} className="text-white" />
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
                          scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
                        }
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/80 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                        }
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/80 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Gallery Section with Hover Effect */}
          {product.gallery && product.gallery.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      <ZoomIn size={24} className="text-white" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-red-200 dark:border-red-900 shadow-2xl z-40"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <img src={product.thumbnail} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-black dark:text-white text-sm line-clamp-1">{product.title}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-black dark:text-white">₹{finalPrice.toLocaleString('en-IN')}</span>
                      {hasDiscount && mrp > finalPrice && (
                        <span className="text-xs text-black/50 dark:text-white/50 line-through">₹{mrp.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                    {stockStatus.text}
                  </div>
                  <button 
                    disabled={isOutOfStock}
                    className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                      isOutOfStock
                        ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
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
            onClick={() => setShowGalleryModal(false)}
          >
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setShowGalleryModal(false)}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
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
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      galleryStartIndex === idx ? 'border-red-500' : 'border-white/30'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
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