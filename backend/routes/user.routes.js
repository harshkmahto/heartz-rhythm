import { Router} from 'express'
import { forgetPassword, getAllSeller, getAllUser, getProfile, getSingleUser,
     login, logout, logoutallDevice, register, resendForgetOTP, resendOTP,
     resetPassword, sellerRegister, updateProfile,
     verifyForgetOTP, verifySellerOTP } from '../controller/user.controller.js';
import { authorized } from '../middleware/auth.middleware.js';

const userRoute = Router();


userRoute.post('/register', register)
userRoute.post('/seller/register', sellerRegister)
userRoute.post('/seller/verify-otp', verifySellerOTP)
userRoute.post('/seller/resend-otp', resendOTP)

userRoute.post('/login', login)

userRoute.post('/logout', logout)
userRoute.post('/logout/all', logoutallDevice)

userRoute.patch('/update/profile',authorized, updateProfile)

userRoute.post('/forget-password', forgetPassword)
userRoute.post('/password/otp-verify', verifyForgetOTP)
userRoute.post('/password/resend-otp', resendForgetOTP)
userRoute.post('/password/reset', authorized, resetPassword)


userRoute.get('/profile',authorized, getProfile)

// route for admin
userRoute.get('/admin/all-user',authorized, getAllUser)
userRoute.get('/admin/user/:id',authorized, getSingleUser)
userRoute.get('/admin/seller',authorized, getAllSeller)



export default userRoute


