import { Router} from 'express'


import { createSellerReview, deleteSellerReview, getAverageSellerRating, getSellerReview } from '../controller/ReviewsController.js';
import { authorized, isSeller, protect } from '../middleware/auth.middleware.js';


const reviewsRoute = Router();


//------------------------SELLER REVIEWS------------------------------------

reviewsRoute.post('/seller/create/:panelId',authorized, createSellerReview)

reviewsRoute.get('/seller/get/:panelId', getSellerReview)
reviewsRoute.get('/seller/get/average/:panelId', getAverageSellerRating)

reviewsRoute.delete('/seller/delete/:panelId/:reviewId',authorized, isSeller, protect, deleteSellerReview)



export default reviewsRoute;