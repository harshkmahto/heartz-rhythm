import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const SimmilerPRoduct = ({ product, productId }) => {
  const scrollContainerRef = useRef(null);

  // Use the related products directly from the product data
  const relatedProducts = product?.relatedProducts?.list || [];

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

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
          Similar Products
        </h2>
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
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct._id} className="flex-shrink-0 w-[250px] sm:w-[280px]">
              <ProductCard 
                product={relatedProduct} 
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlays for scroll indication */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default SimmilerPRoduct;