import React, { useState, useEffect } from 'react';
import { X, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { createSellerReview, getSellerReview } from '../../utils/reviews.apiRequest';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed

const AddReview = ({ sellerId, onClose, onReviewAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const [checkingReview, setCheckingReview] = useState(true);


  useEffect(() => {
    const checkExistingReview = async () => {
    
      if (!isAuthenticated || !user) {
        setCheckingReview(false);
        return;
      }

      try {
        setCheckingReview(true);
        const response = await getSellerReview(sellerId);
        
        if (response.success && response.data) {
          const userId = user?.id || user?._id;
          
          const userReview = response.data.find(
            review => review.user?._id === userId || review.user?.id === userId
          );
          
          if (userReview) {
            setExistingReview(userReview);
            setRating(userReview.rating);
            setComment(userReview.comment);
          }
        }
      } catch (err) {
        console.error('Error checking existing review:', err);
      } finally {
        setCheckingReview(false);
      }
    };
    
    if (sellerId) {
      checkExistingReview();
    }
  }, [sellerId, user, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isAuthenticated || !user) {
      setError('Please login to submit a review');
      return;
    }
    
    // Validation
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!comment.trim()) {
      setError('Please write a review message');
      return;
    }
    
    if (comment.trim().length < 5) {
      setError('Review message must be at least 5 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await createSellerReview(sellerId, {
        rating: rating,
        comment: comment.trim()
      });
      
      if (response.success) {
        setSuccess('Review submitted successfully!');
        setTimeout(() => {
          if (onReviewAdded) onReviewAdded(response.data);
          onClose();
        }, 1500);
      } else {
        setError(response.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stars = [1, 2, 3, 4, 5];

  // If user is not logged in, show login prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        {/* Top Red Sticky Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-800 dark:to-rose-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add Review</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Login Required Message */}
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Login Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please login to your account to submit a review for this seller.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
      
      {/* Top Red Sticky Header */}
      <div className="sticky top-0 bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-800 dark:to-rose-800 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          {existingReview ? 'Your Review' : 'Add Review'}
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {checkingReview ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Checking your review...</p>
          </div>
        ) : existingReview ? (
          // Already Reviewed Message
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              You've Already Reviewed This Seller
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Thank you for your feedback! Here's what you shared:
            </p>
            
            {/* Display Existing Review */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
              <div className="flex justify-center mb-2">
                {stars.map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= existingReview.rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                "{existingReview.comment}"
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="w-full mt-2 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Close
            </button>
          </div>
        ) : (
          // Review Form
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User Info Display */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reviewing as <span className="font-semibold text-red-600 dark:text-red-400">{user?.name || user?.email}</span>
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-500 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-green-700 dark:text-green-400 text-sm">{success}</p>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-500 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            {/* Star Rating Section */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Your Rating *
              </label>
              <div className="flex justify-center gap-2">
                {stars.map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoverRating || rating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      } transition-colors duration-150`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent!'}
              </p>
            </div>
            
            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                placeholder="Share your experience with this seller... (minimum 5 characters)"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                {comment.length}/500
              </p>
            </div>
            
            {/* Submit Button - Bottom Red */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Review'
              )}
            </button>
            
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
              Your feedback helps other customers make informed decisions
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddReview;