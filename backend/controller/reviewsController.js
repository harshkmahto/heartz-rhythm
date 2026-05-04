import SellerPannel from "../models/sellerPannel.model.js";


const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
};

export const createSellerReview = async (req, res) => {
    try {
        const { panelId } = req.params;
        const userId = req.user?.id;
        const { rating, comment } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if(!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid rating between 1 and 5"
            });

        }

         if (!comment || comment.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: "Please provide a comment with at least 5 characters"
            });
        }

        const sellerPanel = await SellerPannel.findById(panelId);
        if (!sellerPanel) {
            return res.status(404).json({
                success: false,
                message: "Seller panel not found"
            });
        }

       const existingReview = sellerPanel.reviews.find(
        review => review.user.toString() === userId
        );

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this seller. You can update your existing review instead."
            });
        }

        sellerPanel.reviews.push({
            user: userId,
            rating: Number(rating),
            comment: comment.trim(),
            createdAt: new Date()
        });

        await sellerPanel.save();

          const updatedSellerPanel = await SellerPannel.findById(panelId)
            .populate('reviews.user', 'name email profilePicture');

        const newReview = updatedSellerPanel.reviews[updatedSellerPanel.reviews.length - 1];

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: {
                review: newReview,
                totalReviews: updatedSellerPanel.reviews.length,
                averageRating: calculateAverageRating(updatedSellerPanel.reviews)
            }
        });

    } catch (err) {
        console.error('Create review error:', err);
        return res.status(500).json({
            success: false,
            message: "Failed to add review",
            error: err.message
        });
    }
};

export const getSellerReview = async (req, res) => {
    try {
        const { panelId } = req.params;

        const sellerPanel = await SellerPannel.findById(panelId)
            .populate('reviews.user', 'name  profilePicture');

         if (!sellerPanel) {
            return res.status(404).json({
                success: false,
                message: "Seller panel not found"
            });
         }  

         const reviews = sellerPanel.reviews;

         return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
         });


        

    } catch (error) {
        console.error('Get reviews error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
            error: error.message
        });
        
    }

}

export const getAverageSellerRating = async (req, res) => {
    try {
        const { panelId } = req.params;

        const sellerPanel = await SellerPannel.findById(panelId);

        if (!sellerPanel) {
            return res.status(404).json({
                success: false,
                message: "Seller panel not found"
            });
        }

        const reviews = sellerPanel.reviews;
        const totalReviews = reviews.length;

        let averageRating = 0;
        
        if (totalReviews > 0) {
            const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
            averageRating = parseFloat((sum / totalReviews).toFixed(1));
        }

        return res.status(200).json({
            success: true,
            data: {
                averageRating: averageRating,
                totalReviews: totalReviews
            }
        });

    } catch (error) {
        console.error('Get average rating error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch average rating",
            error: error.message
        });
    }
};
export const deleteSellerReview = async (req, res) => {
    try {
        const { panelId, reviewId } = req.params;
        const userId = req.user?.id;

       
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login to delete your review."
            });
        }

       
        const sellerPanel = await SellerPannel.findById(panelId);
        
        if (!sellerPanel) {
            return res.status(404).json({
                success: false,
                message: "Seller panel not found"
            });
        }

        if(sellerPanel.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this review."
            });
        }

        const review = sellerPanel.reviews.id(reviewId);
        
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        
       sellerPanel.reviews.pull(reviewId);
        await sellerPanel.save();

        const totalReviews = sellerPanel.reviews.length;

        // Calculate new average rating
        let averageRating = 0;
        if (totalReviews > 0) {
            const sum = sellerPanel.reviews.reduce((acc, rev) => acc + rev.rating, 0);
            averageRating = parseFloat((sum / totalReviews).toFixed(1));
        }

        return res.status(200).json({
            success: true,
            message: "Your review has been deleted successfully",
            data: {
                deletedReviewId: reviewId,
                totalReviews: totalReviews,
                averageRating: averageRating
            }
        });

    } catch (error) {
        console.error('Delete review error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete review",
            error: error.message
        });
    }
};