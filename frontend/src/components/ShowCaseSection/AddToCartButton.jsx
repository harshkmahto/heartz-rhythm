import React, { useState, useEffect } from 'react';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addToCart, getCart } from '../../utils/product.apiRequest';
import toast from 'react-hot-toast';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const variantId = selectedColor?._id;
  const productId = product?._id;

  useEffect(() => {
    const checkCart = async () => {
      if (!productId || !variantId) return;
      try {
        const response = await getCart();
        if (response.success && response.data?.items) {
          const exists = response.data.items.some(
            item => item.product === productId && item.variantId === variantId
          );
          setIsInCart(exists);
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkCart();
  }, [productId, variantId]);

  const handleClick = async () => {
    if (isInCart) {
      navigate('/cart');
      return;
    }

    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    if (isOutOfStock) {
      toast.error('Out of stock');
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(productId, variantId, quantity);
      toast.success('Added to cart');
      setIsInCart(true);
    } catch (error) {
      toast.error(error.message || 'Failed to add');
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedColor) {
    return (
      <button className={`rounded-full font-semibold px-6 py-3 bg-gray-300 text-gray-500 cursor-not-allowed ${className}`}>
        Select Color
      </button>
    );
  }

  if (isInCart) {
    return (
      <button
        onClick={handleClick}
        className={`rounded-full font-semibold px-6 py-3 bg-green-500 text-white hover:bg-green-600 transition ${className}`}
      >
        <Check size={18} className="inline mr-2" />
        Go to Cart
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isOutOfStock || isLoading}
      className={`rounded-full font-semibold px-6 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition disabled:opacity-50 ${className}`}
    >
      {isLoading ? 'Adding...' : text}
    </button>
  );
};

export default AddToCartButton;