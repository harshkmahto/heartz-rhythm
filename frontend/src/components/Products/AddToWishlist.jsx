import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { addToWishlist, removeFromWishlist, checkInWishlist } from '../../utils/product.apiRequest';
import { useAuth } from '../../context/AuthContext'; 

const AddToWishlist = ({ productId, variantId, className = '', iconSize = 20, showText = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Get user from your auth context

  // Check if product is already in wishlist
  useEffect(() => {
    if (user && productId) {
      checkWishlistStatus();
    }
  }, [productId, user]);

  const checkWishlistStatus = async () => {
    try {
      const response = await checkInWishlist(productId);
      if (response.success) {
        setIsWishlisted(response.data.isInWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await removeFromWishlist(productId);
        if (response.success) {
          setIsWishlisted(false);
        }
      } else {
        // Add to wishlist
        const response = await addToWishlist(productId);
        if (response.success) {
          setIsWishlisted(true);
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlistClick}
      disabled={loading}
      className={`group relative flex items-center justify-center gap-2 transition-all duration-300 ${className}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={iconSize}
        className={`transition-all duration-300 ${
          isWishlisted 
            ? 'fill-red-500 text-red-500 ' 
            : 'text-black dark:text-white '
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      />
      {showText && (
        <span className={`text-sm font-medium ${
          isWishlisted 
            ? 'text-red-500' 
            : 'text-black dark:text-white '
        }`}>
          {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
};

export default AddToWishlist;