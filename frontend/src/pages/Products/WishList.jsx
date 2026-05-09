import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, Tag, Percent, Star, AlertCircle, ShoppingBasket, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getWishlist, removeFromWishlist, clearWishlist } from '../../utils/product.apiRequest';
import AddToCartButton from '../../components/Products/AddToCartButton';
import Loader from '../../components/ShowCaseSection/Loader';
import NotLoggedin from '../../components/ShowCaseSection/NotLoggedin'; 
import { FaShoppingBag, FaShoppingCart } from 'react-icons/fa';
import Button from '../../components/ShowCaseSection/Buttons';

const WishList = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await getWishlist();
      if (response.success) {
        setWishlistItems(response.data.items || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setRemovingId(productId);
      const response = await removeFromWishlist(productId);
      if (response.success) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear your entire wishlist?')) return;
    
    try {
      setClearing(true);
      const response = await clearWishlist();
      if (response.success) {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    } finally {
      setClearing(false);
    }
  };

  const handleAddToCart = async (product) => {
   
    await handleRemoveItem(product.productId);
  };

  const handleProductClick = (product) => {
    const categorySlug = product.category?.toLowerCase().replace(/\s+/g, '-') || 'product';
    navigate(`/product/details/${categorySlug}/${product.productId}`);
  };

  if (!isAuthenticated) {
    return <NotLoggedin />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-red-950 dark:via-black dark:to-red-950">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-red-950 dark:via-black dark:to-red-950">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-red-500 via-rose-500 to-red-600 dark:from-red-700 dark:via-rose-800 dark:to-red-900">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-4">
              <Heart className="w-10 h-10 md:w-12 md:h-12 text-white fill-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              My Wishlist
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-md">
              Manage your favorite products and never miss out on your desired items
            </p>
            {wishlistItems.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm font-medium transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer"
              >
                {clearing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white  "></div>
                ) : (
                  <Trash2 size={16} />
                )}
                Clear All ({wishlistItems.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <div className="bg-white/50 dark:bg-black/50 rounded-full p-6 mb-6">
              <Heart className="w-16 h-16 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-black/60 dark:text-white/60 text-center max-w-md mb-6">
              Start adding products you love to your wishlist and they will appear here
            </p>
            <Link
              to="/shop"
            >
              <Button
              text='continue shopping '
              icon={FaShoppingBag }
              
               />
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Stats */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-black/60 dark:text-white/60">
                You have <span className="font-semibold text-red-500">{wishlistItems.length}</span> item(s) in your wishlist
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white dark:bg-black rounded-2xl overflow-hidden border border-red-200 dark:border-red-900 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={removingId === item.productId}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/90 dark:bg-black/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white"
                  >
                    {removingId === item.productId ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>

                  {/* Discount Badge */}
                  {item.discountPercent > 0 && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                        <Percent size={12} />
                        {item.discountPercent}% OFF
                      </span>
                    </div>
                  )}

                  {/* Best Seller Badge */}
                  {item.isBestSeller && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                        <Star size={12} />
                        Best Seller
                      </span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div
                    onClick={() => handleProductClick(item)}
                    className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:to-red-950 cursor-pointer"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Brand */}
                    {item.brand && (
                      <p className="text-xs text-black/50 dark:text-white/50 mb-1">
                        {item.brand}
                      </p>
                    )}

                    {/* Title */}
                    <h3
                      onClick={() => handleProductClick(item)}
                      className="font-bold text-black dark:text-white text-sm line-clamp-2 mb-2 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h3>

                    {/* Category */}
                    {item.category && (
                      <p className="text-xs text-black/40 dark:text-white/40 mb-2">
                        {item.category}
                      </p>
                    )}

                    {/* Price Section */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-lg font-bold text-black dark:text-white">
                          ₹{item.price?.toLocaleString('en-IN') || 0}
                        </span>
                        {item.mrp > item.price && (
                          <>
                            <span className="text-xs text-black/50 dark:text-white/50 line-through">
                              ₹{item.mrp?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-green-500 font-semibold">
                              Save ₹{(item.mrp - item.price).toLocaleString('en-IN')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stock Status */}
                    {item.isInStock ? (
                      <p className="text-xs text-green-500 mb-3">In Stock</p>
                    ) : (
                      <p className="text-xs text-red-500 mb-3 flex items-center gap-1">
                        <AlertCircle size={12} />
                        Out of Stock
                      </p>
                    )}

                    {/* Add to Cart Button */}
                    <div className='flex items-center justify-end'> 
                      <button
                      onClick={() => handleAddToCart(item)}
                      className='bg-white/10 p-3 rounded-full hover:scale-110 hover:bg-red-600 cursor-pointer transition-all' 
                      > <ShoppingCart size={34}/> </button>
                       </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishList;