import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getComingSoonDetails } from '../../utils/product.apiRequest';
import {
  Calendar, Clock, Bell, Tag, Sparkles, 
  X, Share2, CheckCircle, Package, 
  Truck, Shield, Eye, Building2, 
  Copy, Check, ChevronLeft, ChevronRight
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentModalIndex, setCurrentModalIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await getComingSoonDetails(id);
      if (response.success) {
        setProduct(response.data);
        // Use gallery images first, fallback to images
        const displayImages = response.data.gallery?.length > 0 
          ? response.data.gallery 
          : response.data.images || [];
        if (displayImages.length > 0) {
          setSelectedImage(displayImages[0]);
        }
      } else {
        setError(response.message || 'Failed to fetch product');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  // Get gallery images (priority), fallback to images
  const galleryImages = product?.gallery?.length > 0 
    ? product.gallery 
    : product?.images || [];
  const hasGallery = galleryImages.length > 0;

  const openImageModal = (imageUrl, index) => {
    setSelectedImage(imageUrl);
    setCurrentModalIndex(index);
    setImageModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (currentModalIndex < galleryImages.length - 1) {
      const newIndex = currentModalIndex + 1;
      setCurrentModalIndex(newIndex);
      setSelectedImage(galleryImages[newIndex]);
    }
  };

  const prevImage = () => {
    if (currentModalIndex > 0) {
      const newIndex = currentModalIndex - 1;
      setCurrentModalIndex(newIndex);
      setSelectedImage(galleryImages[newIndex]);
    }
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Countdown timer
  const getTimeLeft = () => {
    if (!product?.scheduledAt) return null;
    const now = new Date();
    const target = new Date(product.scheduledAt);
    const difference = target - now;
    
    if (difference <= 0) return null;
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  };

  const timeLeft = getTimeLeft();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-gray-950 dark:via-black dark:to-red-950">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-red-200 dark:border-red-900/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-red-600 border-r-red-500 border-b-red-400 border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-gray-950 dark:via-black dark:to-red-950">
        <div className="text-center bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Product Not Found</h3>
          <p className="text-red-600 dark:text-red-300">{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/" className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-gray-950 dark:via-black dark:to-red-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Coming Soon Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full mb-4 animate-pulse">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Coming Soon</span>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="rounded-2xl overflow-hidden">
          
          {/* Image Gallery Section */}
          <div className="grid lg:grid-cols-2 gap-8 p-6 md:p-8">
            
            {/* Left Column - Large Image */}
            <div>
              <div 
                className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-950/30 dark:to-rose-950/30 mb-4 cursor-pointer group"
                onClick={() => hasGallery && openImageModal(selectedImage, galleryImages.indexOf(selectedImage))}
              >
                {selectedImage ? (
                  <img 
                    src={selectedImage} 
                    alt={product.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-20 h-20 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Small Gallery Thumbnails */}
              {hasGallery && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {galleryImages.map((img, idx) => (
                    <div 
                      key={idx}
                      className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                        selectedImage === img ? 'border-red-500 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-red-300'
                      }`}
                      onClick={() => {
                        setSelectedImage(img);
                        setCurrentModalIndex(idx);
                      }}
                    >
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div>
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">{product.title}</h1>
              {product.subtitle && (
                <p className="text-gray-500 dark:text-gray-400 mb-4">{product.subtitle}</p>
              )}

              {/* Category & Subcategory */}
              <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                {product.category && (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {product.category}
                  </span>
                )}
                {product.subCategory && (
                  <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-full text-sm font-medium">
                    {product.subCategory}
                  </span>
                )}
              </div>

              {/* Share Section */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
                <button 
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-red-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-red-500">Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Coming Soon Card */}
              <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 rounded-xl p-6 mb-6 border border-red-200 dark:border-red-800/30">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-3 animate-pulse" />
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Coming Soon!</h3>
                  
                  {timeLeft && (
                    <div className="mt-4">
                      <div className="flex gap-2 md:gap-3 justify-center">
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-lg px-2 py-2 min-w-[55px] md:min-w-[70px]">
                            <span className="text-xl md:text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Days</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-lg px-2 py-2 min-w-[55px] md:min-w-[70px]">
                            <span className="text-xl md:text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hours</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-lg px-2 py-2 min-w-[55px] md:min-w-[70px]">
                            <span className="text-xl md:text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mins</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-lg px-2 py-2 min-w-[55px] md:min-w-[70px]">
                            <span className="text-xl md:text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Secs</p>
                        </div>
                      </div>
                      {product.scheduledAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                          Release Date: {new Date(product.scheduledAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {!timeLeft && product.scheduledAt && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      This product will be available soon!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Features Section */}
          <div className="grid lg:grid-cols-2 gap-8 border-t border-gray-200 dark:border-gray-800 p-6 md:p-8">
            
            <div>
              {product.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-red-500" />
                    Product Description
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {product.features && product.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-red-500" />
                    Key Features
                  </h2>
                  <div className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-red-500" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {product.about && product.about.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-500" />
                  Specifications
                </h2>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl overflow-hidden">
                  {product.about.map((item, idx) => (
                    <div key={idx} className={`flex flex-col sm:flex-row py-3 px-4 ${idx !== product.about.length - 1 ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}>
                      <span className="sm:w-1/3 font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">{item.key}</span>
                      <span className="sm:w-2/3 text-gray-600 dark:text-gray-400">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Brand Section */}
          {product.sellerPanel && (
            <div className="border-t border-gray-200 dark:border-gray-800 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-500" />
                Brand Information
              </h2>
              <Link 
                to={`/seller/brand/${product.sellerPanel.brandName}`}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
              >
                {product.sellerPanel.logo ? (
                  <img 
                    src={product.sellerPanel.logo} 
                    alt={product.brand} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-red-200 dark:border-red-800 group-hover:border-red-500 transition-all"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center">
                    <Tag className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-white text-lg">{product.brand}</p>
                  {product.sellerPanel.brandDescription && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{product.sellerPanel.brandDescription}</p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              </Link>
            </div>
          )}

          {/* Product Gallery Section - Using gallery images */}
          {hasGallery && galleryImages.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-800 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-red-500" />
                Product Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((img, idx) => (
                  <div 
                    key={idx}
                    className="relative group cursor-pointer rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square"
                    onClick={() => openImageModal(img, idx)}
                  >
                    <img 
                      src={img} 
                      alt={`Gallery ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {imageModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={closeImageModal}>
          <div className="relative max-w-6xl w-full mx-4">
            <button 
              onClick={closeImageModal} 
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            
            {currentModalIndex > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            
            {currentModalIndex < galleryImages.length - 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
            
            <div className="absolute -top-12 left-0 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
              {currentModalIndex + 1} / {galleryImages.length}
            </div>
            
            <img 
              src={selectedImage} 
              alt="Full screen" 
              className="w-full max-h-[85vh] object-contain rounded-2xl" 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;