import React, { useState, useRef, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, User, MessageCircle, Calendar } from 'lucide-react';

const ProductReviews = ({ product, productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  });
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (product && product.reviews) {
      const productReviews = product.reviews || [];
      setReviews(productReviews);
      setTotalReviews(productReviews.length);
      
      if (productReviews.length > 0) {
        const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
        const avg = total / productReviews.length;
        setAverageRating(avg);
        
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        productReviews.forEach(review => {
          if (review.rating >= 1 && review.rating <= 5) {
            counts[review.rating]++;
          }
        });
        setRatingCounts(counts);
      }
    }
    setLoading(false);
  }, [product]);

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
            className={`${star <= rating ? 'fill-red-500 text-red-500' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-[650px] flex items-center justify-center">
        <div className="animate-pulse text-red-500">Loading reviews...</div>
      </div>
    );
  }

  if (totalReviews === 0) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 rounded-2xl border border-red-200 dark:border-red-900 mb-6">
        <MessageCircle size={48} className="text-red-300 dark:text-red-700 mb-4" />
        <h3 className="text-xl font-bold text-black dark:text-white mb-2">No Reviews Yet</h3>
        <p className="text-black/60 dark:text-white/60 text-center max-w-md">
          Be the first to review this product and share your experience with others!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-4 md:px-8 bg-gradient-to-br from-rose-50/50 via-white to-red-50/50 dark:from-red-950/20 dark:via-black dark:to-red-950/20 rounded-2xl mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
        <MessageCircle className="text-red-500" size={28} />
        Reviews & Ratings
      </h2>

      {/* Rating Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 p-6 bg-white/50 dark:bg-black/50 rounded-2xl border border-red-200 dark:border-red-900">
        {/* Left Side - Rating Bars */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-black dark:text-white">{star}</span>
                  <Star size={14} className="fill-red-500 text-red-500" />
                </div>
                <div className="flex-1 h-2 bg-red-100 dark:bg-red-900/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-500"
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
        <div className="flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-red-200 dark:border-red-900 pt-6 lg:pt-0 lg:pl-8">
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
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 dark:bg-black/90 rounded-full shadow-lg border border-red-200 dark:border-red-900 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
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
                className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] bg-white/70 dark:bg-black/70 rounded-2xl border border-red-200 dark:border-red-900 p-5 shadow-lg hover:shadow-xl transition-all"
              >
                {/* User Info */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {review.user?.name ? review.user.name.charAt(0).toUpperCase() : <User size={20} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-black dark:text-white">
                      {review.user?.name || 'Anonymous User'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
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
                  <div className="mt-3 pt-3 border-t border-red-100 dark:border-red-900">
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
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 dark:bg-black/90 rounded-full shadow-lg border border-red-200 dark:border-red-900 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      )}

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProductReviews;