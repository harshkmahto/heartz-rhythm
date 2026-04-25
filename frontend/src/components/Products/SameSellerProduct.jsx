import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Store } from 'lucide-react';
import ProductCard from './ProductCard';

const SameSellerProduct = ({ seller, product, productId }) => {
  const scrollContainerRef = useRef(null);

  // Use the seller other products directly from the product data
  const sellerProducts = product?.sellerOtherProducts?.list || [];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
    // Implement your add to cart logic here
  };

  if (sellerProducts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {seller?.logo && (
            <img 
              src={seller.logo} 
              alt={seller.brandName} 
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
              More from {seller?.brandName || 'this seller'}
            </h2>
            <p className="text-sm text-black/60 dark:text-white/60">
              Explore other products from the same brand
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-full hover:bg-red-500 hover:text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 bg-white dark:bg-black border border-red-200 dark:border-red-900 rounded-full hover:bg-red-500 hover:text-white transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollbarWidth: 'thin', scrollBehavior: 'smooth' }}
        >
          {sellerProducts.map((sellerProduct) => (
            <div key={sellerProduct._id} className="flex-shrink-0 w-[250px] sm:w-[280px]">
              <ProductCard 
                product={sellerProduct} 
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlays for scroll indication */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />

        {/* View All Button */}
        {sellerProducts.length >= 4 && (
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => window.location.href = `/shop?seller=${seller?._id}`}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Store size={18} />
              View All Products from {seller?.brandName || 'this seller'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SameSellerProduct;