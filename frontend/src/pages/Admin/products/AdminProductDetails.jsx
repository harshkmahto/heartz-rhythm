// AdminProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, ShoppingBag, 
  Calendar, Clock, CheckCircle, AlertCircle, Star,
  Truck, RefreshCw, Eye, Image as ImageIcon,
  Palette, Info, FileText, Globe, Video,
  Percent, Grid3x3, Edit3, TrendingUp,
  X, Zap, Store, Mail, Phone, MapPin, Building,
  CreditCard, Shield, User, Briefcase, Hash, Link as LinkIcon,
  Calendar as CalendarIcon, Timer,
  AlertTriangle,
  Trash,
  ShieldBan
} from 'lucide-react';
import { getSingleProduct } from '../../../utils/product.apiRequest';
import { FaRegCopyright } from 'react-icons/fa';
import ReportingPRoduct from '../../../components/Admin/products/ReportingProduct';
import BlockProducts from '../../../components/Admin/products/BlockProducts';


const AdminProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [reportPopup, setReportPopup] = useState(false)
  const [blockPopup, setBlockPopup] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await getSingleProduct(productId);
      if (response.success) {
        setProduct(response.data.product);
        setSelectedImage(response.data.product.thumbnail);
        if (response.data.product.variants?.length > 0) {
          setSelectedVariant(response.data.product.variants[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = () => {
    switch (product?.status) {
      case 'active':
        return { color: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400', icon: CheckCircle, text: 'Active' };
      case 'draft':
        return { color: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400', icon: Clock, text: 'Draft' };
      case 'scheduled':
        return { color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400', icon: Calendar, text: 'Scheduled' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: AlertCircle, text: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  const discountPercent = product?.discount?.value > 0 ? 
    (product.discount.type === 'percentage' ? product.discount.value : 
      ((product.discount.value / selectedVariant?.mrp) * 100).toFixed(0)) : 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReport = () => {
    setSelectedProduct(product);
    setReportPopup(true);
  };

  const handleCloseReport = () => {
    setReportPopup(false);
  };

  const handleBlock = () => {
    setSelectedProduct(product);
    setBlockPopup(true);
  };

  const handleCloseBlock = () => {
    setBlockPopup(false);
  };

  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-black dark:via-red-950/20 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-700 dark:text-red-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-black dark:via-red-950/20 dark:to-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">Product Not Found</h2>
          <p className="text-red-600 dark:text-red-400 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold mx-auto cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-black dark:via-red-950/20 dark:to-black py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-black/40 rounded-xl border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>Back to Products</span>
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleReport}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all cursor-pointer"
            >
              <AlertTriangle size={16} />
              Report
            </button>

            <button 
              onClick={handleBlock}
              className='flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all cursor-pointer'>
              <ShieldBan size={16} />
              {product.isBlocked ? 'Unblock' : 'Block'}
            </button>
          </div>
        </div>

        {reportPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-md rounded-2xl">
            <ReportingPRoduct 
            product={selectedProduct}
            productId={product._id}
            onClose={handleCloseReport}/>
        </div>
        </div>
        )}

        {blockPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-md rounded-2xl">
            <BlockProducts
            product={selectedProduct}
            productId={product._id}
            onClose={handleCloseBlock}/>
        </div>
        </div>
        )}


        {/* PRODUCT DETAILS SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-red-600" size={24} />
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-100">Product Details</h2>
          </div>
          
          {/* Status Badges */}
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusConfig.color}`}>
              <StatusIcon size={14} />
              {statusConfig.text}
            </span>
            {product.isFeatured && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                <Star size={14} />
                Featured
              </span>
            )}
            {product.isComingSoon && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 flex items-center gap-1">
                <Clock size={14} />
                Coming Soon
              </span>
            )}
            {product.totalStock === 0 && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-800 text-black dark:text-white flex items-center gap-1">
                <X size={14} />
                Out of Stock
              </span>
            )}
            {product.totalStock <= 15 && product.totalStock > 0 && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-800 text-black dark:text-white flex items-center gap-1">
                <AlertCircle size={14} />
                Low Stock ({product.totalStock})
              </span>
            )}
          </div>

          {/* Scheduled Date Display */}
          {product.status === 'scheduled' && product.scheduledAt && (
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <CalendarIcon className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Scheduled to go live on:</p>
                  <p className="text-blue-700 dark:text-blue-400 font-semibold">{formatDateTime(product.scheduledAt)}</p>
                </div>
              </div>
            </div>
          )}

          {/* MAIN TWO COLUMN LAYOUT - Image Left | Info Right */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            
            {/* LEFT COLUMN - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-white/80 dark:bg-black/40 rounded-2xl overflow-hidden border border-red-200 dark:border-red-800">
                {selectedImage ? (
                  <img 
                    src={selectedImage} 
                    alt={product.title}
                    className="w-full h-96 object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                    <Package className="w-20 h-20 text-red-400" />
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.thumbnail && (
                  <button
                    onClick={() => setSelectedImage(product.thumbnail)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === product.thumbnail 
                        ? 'border-red-500 shadow-lg' 
                        : 'border-red-200 dark:border-red-700 hover:border-red-400'
                    }`}
                  >
                    <img src={product.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                )}
                {product.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img 
                        ? 'border-red-500 shadow-lg' 
                        : 'border-red-200 dark:border-red-700 hover:border-red-400'
                    }`}
                  >
                    <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN - Product Info */}
            <div className="space-y-5">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-900 dark:text-red-100">
                {product.title}
              </h1>
              
              {/* Subtitle */}
              {product.subtitle && (
                <p className="text-red-600 dark:text-red-400 text-lg">{product.subtitle}</p>
              )}
              
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                {product.subCategory && (
                  <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                    {product.subCategory}
                  </span>
                )}
                <span className="px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                  {product.brand}
                </span>
              </div>

              {/* Colors Section */}
              {product.variants && product.variants.length > 0 && (
                <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-5 border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                    <Palette size={18} />
                    Available Colors ({product.variants.length})
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {product.variants.map((variant, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedVariant(variant)}
                        className={`text-center p-2 rounded-xl transition-all ${
                          selectedVariant?.name === variant.name
                            ? 'bg-red-100 dark:bg-red-900/50 ring-2 ring-red-500'
                            : 'hover:bg-red-50 dark:hover:bg-red-900/30'
                        }`}
                      >
                        <div 
                          className="w-10 h-10 rounded-full border-2 border-red-300 shadow-md mx-auto"
                          style={{ backgroundColor: variant.colorCode || variant.color }}
                          title={variant.name}
                        />
                        <p className="text-xs text-red-700 dark:text-red-400 mt-1">{variant.colorName || variant.name}</p>
                        <p className="text-xs text-red-600 dark:text-red-500">Stock: {variant.stock}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Section */}
              <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-5 border border-red-200 dark:border-red-800">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-bold text-red-700 dark:text-red-300">
                    ₹{selectedVariant?.finalPrice?.toLocaleString() || selectedVariant?.basePrice?.toLocaleString()}
                  </span>
                  <span className="text-lg text-red-500 line-through">
                    ₹{selectedVariant?.mrp?.toLocaleString()}
                  </span>
                  {discountPercent > 0 && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm font-semibold">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-red-600 dark:text-red-400">Base Price: ₹{selectedVariant?.basePrice?.toLocaleString()}</span>
                  {product.discount?.code && (
                    <span className="text-red-600 dark:text-red-400">
                      Code: <span className="font-mono font-bold">{product.discount.code}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION SECTION */}
          {product.description && (
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-6 border border-red-200 dark:border-red-800 mb-6">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                <FileText size={18} />
                Description
              </h3>
              <p className="text-black dark:text-white leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* ABOUT SECTION */}
          {product.about && product.about.length > 0 && (
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-6 border border-red-200 dark:border-red-800 mb-6">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                <Info size={18} />
                Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.about.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-red-100 dark:border-red-800">
                    <span className="font-medium text-red-800 dark:text-red-300">{item.key}</span>
                    <span className="text-red-600 dark:text-red-400">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features & Policies */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                  <Zap size={18} />
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-red-700 dark:text-red-300">
                      <CheckCircle size={16} className="text-red-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Policies */}
            <div className="space-y-4">
              {/* Replacement Policy */}
              <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-5 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                    <RefreshCw size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-100">Replacement Policy</h3>
                    {product.replacement?.isAvailable ? (
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        Available within <strong>{product.replacement.duration} days</strong>
                      </p>
                    ) : (
                      <p className="text-red-600 dark:text-red-400 text-sm">Not available</p>
                    )}
                  </div>
                </div>
                {product.replacement?.policy && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2 pl-11">{product.replacement.policy}</p>
                )}
              </div>

              {/* Return Policy */}
              <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-5 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                    <Truck size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-100">Return Policy</h3>
                    {product.return?.isAvailable ? (
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        Available within <strong>{product.return.duration} days</strong>
                      </p>
                    ) : (
                      <p className="text-red-600 dark:text-red-400 text-sm">Not available</p>
                    )}
                  </div>
                </div>
                {product.return?.policy && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2 pl-11">{product.return.policy}</p>
                )}
              </div>
            </div>
          </div>

          {/* DISCOUNT SECTION */}
          {product.discount && product.discount.value > 0 && (
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-6 border border-red-200 dark:border-red-800 mb-6">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                <Percent size={18} />
                Discount Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400">Type</p>
                  <p className="text-red-800 dark:text-red-200 font-medium capitalize">{product.discount.type}</p>
                </div>
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400">Value</p>
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    {product.discount.type === 'percentage' ? `${product.discount.value}%` : `₹${product.discount.value}`}
                  </p>
                </div>
                {product.discount.code && (
                  <div>
                    <p className="text-sm text-red-600 dark:text-red-400">Code</p>
                    <p className="text-red-800 dark:text-red-200 font-mono font-medium">{product.discount.code}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Media Sections */}
          {product.showCase && product.showCase.length > 0 && (
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-6 border border-red-200 dark:border-red-800 mb-6">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
                <ImageIcon size={18} />
                Showcase
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.showCase.map((item, idx) => (
                  <div key={idx} className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.key} 
                        className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedImage(item.image)}
                      />
                    )}
                    <p className="font-medium text-red-800 dark:text-red-300">{item.key}</p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.gallery && product.gallery.length > 0 && (
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-6 border border-red-200 dark:border-red-800 mb-6">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
                <Grid3x3 size={18} />
                Gallery Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {product.gallery.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            </div>
          )}

          {product.videos && product.videos.length > 0 && (
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-6 border border-red-200 dark:border-red-800 mb-6">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
                <Video size={18} />
                Product Videos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.videos.map((video, idx) => (
                  <video key={idx} src={video} controls className="w-full rounded-xl" />
                ))}
              </div>
            </div>
          )}

          {/* SEO SECTION */}
          {product.seo && (product.seo.title || product.seo.description || product.seo.keywords?.length > 0) && (
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-6 border border-red-200 dark:border-red-800 mb-6">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                <Globe size={18} />
                SEO Information
              </h3>
              {product.seo.title && (
                <div className="mb-3">
                  <p className="text-sm text-red-600 dark:text-red-400">Meta Title</p>
                  <p className="text-red-800 dark:text-red-200">{product.seo.title}</p>
                </div>
              )}
              {product.seo.description && (
                <div className="mb-3">
                  <p className="text-sm text-red-600 dark:text-red-400">Meta Description</p>
                  <p className="text-red-800 dark:text-red-200">{product.seo.description}</p>
                </div>
              )}
              {product.seo.keywords && product.seo.keywords.length > 0 && (
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {product.seo.keywords.map((keyword, idx) => (
                      <span key={idx} className="px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-lg text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

         

        {/* SELLER DETAILS SECTION */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Store className="text-red-600" size={24} />
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-100">Seller Details</h2>
          </div>

          {/* User Details Card */}
          {product.seller && (
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-6 border border-red-200 dark:border-red-800 mb-6">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
                <User size={18} />
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <User className="text-red-500" size={20} />
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-400">Name</p>
                    <p className="text-red-800 dark:text-red-200 font-medium">{product.seller.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <Mail className="text-red-500" size={20} />
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-400">Email</p>
                    <p className="text-red-800 dark:text-red-200 font-medium">{product.seller.email || 'N/A'}</p>
                  </div>
                </div>
                {product.seller.phone && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <Phone className="text-red-500" size={20} />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400">Phone</p>
                      <p className="text-red-800 dark:text-red-200 font-medium">{product.seller.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <Shield className="text-red-500" size={20} />
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-400">Status</p>
                    <p className={`font-medium ${product.seller.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                      {product.seller.isBlocked ? 'Blocked' : 'Active'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <CheckCircle className="text-red-500" size={20} />
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-400">Verified</p>
                    <p className={`font-medium ${product.seller.verify ? 'text-green-600' : 'text-amber-600'}`}>
                      {product.seller.verify ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <Calendar className="text-red-500" size={20} />
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-400">Joined</p>
                    <p className="text-red-800 dark:text-red-200 font-medium">{formatDate(product.seller.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seller Panel Details */}
          {product.sellerPanel && (
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-6 border border-red-200 dark:border-red-800">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
                <Building size={18} />
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <Store className="text-red-500" size={20} />
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-400">Brand Name</p>
                    <p className="text-red-800 dark:text-red-200 font-medium">{product.sellerPanel.brandName || 'N/A'}</p>
                  </div>
                </div>
                 {product.sellerPanel.brandSince && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <Hash className="text-red-500" size={20} />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400">Brand Since</p>
                      <p className="text-red-800 dark:text-red-200 font-medium">{formatDate(product.sellerPanel.brandSince)}</p>
                    </div>
                  </div>
                )}

                {product.sellerPanel.brandCategory && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <Hash className="text-red-500" size={20} />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400">Brand Category</p>
                      <p className="text-red-800 dark:text-red-200 font-medium">{product.sellerPanel.brandCategory}</p>
                    </div>
                  </div>
                )}
                {product.sellerPanel.brandSubCategory && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <Hash className="text-red-500" size={20} />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400">Brand Sub-Category</p>
                      <p className="text-red-800 dark:text-red-200 font-medium">{product.sellerPanel.brandSubCategory}</p>
                    </div>
                  </div>
                )}
                {product.sellerPanel.sellerName && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <User className="text-red-500" size={20} />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400">Seller Name</p>
                      <p className="text-red-800 dark:text-red-200 font-medium">{product.sellerPanel.sellerName}</p>
                    </div>
                  </div>
                )}
                {product.sellerPanel.sellerEmail && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <Mail className="text-red-500" size={20} />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400">Seller Email</p>
                      <p className="text-red-800 dark:text-red-200 font-medium">{product.sellerPanel.sellerEmail}</p>
                    </div>
                  </div>
                )}
                {product.sellerPanel.sellerPhone && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <Phone className="text-red-500" size={20} />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400">Seller Phone</p>
                      <p className="text-red-800 dark:text-red-200 font-medium">{product.sellerPanel.sellerPhone}</p>
                    </div>
                  </div>
                )}
                {product.sellerPanel.gstNumber && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <CreditCard className="text-red-500" size={20} />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400">GST Number</p>
                      <p className="text-red-800 dark:text-red-200 font-medium">{product.sellerPanel.gstNumber}</p>
                    </div>
                  </div>
                )}
                {product.sellerPanel.panNumber && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <CreditCard className="text-red-500" size={20} />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400">PAN Number</p>
                      <p className="text-red-800 dark:text-red-200 font-medium">{product.sellerPanel.panNumber}</p>
                    </div>
                  </div>
                )}
                {product.sellerPanel.companyLocation && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <MapPin className="text-red-500" size={20} />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400">Company Location</p>
                      <p className="text-red-800 dark:text-red-200 font-medium">{product.sellerPanel.companyLocation}</p>
                    </div>
                  </div>
                )}
                {product.sellerPanel.pickupLocation && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <MapPin className="text-red-500" size={20} />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400">Pickup Location</p>
                      <p className="text-red-800 dark:text-red-200 font-medium">{product.sellerPanel.pickupLocation}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Brand Description */}
              {product.sellerPanel.brandDescription && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <p className="text-xs text-red-600 dark:text-red-400 mb-1">Brand Description</p>
                  <p className="text-red-800 dark:text-red-200 text-sm">{product.sellerPanel.brandDescription}</p>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
         {/* STATISTICS FOOTER */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-4 text-center border border-red-200 dark:border-red-800">
              <Calendar size={18} className="text-red-500 mx-auto mb-1" />
              <p className="text-xs text-red-600 dark:text-red-400">Created</p>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{formatDate(product.createdAt)}</p>
            </div>
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-4 text-center border border-red-200 dark:border-red-800">
              <Eye size={18} className="text-red-500 mx-auto mb-1" />
              <p className="text-xs text-red-600 dark:text-red-400">Views</p>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{product.viewCount || 0}</p>
            </div>
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-4 text-center border border-red-200 dark:border-red-800">
              <ShoppingBag size={18} className="text-red-500 mx-auto mb-1" />
              <p className="text-xs text-red-600 dark:text-red-400">Total Stock</p>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{product.totalStock || 0}</p>
            </div>
            <div className="bg-white/80 dark:bg-black/40 rounded-2xl p-4 text-center border border-red-200 dark:border-red-800">
              <TrendingUp size={18} className="text-red-500 mx-auto mb-1" />
              <p className="text-xs text-red-600 dark:text-red-400">Total Sold</p>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{product.totalSold || 0}</p>
            </div>
          </div>
        </div>
      
    </div>
  );
};

export default AdminProductDetails;