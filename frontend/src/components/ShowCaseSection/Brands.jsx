import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Sparkles } from 'lucide-react';
import { getAllSellerPanels } from '../../utils/apiRequest';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await getAllSellerPanels();
      console.log('Brands response:', response);
      
      if (response.success) {
        setBrands(response.data || []);
      } else {
        setBrands([]);
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError(err.message || 'Failed to fetch brands');
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 px-4 md:px-8 bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/20 dark:to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-clip-text text-transparent animate-gradient">
              Our Brands
            </h2>
          </div>
          <div className="flex justify-center gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (brands.length === 0) {
    return null;
  }

  
  const scrollingBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <div className="py-6 px-4 md:px-8 bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/20 dark:to-black">
      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center mb-4">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-950/40 dark:to-rose-950/40 rounded-full mb-2 animate-pulse">
            <Store className="w-3 h-3 text-red-600 dark:text-red-400" />
            <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Trusted Partners
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Our Brands
          </h2>
          
          {/* Decorative Line */}
          <div className="flex justify-center gap-2 mt-2">
            <div className="w-8 h-0.5 bg-red-500 rounded-full"></div>
            <div className="w-4 h-0.5 bg-rose-500 rounded-full"></div>
            <div className="w-2 h-0.5 bg-pink-500 rounded-full"></div>
          </div>
        </div>

    
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-red-50/50 to-transparent dark:from-black dark:via-red-950/20 pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-red-50/50 to-transparent dark:from-black dark:via-red-950/20 pointer-events-none z-10"></div>
          
          <div 
            className="overflow-hidden"
            onMouseEnter={(e) => {
              e.currentTarget.querySelector('.animate-scroll').style.animationPlayState = 'paused';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector('.animate-scroll').style.animationPlayState = 'running';
            }}
          >
            <div className="animate-scroll flex items-center gap-8 py-3" style={{ width: 'fit-content' }}>
              {scrollingBrands.map((brand, index) => (
                <Link
                  key={`${brand._id}-${index}`}
                  to={`/seller/brand/${brand.brandName?.toLowerCase().replace(/\s+/g, '-') || brand._id}`}
                  className="flex items-center gap-3 group transition-all duration-300 flex-shrink-0 hover:scale-105"
                >
                  {/* Brand Logo */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-950/50 dark:to-rose-950/50 flex items-center justify-center overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.brandName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Store className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  
                  {/* Brand Name */}
                  <span className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300 whitespace-nowrap">
                    {brand.brandName || brand.shopName || 'Brand Name'}
                  </span>
                  
                  {/* Dot Separator */}
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-rose-400 dark:from-red-600 dark:to-rose-600 opacity-60 group-hover:opacity-100 transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
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
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .animate-scroll {
          animation: scroll ${brands.length * 3}s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Brands;