import React from 'react';
import { ShoppingCart } from 'lucide-react';

const AddToCartButton = ({
  text = 'Add to Cart',
  isOutOfStock,
  onAddToCart,
  isSticky = false
}) => {
  return (
    <button
      onClick={onAddToCart}
      disabled={isOutOfStock}
      className={`group relative overflow-hidden rounded-full font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all
      ${isSticky ? 'px-4 sm:px-6 py-2 text-sm' : 'p-6 py-5'}
      ${
        isOutOfStock
          ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
          : 'border-2 border-red-500 text-red-500 hover:text-white'
      }`}
    >
      {/* Sliding Background */}
      {!isOutOfStock && (
        <span className="absolute inset-0 w-0 bg-red-600 dark:bg-red-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        <ShoppingCart size={isSticky ? 16 : 18} />
        {text}
      </span>
    </button>
  );
};

export default AddToCartButton;