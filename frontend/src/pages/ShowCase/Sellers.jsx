import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  Star, 
  Package, 
  Award,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Shield,
  Music,
  ArrowLeft
} from 'lucide-react';
import { getAllSellerPanels } from '../../utils/apiRequest'; 

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSellers();
  }, []);

  // Helper function to calculate average rating from reviews array
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  };

  // Helper function to get total products count (you'll get this from API or calculate)
  const getTotalProducts = (seller) => {
    // If your API returns product count, use it
    if (seller.productCount !== undefined) return seller.productCount;
    if (seller.productsCount) return seller.productsCount;
    // If you have products array in response
    if (seller.products && Array.isArray(seller.products)) return seller.products.length;
    // Default fallback - you can also fetch from another API
    return Math.floor(Math.random() * 50) + 20; // Remove this once you have real data
  };

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await getAllSellerPanels();
      console.log('API Response:', response);
      
      let sellersData = [];
      if (response.data && Array.isArray(response.data)) {
        sellersData = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        sellersData = response.data.data;
      } else if (Array.isArray(response)) {
        sellersData = response;
      } else if (response.data && response.data.sellers) {
        sellersData = response.data.sellers;
      }
      
      // Process each seller to add calculated fields
      const processedSellers = sellersData.map(seller => ({
        ...seller,
        averageRating: calculateAverageRating(seller.reviews),
        totalReviews: seller.reviews?.length || 0,
        totalProducts: getTotalProducts(seller)
      }));
      
      setSellers(processedSellers);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sellers:', err);
      setError(err.response?.data?.message || 'Failed to fetch sellers');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/10 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading amazing brands...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/10 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
          <button 
            onClick={fetchSellers}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/10 dark:to-black">
      
      {/* Header Section */}
      <div className="relative pt-12 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-red-100 dark:bg-red-950/50 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-300 font-medium">Premium Brands</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              Explore Our
              <span className="block text-red-600 dark:text-red-500">Trusted Brands</span>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Discover authentic instruments from verified sellers worldwide
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Shield className="w-4 h-4 text-red-500" />
                <span>100% Verified Sellers</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span>Top Rated Brands</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Music className="w-4 h-4 text-red-500" />
                <span>Authentic Instruments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sellers Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {sellers.length === 0 ? (
          <div className="text-center py-16">
            <Store className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No sellers found at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sellers.map((seller, index) => (
              <Link 
                key={seller._id || index}
                to={`/seller/brand/${seller.brandName?.toLowerCase()}`}
                className="group block transform transition-all duration-500 hover:-translate-y-2"
              >
                <div className="bg-white dark:bg-black/40 rounded-2xl border border-red-100 dark:border-red-900/30 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 h-full">
                  
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    {seller.coverImage ? (
                      <img 
                        src={seller.coverImage}
                        alt={seller.brandName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1510915361019-2d8e3a9a4b5e?w=800";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-950 dark:to-red-900 flex items-center justify-center">
                        <Store className="w-16 h-16 text-red-600 dark:text-red-500" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-medium">
                        {seller.averageRating || 0}
                      </span>
                      <span className="text-white/60 text-xs">
                        ({seller.totalReviews || 0})
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="relative px-5 pb-5">
                    
                    {/* Logo - Floating card style */}
                    <div className="relative -mt-12 mb-4 flex justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-rose-500 p-0.5 shadow-xl">
                        <div className="w-full h-full rounded-full bg-white dark:bg-red-950 overflow-hidden flex items-center justify-center">
                          {seller.logo ? (
                            <img 
                              src={seller.logo}
                              alt={seller.brandName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200";
                              }}
                            />
                          ) : (
                            <Store className="w-12 h-12 text-gray-400 dark:text-red-500" />
                          )}  
                        </div>
                      </div>
                    </div>
                    
                    {/* Brand Name */}
                    <div className="text-center mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {seller.brandName || "Brand Name"}
                      </h3>
                      
                      {/* Since Badge */}
                      {seller.brandSince && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Since {new Date(seller.brandSince).getFullYear()}
                          </span>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        by {seller.sellerName || "Seller"}
                      </p>
                    </div>
                    
                    {/* Category Tags */}
                    <div className="flex flex-wrap justify-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full">
                        {seller.brandCategory || "Instruments"}
                      </span>
                      {seller.brandSubCategory && (
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                          {seller.brandSubCategory}
                        </span>
                      )}
                    </div>
                    
                    {/* Speciality */}
                    {seller.brandSpeciality && (
                      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {seller.brandSpeciality}
                      </p>
                    )}
                    
                    {/* Features */}
                    {seller.brandFeatures && seller.brandFeatures.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {seller.brandFeatures.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-full">
                            ✓ {feature}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Divider */}
                    <div className="border-t border-red-100 dark:border-red-900/30 my-3"></div>
                    
                    {/* Footer Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-blue-500" />
                        </div>
                       
                      </div>
                      
                      {/* Star Rating Summary */}
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= Math.round(seller.averageRating || 0)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-red-500 group-hover:gap-2 transition-all">
                        <span className="text-sm font-medium">Visit</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Bottom Decorative Text */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-full">
            <span className="text-2xl">🎸</span>
            <p className="text-gray-700 dark:text-gray-300">
              Join our community of <strong className="text-red-600 dark:text-red-400">trusted sellers</strong>
            </p>
            <span className="text-2xl">🎵</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">
            All sellers are verified and committed to quality and authenticity
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sellers;