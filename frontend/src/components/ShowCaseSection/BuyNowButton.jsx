import React from 'react';
import { Zap } from 'lucide-react';

const BuyNowButton = ({
  product,
  selectedColor,
  isOutOfStock,
  onBuyNow,
  isSticky = false
}) => {
  return (
    <button
      onClick={onBuyNow}
      disabled={isOutOfStock}
      className={`group relative overflow-hidden rounded-full font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all
      ${isSticky ? 'px-4 sm:px-6 py-2 text-sm' : 'p-6 py-5'}
      ${
        isOutOfStock
          ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
          : 'bg-red-600 dark:bg-red-500 border-2 border-red-500 text-white hover:text-black dark:hover:text-white'
      }`}
    >
      {/* Sliding Background */}
      {!isOutOfStock && (
        <span className="absolute inset-0 w-0 bg-red-50 dark:bg-black  transition-all duration-300 ease-in-out group-hover:w-full"></span>
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 group">
        <Zap size={isSticky ? 16 : 18} />
        Buy Now
      </span>
    </button>
  );
};

export default BuyNowButton;