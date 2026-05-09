import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const AddToCartButton = ({
  text = 'Add to Cart',
  product,
  selectedColor,
  quantity = 1,
  isOutOfStock = false,
  isSticky = false,
  className = ''
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart, loading } = useCart();
  const [inCart, setInCart] = useState(false);
  const [checking, setChecking] = useState(true);

  const variantId = selectedColor?._id;
  const productId = product?._id;

  useEffect(() => {
    const checkIfInCart = async () => {
      if (!productId || !variantId || !user) {
        setChecking(false);
        return;
      }
      
      setChecking(true);
      const result = await isInCart(productId, variantId);
      setInCart(result);
      setChecking(false);
    };
    
    checkIfInCart();
  }, [productId, variantId, user, isInCart]);

  const handleClick = async () => {
    if (inCart) {
      navigate('/cart');
      return;
    }

    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    if (isOutOfStock) {
      toast.error('This color is out of stock');
      return;
    }

    if (!user) {
      toast.error('Please login to add to cart');
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
      return;
    }

    const loadingToast = toast.loading('Adding to cart...');
    
    try {
      await addToCart(productId, variantId, quantity);
      toast.success('Added to cart!', { id: loadingToast });
      setInCart(true);
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart', { id: loadingToast });
    }
  };

  if (!selectedColor) {
    return (
      <button 
        disabled
        className={`rounded-full font-semibold px-6 py-3 bg-gray-300 text-gray-500 cursor-not-allowed ${className}`}
      >
        Select Color
      </button>
    );
  }

  if (isOutOfStock) {
    return (
      <button 
        disabled
        className={`rounded-full font-semibold px-6 py-3 bg-gray-300 text-gray-500 cursor-not-allowed ${className}`}
      >
        Out of Stock
      </button>
    );
  }

  if (checking) {
    return (
      <button
        disabled
        className={`rounded-full font-semibold px-6 py-3 bg-gray-300 text-gray-500 ${className}`}
      >
        <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </button>
    );
  }

  // Go to Cart button with hover fill animation
  if (inCart) {
    return (
      <button
        onClick={handleClick}
        className={`group relative overflow-hidden rounded-full font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 bg-green-500 text-black dark:text-white border border-green-500 hover:bg-green-600 ${isSticky ? 'px-4 sm:px-6 py-2 text-sm' : 'px-6 py-3'} ${className}`}
      >
        <span className="absolute inset-0 w-0 bg-red-50 dark:bg-black transition-all duration-300 ease-in-out group-hover:w-full"></span>
        <span className="relative z-10 flex items-center gap-2">
          <ShoppingCart size={isSticky ? 16 : 18} />
          Go to Cart
        </span>
      </button>
    );
  }

  // Add to Cart button with hover fill animation
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`group relative overflow-hidden rounded-full font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200
        ${isSticky ? 'px-4 sm:px-6 py-2 text-sm' : 'px-6 py-3'}
        ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'border-2 border-red-500 text-red-500 hover:text-white'}
        ${className}`}
    >
      {!loading && (
        <span className="absolute inset-0 w-0 bg-red-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
      )}
      
      {loading ? (
        <svg className="animate-spin h-5 w-5 relative z-10" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <span className="relative z-10 flex items-center gap-2">
          <ShoppingCart size={isSticky ? 16 : 18} />
          {text}
        </span>
      )}
    </button>
  );
};

export default AddToCartButton;