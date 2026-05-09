import React, { useState, useRef, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, User, Calendar, Store, Trash2, X } from 'lucide-react';
import { deleteSellerReview } from '../../utils/reviews.apiRequest';

const SellerReviews = ({ seller, sellerId, onReviewDeleted }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  });
  const [deletePopup, setDeletePopup] = useState({ show: false, reviewId: null, reviewUser: null });
  const [deleting, setDeleting] = useState(false);
  
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (seller && seller.reviews) {
      const sellerReviews = seller.reviews || [];
      setReviews(sellerReviews);
      setTotalReviews(sellerReviews.length);
      
      if (sellerReviews.length > 0) {
        const total = sellerReviews.reduce((sum, review) => sum + review.rating, 0);
        const avg = total / sellerReviews.length;
        setAverageRating(avg);
        
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        sellerReviews.forEach(review => {
          if (review.rating >= 1 && review.rating <= 5) {
            counts[review.rating]++;
          }
        });
        setRatingCounts(counts);
      } else {
        setRatingCounts({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      }
    }
    setLoading(false);
  }, [seller]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [reviews]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${star <= rating ? 'fill-green-500 text-green-500' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`}
          />
        ))}
      </div>
    );
  };

  const handleDeleteClick = (reviewId, userName) => {
    setDeletePopup({ show: true, reviewId, reviewUser: userName });
  };

  const handleConfirmDelete = async () => {
    if (!deletePopup.reviewId) return;
    
    setDeleting(true);
    try {
      const response = await deleteSellerReview(sellerId, deletePopup.reviewId);
      if (response.success) {
        const updatedReviews = reviews.filter(r => r._id !== deletePopup.reviewId);
        setReviews(updatedReviews);
        setTotalReviews(updatedReviews.length);
        
        if (updatedReviews.length > 0) {
          const total = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
          const avg = total / updatedReviews.length;
          setAverageRating(avg);
          
          const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          updatedReviews.forEach(review => {
            if (review.rating >= 1 && review.rating <= 5) {
              counts[review.rating]++;
            }
          });
          setRatingCounts(counts);
        } else {
          setAverageRating(0);
          setRatingCounts({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
        }
        
        if (onReviewDeleted) {
          onReviewDeleted();
        }
        
        setDeletePopup({ show: false, reviewId: null, reviewUser: null });
      }
    } catch (error) {
      console.error('Delete review error:', error);
      alert(error.message || 'Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeletePopup({ show: false, reviewId: null, reviewUser: null });
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-green-500">Loading reviews...</div>
      </div>
    );
  }

  if (totalReviews === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 rounded-2xl border border-green-200 dark:border-green-900">
        <Store size={48} className="text-green-300 dark:text-green-700 mb-4" />
        <h3 className="text-xl font-bold text-black dark:text-white mb-2">No Reviews Yet</h3>
        <p className="text-black/60 dark:text-white/60 text-center max-w-md">
          Your store hasn't received any reviews yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full py-8 px-4 md:px-8 bg-gradient-to-br from-emerald-50/50 via-white to-green-50/50 dark:from-emerald-950/20 dark:via-black dark:to-green-950/20 rounded-2xl">
        <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
          <Store className="text-green-500" size={28} />
          Store Reviews & Ratings
        </h2>

        {/* Rating Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 p-6 bg-white/50 dark:bg-black/50 rounded-2xl border border-green-200 dark:border-green-900">
          {/* Left Side - Rating Bars */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-black dark:text-white">{star}</span>
                    <Star size={14} className="fill-green-500 text-green-500" />
                  </div>
                  <div className="flex-1 h-2 bg-green-100 dark:bg-green-900/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-sm text-black/60 dark:text-white/60">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side - Average Rating */}
          <div className="flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-green-200 dark:border-green-900 pt-6 lg:pt-0 lg:pl-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-black text-black dark:text-white">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center my-3">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-sm text-black/60 dark:text-white/60">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Scrollable Section */}
        {reviews.length > 0 && (
          <div className="relative">
            {/* Left Scroll Button */}
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 dark:bg-black/90 rounded-full shadow-lg border border-green-200 dark:border-green-900 hover:bg-green-500 hover:text-white transition-all cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex gap-5 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review._id || index}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] bg-white/70 dark:bg-black/70 rounded-2xl border border-green-200 dark:border-green-900 p-5 shadow-lg hover:shadow-xl transition-all relative group"
                >
                  {/* Delete Button - Always visible for seller */}
                  <button
                    onClick={() => handleDeleteClick(review._id, review.user?.name)}
                    className="absolute top-3 right-3 p-1.5 bg-red-100 dark:bg-red-900/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white cursor-pointer"
                    title="Delete this review"
                  >
                    <Trash2 size={14} />
                  </button>

                  {/* User Info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden">
                      {review.user?.profilePicture ? (
                        <img 
                          src={review.user.profilePicture?.url || review.user.profilePicture} 
                          alt={review.user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : review.user?.name ? (
                        review.user.name.charAt(0).toUpperCase()
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="flex-1 pr-6">
                      <h4 className="font-bold text-black dark:text-white">
                        {review.user?.name || 'Anonymous User'}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {renderStars(review.rating)}
                        {review.createdAt && (
                          <span className="text-xs text-black/40 dark:text-white/40 flex items-center gap-1">
                            <Calendar size={10} />
                            {formatDate(review.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Review Comment */}
                  {review.comment && (
                    <div className="mt-3 pt-3 border-t border-green-100 dark:border-green-900">
                      <p className="text-black/70 dark:text-white/70 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Scroll Button */}
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 dark:bg-black/90 rounded-full shadow-lg border border-green-200 dark:border-green-900 hover:bg-green-500 hover:text-white transition-all cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}

        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Delete Confirmation Popup */}
      {deletePopup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-black rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-green-200 dark:border-green-900 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Delete Review</h3>
              </div>
              <button
                onClick={handleCancelDelete}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete {deletePopup.reviewUser ? `${deletePopup.reviewUser}'s` : 'this'} review? This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                disabled={deleting}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerReviews;