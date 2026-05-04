import React, {  useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee } from 'lucide-react';

const CategoryProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

 
  // Get unique colors from variants
  const uniqueColors = React.useMemo(() => {
    if (!product.variants || product.variants.length === 0) return [];
    const colors = new Map();
    product.variants.forEach(variant => {
      if (variant.name && variant.colorCode) {
        colors.set(variant.name, variant.colorCode);
      } else if (variant.name) {
        colors.set(variant.name, '#000000');
      }
    });
    return Array.from(colors.entries()).map(([name, code]) => ({ name, code }));
  }, [product.variants]);

 

  // Get badge text and color based on product flags
  const getBadges = () => {
    const badges = [];
    
    if (product.hasDiscount &&  product.discountValue > 0) {
      badges.push({
        text: `${product.discountValue}% OFF`,
        color: 'bg-gradient-to-r from-red-500 to-red-600',
        position: 'top-left'
      });
    }
    
    if (product.isFeatured) {
      badges.push({
        text: 'FEATURED',
        color: 'bg-gradient-to-r from-purple-500 to-pink-500',
        position: 'top-left'
      });
    }
    
    if (product.bestSeller) {
      badges.push({
        text: 'BEST SELLER',
        color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        position: 'top-left'
      });
    }
    
    if (product.mostLovedProduct) {
      badges.push({
        text: '❤️ MOST LOVED',
        color: 'bg-gradient-to-r from-pink-500 to-rose-500',
        position: 'top-left'
      });
    }
    
    if (product.mostOrderProduct) {
      badges.push({
        text: '📦 MOST ORDERED',
        color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        position: 'top-left'
      });
    }
    
    if (product.mostViewedProduct) {
      badges.push({
        text: '👁️ MOST VIEWED',
        color: 'bg-gradient-to-r from-teal-500 to-emerald-500',
        position: 'top-left'
      });
    }
    
    if (product.mostSerchedProduct) {
      badges.push({
        text: '🔍 MOST SEARCHED',
        color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
        position: 'top-left'
      });
    }
    
    // Only show first 2 badges
    return badges.slice(0, 2);
  };

  const badges = getBadges();

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/product/details/${product.category}/${product._id}`)}
      className="group cursor-pointer rounded-xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-white/5 to-black/30 border border-white/10 hover:border-rose-500/50 transition-all duration-500"
    >
      <div className="relative overflow-hidden h-64 bg-gradient-to-br from-red-950/30 to-black/50">
       
          <img
            src={product.thumbnail || product.images?.[0] || '/placeholder-guitar.jpg'}
            alt={product.title || product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
    
      
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
          {badges.map((badge, i) => (
            <span
              key={i}
              className={`px-3 py-1 text-xs font-bold ${badge.color} text-white rounded-full shadow-lg`}
            >
              {badge.text}
            </span>
          ))}
        </div>
        

        {/* Price Overlay */}
        <div className="absolute bottom-3 right-3 px-3 py-1 backdrop-blur-md bg-black/50 rounded-lg z-10">
         
            <div className="flex items-center gap-2">
              <span className="flex items-center text-gray-400 text-xs line-through">
                <IndianRupee size={12}/> {product.variants[0].mrp}
              </span>
              <span className="flex items-center text-red-600 font-semibold">
                <IndianRupee size={14}/> {product.variants[0].finalPrice}
              </span>
            </div>
             
          
        </div>

        {/* Stock Overlay */}
        {product.totalStock === 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm z-20">
            <span className="px-4 py-2 bg-red-600 text-white font-bold rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
      
        {product.brand && (
          <div className="text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            {product.brand}
          </div>
        )}
        
       
        <h3 className="text-black dark:text-white font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.title || product.name}
        </h3>
        
        
        {/* Available Colors */}
        {uniqueColors.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Available Colors:</p>
            <div className="flex flex-wrap gap-2">
              {uniqueColors.slice(0, 5).map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white/30 hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                  onClick={(e) => e.stopPropagation()}
                />
              ))}
              {uniqueColors.length > 5 && (
                <span className="text-xs text-gray-400 px-2 py-1">
                  +{uniqueColors.length - 5}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Rating */}
        {product.averageRating > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-600'} fill-current`} 
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.totalReviews || 0})
            </span>
          </div>
        )}

        {/* Low Stock Warning */}
        {product.totalStock > 0 && product.totalStock <= 10 && (
          <div className="mb-4">
            <p className="text-xs text-orange-400 font-medium">
              ⚡ Only {product.totalStock} left in stock
            </p>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
              <div 
                className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(product.totalStock / 10) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {/* View Details Button */}
        <button 
          className="w-full py-2 text-center text-sm font-medium text-red-400 border border-amber-500/30 rounded-lg hover:bg-red-500 hover:text-black cursor-pointer transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/details/${product.category}/${product._id}`);
          }}
        >
          View Details →
        </button>
      </div>
    </div>
  );
};

export default CategoryProductCard;