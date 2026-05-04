import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllSellerPanels, getSellerPanelById } from '../../utils/apiRequest';
import { getSellerReview } from '../../utils/reviews.apiRequest';
import Loader from '../../components/ShowCaseSection/Loader';
import {
  MapPin, Calendar, Briefcase, Mail, Phone, 
  Award, CheckCircle, Sparkles, Tag, 
  Store, User, Building2, MapPinned, Truck,
  Image as ImageIcon, ListChecks, ShoppingBag,
  Eye, Star, Heart, ExternalLink, Clock,
  ChevronRight, MessageCircle, ThumbsUp,
  ChevronLeft, X, Maximize2
} from 'lucide-react';
import Button from '../../components/ShowCaseSection/Buttons';
import AddReview from '../../components/Seller/AddReview';

const SellerBrandDetails = () => {
  const { brandName } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [sellerData, setSellerData] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sellerPanelId, setSellerPanelId] = useState(null);
  const [reviewPopup, setReviewPopup] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);

  // Calculate average rating from sellerData.reviews
  const calculateAverageRating = (reviewsArray) => {
    if (!reviewsArray || reviewsArray.length === 0) return 0;
    const sum = reviewsArray.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviewsArray.length).toFixed(1));
  };

  // Calculate rating distribution
  const getRatingDistribution = (reviewsArray) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsArray.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });
    return distribution;
  };

  // Scroll handlers for horizontal review scroll
  const scrollLeft = () => {
    const container = document.getElementById('reviews-scroll-container');
    if (container) {
      container.scrollBy({ left: -320, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft);
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('reviews-scroll-container');
    if (container) {
      container.scrollBy({ left: 320, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft);
    }
  };

  // Update scroll position on scroll
  useEffect(() => {
    const container = document.getElementById('reviews-scroll-container');
    if (container) {
      const handleScroll = () => setScrollPosition(container.scrollLeft);
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [reviews]);

  // Open image popup
  const openImagePopup = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImagePopupOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close image popup
  const closeImagePopup = () => {
    setImagePopupOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        setLoading(true);
        
        const response = await getAllSellerPanels();
        
        if (response.success && response.data) {
          const sellers = response.data;
          const decodedBrandName = decodeURIComponent(brandName).toLowerCase();
          
          const seller = sellers.find(
            s => s.brandName && s.brandName.toLowerCase() === decodedBrandName
          );
          
          if (seller) {
            setSellerPanelId(seller._id);
            
            const fullDetailsResponse = await getSellerPanelById(seller._id);
            
            if (fullDetailsResponse.success) {
              setSellerData(fullDetailsResponse.data.sellerInfo);
              setProducts(fullDetailsResponse.data.products?.list || []);
            } else {
              setSellerData(seller);
              setProducts([]);
            }

            // Fetch reviews separately (populated with user details)
            const reviewsResponse = await getSellerReview(seller._id);
            if (reviewsResponse.success) {
              setReviews(reviewsResponse.data || []);
            }
          } else {
            setError(`Seller "${brandName}" not found`);
          }
        } else {
          setError(response.message || 'Failed to fetch seller details');
        }
      } catch (error) {
        console.error('Error fetching seller details:', error);
        setError(error.message || 'Failed to fetch seller details');
      } finally {
        setLoading(false);
      }
    };

    if (brandName) {
      fetchSellerDetails();
    }
  }, [brandName]);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.getFullYear();
  };

  const formatReviewDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Get data from sellerData
  const sellerReviews = sellerData?.reviews || [];
  const averageRating = calculateAverageRating(sellerReviews);
  const totalReviews = sellerReviews.length;
  const ratingDistribution = getRatingDistribution(sellerReviews);

  const handleReview = () => {
    setReviewPopup(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-gray-950 dark:via-black dark:to-red-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <Loader />
        </div>
      </div>
    );
  }

  if (error || !sellerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-gray-950 dark:via-black dark:to-red-950">
        <div className="text-center bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Seller Not Found</h3>
          <p className="text-red-600 dark:text-red-300 mb-4">{error || `Seller "${brandName}" does not exist or is not active.`}</p>
          <Link to="/" className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  const totalProducts = products.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-gray-950 dark:via-black dark:to-red-950">
      
      {/* COVER IMAGE SECTION */}
      <div className="relative h-80 md:h-96 w-full overflow-hidden">
        {sellerData?.coverImage ? (
          <img
            src={sellerData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => openImagePopup(sellerData.coverImage)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-red-700 to-rose-800 flex items-center justify-center">
            <Store className="w-24 h-24 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/70 via-red-900/20 to-red-800/30 dark:from-gray-950/80 dark:via-gray-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10"></div>

        {/* Verified Badge */}
        <div className="absolute top-6 right-6 z-10">
          <div className="px-4 py-2 bg-red-600/95 backdrop-blur-md rounded-full shadow-xl border border-red-400/30">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <p className="text-white font-semibold text-sm tracking-wide">VERIFIED SELLER</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        
        {/* BRAND INFO CARD */}
        <div className="relative bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border border-red-200/50 dark:border-red-800/30">
          
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
            
            {/* Logo - Clickable */}
            <div className="relative flex-shrink-0 cursor-pointer" onClick={() => sellerData?.logo && openImagePopup(sellerData.logo)}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-rose-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden bg-red-100 dark:bg-red-900/50">
                  {sellerData?.logo ? (
                    <img 
                      src={sellerData.logo} 
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="w-12 h-12 text-red-500" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            {/* Brand Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap mb-2">
                <h1 className="uppercase text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent dark:from-red-400 dark:via-red-300 dark:to-red-200">
                  {sellerData?.brandName || "BRAND NAME"}
                </h1>
                {sellerData.brandSince && (
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 text-xs font-bold rounded-full">
                    SINCE {formatDate(sellerData.brandSince)}
                  </span>
                )}
                {/* Average Rating Badge */}
                {averageRating > 0 && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-sm font-bold rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    {averageRating} 
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                {sellerData.brandCategory && (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full text-sm font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {sellerData.brandCategory}
                  </span>
                )}
                {sellerData.brandSubCategory && (
                  <span className="px-3 py-1 border border-red-500 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {sellerData.brandSubCategory}
                  </span>
                )}
              </div>
              
              {sellerData.brandSpeciality && (
                <div className="bg-gradient-to-r from-red-50 to-transparent dark:from-red-950/30 p-3 rounded-xl border-l-4 border-red-500 mt-2">
                  <p className="text-red-800 dark:text-red-300 font-semibold flex items-center gap-2 text-sm justify-center md:justify-start">
                    <Sparkles className="w-4 h-4" /> {sellerData.brandSpeciality}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - Description, Features, Gallery */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description Section */}
            {sellerData.brandDescription && (
              <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 dark:border-red-800/30 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                    <Briefcase className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">About the Brand</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {sellerData.brandDescription}
                </p>
              </div>
            )}

            {/* Features Section */}
            {sellerData.brandFeatures && sellerData.brandFeatures.length > 0 && (
              <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 dark:border-red-800/30 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                    <ListChecks className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Key Features</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sellerData.brandFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-red-50/50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
                      <CheckCircle className="w-4 h-4 text-red-500" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Section - Clickable Images */}
            {sellerData.previewImage && sellerData.previewImage.length > 0 && (
              <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 dark:border-red-800/30 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                    <ImageIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Gallery</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sellerData.previewImage.map((img, i) => (
                    <div 
                      key={i} 
                      className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
                      onClick={() => openImagePopup(img)}
                    >
                      <img
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Seller Info & Pickup */}
          <div className="space-y-6">
            
            <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 dark:border-red-800/30 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                  <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Seller Information</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Seller Name</p>
                  <p className="text-gray-800 dark:text-gray-200 font-medium mt-1">{sellerData.sellerName || 'N/A'}</p>
                </div>
                {sellerData.brandPhone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <Phone className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-gray-800 dark:text-gray-200">{sellerData.brandPhone}</p>
                    </div>
                  </div>
                )}
                {sellerData.brandEmail && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <Mail className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-800 dark:text-gray-200">{sellerData.brandEmail}</p>
                    </div>
                  </div>
                )}
                {sellerData.companyLocation && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-gray-800 dark:text-gray-200">{sellerData.companyLocation}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <ShoppingBag className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Products</p>
                    <p className="text-gray-800 dark:text-gray-200 font-bold text-lg">{totalProducts}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Information */}
            {(sellerData.pickupLocation || sellerData.pickupAddress) && (
              <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 dark:border-red-800/30 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                    <Truck className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Pickup Information</h3>
                </div>
                <div className="space-y-3">
                  {sellerData.pickupLocation && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <MapPinned className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pickup Location</p>
                        <p className="text-gray-800 dark:text-gray-200">{sellerData.pickupLocation}</p>
                      </div>
                    </div>
                  )}
                  {sellerData.pickupAddress && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pickup Address</p>
                        <p className="text-gray-800 dark:text-gray-200 text-sm">{sellerData.pickupAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* REVIEWS SECTION - Horizontally Scrollable */}
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 dark:border-red-800/30 shadow-xl mt-12">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                <MessageCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Customer Reviews</h3>
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full text-sm ml-2">
                {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>
            <Button text='Add Rating' variant='' textColor='' size='sm' onClick={handleReview} />
          </div>

          {/* Rating Summary Row */}
          {totalReviews > 0 ? (
            <>
              <div className="flex flex-col md:flex-row gap-8 mb-8 pb-6 border-b border-red-100 dark:border-red-800/30">
                {/* Average Rating */}
                <div className="text-center md:text-left">
                  <div className="text-4xl font-black text-gray-800 dark:text-white">
                    {averageRating}
                  </div>
                  <div className="flex justify-center md:justify-start gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(averageRating)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                  </p>
                </div>

                {/* Rating Distribution Bars */}
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratingDistribution[rating];
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating}</span>
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-12 text-right">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Horizontally Scrollable Reviews */}
              {reviews.length > 0 && (
                <div className="relative">
                  {/* Left Scroll Button */}
                  {scrollPosition > 0 && (
                    <button
                      onClick={scrollLeft}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-blackrounded-full p-2 shadow-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-red-600 cursor-pointer" />
                    </button>
                  )}

                  {/* Right Scroll Button */}
                  <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-black rounded-full p-2 shadow-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-red-600 cursor-pointer" />
                  </button>

                  {/* Scrollable Container */}
                  <div
                    id="reviews-scroll-container"
                    className="flex overflow-x-auto gap-4 pb-4 scroll-smooth hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {reviews.map((review, index) => (
                      <div
                        key={review._id || index}
                        className="min-w-[300px] md:min-w-[350px] bg-gray-50 dark:bg-black rounded-xl p-4 border border-red-100 dark:border-red-800 flex-shrink-0"
                      >
                        <div className="flex items-start gap-3">
                          {/* User Avatar */}
                          <div className="flex-shrink-0">
                            {review.user?.profilePicture?.url ? (
                              <img 
                                src={review.user.profilePicture.url} 
                                alt={review.user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                          
                          {/* Review Content */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <div>
                                <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                                  {review.user?.name || 'Anonymous User'}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-3 h-3 ${
                                          star <= review.rating
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-300 dark:text-gray-600'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {formatReviewDate(review.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed line-clamp-3">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Be the first to review this seller!</p>
            </div>
          )}
        </div>

        {/* PRODUCTS SECTION */}
        {products.length > 0 ? (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Products</h2>
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full text-sm ml-2">
                {products.length} Products
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link 
                  key={product._id} 
                  to={`/product/details/${product.category}/${product._id}`}
                  className="group bg-white dark:bg-red-900/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-100 dark:border-red-800/30"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (product.images && product.images[0]) ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                      </div>
                    )}
                    
                    {product.discount && product.discount.value > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        {product.discount.value}{product.discount.type === 'percentage' ? '% OFF' : ' OFF'}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {product.category && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                        {product.category}
                      </p>
                    )}
                    
                    <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {product.title}
                    </h3>

                    <button className="w-full mt-2 py-2 bg-red-50 dark:bg-black text-red-600 dark:text-red-400 rounded-xl font-medium group-hover:bg-red-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-12 text-center py-12 bg-white/50 dark:bg-black/50 rounded-2xl">
            <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">Products Coming Soon</h3>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Check back later for products from this seller.</p>
          </div>
        )}
      </div>

      {/* Review Popup */}
      {reviewPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl">
            <AddReview 
              sellerId={sellerData._id}
              onClose={() => setReviewPopup(false)}
              onReviewAdded={() => {
                setReviewPopup(false);
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}

      {/* Fullscreen Image Popup */}
      {imagePopupOpen && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={closeImagePopup}>
          <button
            onClick={closeImagePopup}
            className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-white cursor-pointer" />
          </button>
          <img
            src={selectedImage}
            alt="Fullscreen"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SellerBrandDetails;