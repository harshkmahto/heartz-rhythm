import React, { useRef } from 'react';
import { useGetProductsQuery } from '../../utils/productApi';
import ProductCard from '../../components/Products/ProductCard';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedProducts = () => {
  const scrollContainerRef = useRef(null);
  
  const { data, isLoading, error } = useGetProductsQuery();
  
  const allProducts = data?.data?.products || [];
  const products = allProducts.filter(product => product.isFeatured === true);

  if (products.length === 0) {
    return null;
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/20 dark:to-black">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-red-200 dark:border-red-900/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-red-600 border-r-red-500 border-b-red-400 border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Loading featured products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching products:', error);
    return null;
  }

  return (
    <div className="py-16 px-4 md:px-8 bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/20 dark:to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-950/40 dark:to-rose-950/40 rounded-full mb-4 animate-pulse">
            <Sparkles className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Featured Collection
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Featured Products
          </h1>
          
          {/* Decorative Line */}
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-12 h-1 bg-red-500 rounded-full"></div>
            <div className="w-6 h-1 bg-rose-500 rounded-full"></div>
            <div className="w-3 h-1 bg-pink-500 rounded-full"></div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Discover our handpicked collection of premium products
          </p>
        </div>

        {/* Products Carousel */}
        <div className="relative group">
          {/* Scroll Buttons */}
          {products.length > 0 && (
            <div className="flex justify-end gap-3 mb-6">
              <button 
                onClick={scrollLeft} 
                className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300 group"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={scrollRight} 
                className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300 group"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
          
          {/* Scrollable Products */}
          <div 
            className="overflow-x-auto scroll-smooth pb-6 hide-scrollbar"
            ref={scrollContainerRef}
          >
            <div className="flex gap-6">
              {products.map((product, index) => (
                <div 
                  key={product.id || product._id || index} 
                  className="flex-none w-72 lg:w-80 animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
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
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: thin;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        
        .hide-scrollbar::-webkit-scrollbar-track {
          background: #ffe4e6;
          border-radius: 10px;
        }
        
        .dark .hide-scrollbar::-webkit-scrollbar-track {
          background: #3f0f12;
          border-radius: 10px;
        }
        
        .hide-scrollbar::-webkit-scrollbar-thumb {
          background: #e11d48;
          border-radius: 10px;
        }
        
        .hide-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #be123c;
        }
      `}</style>
    </div>
  );
};

export default FeaturedProducts;