import React from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../utils/productApi';
import { ArrowRight, Star, Clock, Eye, IndianRupee } from 'lucide-react';

const ProductsGrid = () => {
  const { data, isLoading, error } = useGetProductsQuery({
    page: 1,
    limit: 2,
    sort: '-createdAt' 
  });

  const products = data?.data?.products || [];

  if (isLoading) {
    return (
      <div className="min-h-[800px] flex items-center justify-center bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/20 dark:to-black">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-red-200 dark:border-red-900/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-red-600 border-r-red-500 border-b-red-400 border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Loading latest collections...</p>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  const firstProduct = products[0];
  const secondProduct = products[1];

  return (
    <div className="w-full bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/20 dark:to-black">
      {/* Main Heading  */}
      <div className="pt-12 pb-6 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
          Latest Collections
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Discover our newest arrivals
        </p>
      </div>

  
      <div className="flex flex-col md:flex-row w-full">
        {/* Left Side - First Latest Product */}
        <Link 
          to={`/product/details/${firstProduct.category?.toLowerCase() || 'general'}/${firstProduct._id}`}
          className="group relative h-[500px] md:h-[600px] lg:h-[700px] flex-1 overflow-hidden cursor-pointer"
        >
          
          <div className="absolute inset-0">
            {firstProduct.images && firstProduct.images[0] ? (
              <>
                <img 
                  src={firstProduct.images[0]} 
                  alt={firstProduct.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/70 transition-all duration-500"></div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🎸</div>
                  <p className="text-white text-xl">No Image</p>
                </div>
              </div>
            )}
          </div>

       
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12">
            {/* Badge */}
            <div className="mb-3 animate-fadeInUp">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
                <Clock className="w-3 h-3" />
                LATEST ARRIVAL
              </span>
            </div>

            {/* Category */}
            <div className="mb-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <span className="text-red-400 text-xs md:text-sm font-semibold uppercase tracking-wider">
                {firstProduct.category || 'Premium'} / {firstProduct.subcategory || 'Collection'}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 animate-fadeInUp line-clamp-2" style={{ animationDelay: '0.2s' }}>
              {firstProduct.title}
            </h2>


            {/* Price & Rating */}
            <div className="flex flex-wrap items-center gap-3 mb-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              {firstProduct.variants && firstProduct.variants[0] && (
                <div className="flex items-baseline gap-2 flex-wrap">
                  {/* Final Price */}
                  <div className="flex items-baseline gap-1">
                    <IndianRupee className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    <span className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                      {firstProduct.variants[0].finalPrice?.toFixed(2) }
                    </span>
                  </div>
                  {/* MRP  */}
                  {firstProduct.variants[0].mrp&& (
                    <div className="flex items-baseline gap-1">
                      <IndianRupee className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400 line-through text-xs md:text-sm">
                        {firstProduct.variants[0].mrp.toFixed(2)}
                      </span>
                    </div>
                  )}
               
                </div>
              )}
              
              {firstProduct.averageRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white text-xs md:text-sm">{firstProduct.averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Button */}
            <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white text-gray-900 font-semibold rounded-full text-sm md:text-base group-hover:gap-3 transition-all duration-300 hover:bg-red-600 hover:text-white">
                <span>Explore Collection</span>
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Hover Effect Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </Link>

        {/* Right Side - Second Latest Product */}
        {secondProduct && (
          <Link 
            to={`/product/details/${secondProduct.category}/${secondProduct._id}`}
            className="group relative h-[500px] md:h-[600px] lg:h-[700px] flex-1 overflow-hidden cursor-pointer"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              {secondProduct.images && secondProduct.images[0] ? (
                <>
                  <img 
                    src={secondProduct.images[0]} 
                    alt={secondProduct.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 group-hover:from-black/70 transition-all duration-500"></div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🎵</div>
                    <p className="text-white text-xl">No Image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12">
              {/* Badge */}
              <div className="mb-3 animate-fadeInUp">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-full">
                  <Clock className="w-3 h-3" />
                  NEW COLLECTION
                </span>
              </div>

              {/* Category */}
              <div className="mb-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                <span className="text-rose-400 text-xs md:text-sm font-semibold uppercase tracking-wider">
                  {secondProduct.category || 'Premium'} / {secondProduct.subcategory || 'Collection'}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 animate-fadeInUp line-clamp-2" style={{ animationDelay: '0.2s' }}>
                {secondProduct.title}
              </h2>

              

              {/* Price & Rating */}
              <div className="flex flex-wrap items-center gap-3 mb-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                {secondProduct.variants && secondProduct.variants[0] && (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {/* Final Price */}
                    <div className="flex items-baseline gap-1">
                      <IndianRupee className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      <span className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                        {secondProduct.variants[0].finalPrice?.toFixed(2)}
                      </span>
                    </div>
                    {/* MRP  */}
                    {secondProduct.variants[0].mrp && (
                      <div className="flex items-baseline gap-1">
                        <IndianRupee className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-400 line-through text-xs md:text-sm">
                          {secondProduct.variants[0].mrp?.toFixed(2)}
                        </span>
                      </div>
                    )}
                   
                  </div>
                )}
                
                {secondProduct.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-xs md:text-sm">{secondProduct.averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Button */}
              <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-white text-gray-900 font-semibold rounded-full text-sm md:text-base group-hover:gap-3 transition-all duration-300 hover:bg-rose-600 hover:text-white">
                  <span>Discover Now</span>
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Hover Effect Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </Link>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ProductsGrid;