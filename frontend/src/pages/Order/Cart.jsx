import React, { useState, useEffect, useCallback } from 'react';
import { Minus, Plus, Trash2, ShieldCheck, Truck, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotLoggedin from '../../components/ShowCaseSection/NotLoggedin';
import { 
  getCart, 
  updateCartQuantity, 
  removeFromCart, 
  clearCart
} from '../../utils/product.apiRequest';
import toast from 'react-hot-toast';

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [summary, setSummary] = useState({
    totalItems: 0,
    subtotal: 0,
    grandTotal: 0
  });

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await getCart();
      if (response.success) {
        setCartItems(response.data.items || []);
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error(error.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Update quantity
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingId(cartItemId);
    try {
      const response = await updateCartQuantity(cartItemId, newQuantity);
      if (response.success) {
        setCartItems(response.data.items || []);
        setSummary(response.data.summary);
        toast.success('Quantity updated');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.message || 'Failed to update quantity');
    } finally {
      setUpdatingId(null);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (cartItemId, productTitle) => {
    try {
      const response = await removeFromCart(cartItemId);
      if (response.success) {
        setCartItems(response.data.items || []);
        setSummary(response.data.summary);
        toast.success(`${productTitle} removed from cart`);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error(error.message || 'Failed to remove item');
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        const response = await clearCart();
        if (response.success) {
          setCartItems([]);
          setSummary({
            totalItems: 0,
            subtotal: 0,
            grandTotal: 0
          });
          toast.success('Cart cleared successfully');
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error(error.message || 'Failed to clear cart');
      }
    }
  };

  if (!isAuthenticated) {
    return <NotLoggedin />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50">
      <main className="pt-10 md:pt-20 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
            Your <span className="text-red-500">Cart</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            {cartItems.length === 0 
              ? "Your cart is waiting to be filled with amazing products."
              : `You have ${summary.totalItems} item${summary.totalItems !== 1 ? 's' : ''} in your cart`}
          </p>
        </header>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side: Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-5 font-semibold text-gray-600 text-sm">Product</th>
                        <th className="p-5 font-semibold text-gray-600 text-sm text-center">Quantity</th>
                        <th className="p-5 font-semibold text-gray-600 text-sm text-right">Total</th>
                        <th className="p-5 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cartItems.map((item) => (
                        <tr key={item._id} className="group hover:bg-rose-50/30 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              {/* Product Image */}
                              <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                                <img 
                                  src={item.thumbnail || 'https://via.placeholder.com/80'} 
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              
                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 hover:text-red-500 transition-colors">
                                  <Link to={`/product/${item.product}`}>
                                    {item.title}
                                  </Link>
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">{item.brand}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Category: {item.category}</p>
                                <p className="text-xs text-gray-500">Subcategory: {item.subCategory}</p>
                                
                                {/* Color Display */}
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs text-gray-500">Color:</span>
                                  <div className="flex items-center gap-1">
                                    <div 
                                      className="w-4 h-4 rounded-full border border-gray-300"
                                      style={{ backgroundColor: item.colorCode || '#ccc' }}
                                    />
                                    <span className="text-xs font-medium text-gray-700">{item.colorName}</span>
                                  </div>
                                </div>

                                {/* MRP and Final Price */}
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-sm font-semibold text-red-500">
                                    ₹{item.finalPrice?.toLocaleString()}
                                  </span>
                                  {item.basePrice !== item.finalPrice && (
                                    <span className="text-xs text-gray-400 line-through">
                                      MRP: ₹{item.basePrice?.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                           </td>
                          
                          <td className="p-5">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
                                <button
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                  disabled={updatingId === item._id || item.quantity <= 1}
                                  className="p-1 text-gray-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="mx-3 font-medium text-gray-900 min-w-[30px] text-center">
                                  {updatingId === item._id ? (
                                    <div className="animate-spin rounded-full w-4 h-4 border-b-2 border-red-500 mx-auto"></div>
                                  ) : (
                                    item.quantity
                                  )}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                  disabled={updatingId === item._id || item.quantity >= item.stock}
                                  className="p-1 text-gray-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              {item.quantity >= item.stock && (
                                <p className="text-xs text-orange-500 mt-1">Max stock: {item.stock}</p>
                              )}
                            </div>
                          </td>
                          
                          <td className="p-5 text-right">
                            <span className="font-semibold text-gray-900">
                              ₹{(item.finalPrice * item.quantity).toLocaleString()}
                            </span>
                          </td>
                          
                          <td className="p-5 text-right">
                            <button
                              onClick={() => handleRemoveItem(item._id, item.title)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Link 
                  to="/shop" 
                  className="text-gray-600 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  ← Continue Shopping
                </Link>
                {cartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-600 transition-colors text-sm"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Price ({summary.totalItems} items)</span>
                    <span>₹{summary.subtotal?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-lg">Total Amount</span>
                      <span className="font-bold text-red-500 text-2xl">
                        ₹{summary.grandTotal?.toLocaleString() || 0}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Inclusive of all taxes
                    </p>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <ShieldCheck size={14} className="text-red-500" />
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck size={14} className="text-red-500" />
                      <span>Free Shipping</span>
                    </div>
                  </div>
                </div>

                {/* Help Section */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Need help?</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    Have questions about your order? Our support team is here to help.
                  </p>
                  <button className="text-xs text-red-500 hover:text-red-600 font-medium">
                    Contact Support →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;