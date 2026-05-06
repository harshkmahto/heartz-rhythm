import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart as addToCartAPI, checkVariantInCart } from '../utils/product.apiRequest';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getCart();
      if (response.success) {
        setCartItems(response.data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(async (productId, variantId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add to cart');
    }

    const response = await addToCartAPI(productId, variantId, quantity);
    if (response.success) {
      await fetchCart();
    }
    return response;
  }, [isAuthenticated, fetchCart]);

  const isInCart = useCallback(async (productId, variantId) => {
    if (!isAuthenticated || !productId || !variantId) return false;
    
    try {
      const response = await checkVariantInCart(productId, variantId);
      return response.success && response.inCart;
    } catch (error) {
      console.error('Error checking variant:', error);
      return false;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      loading,
      addToCart,
      isInCart,
      cartItems,
      fetchCart,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};