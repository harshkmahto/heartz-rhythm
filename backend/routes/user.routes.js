import { Router} from 'express'
import { deleteUser, forgetPassword, getAllSeller, getAllUser, getDeletedUsers, getProfile, getSingleUser,
     login, logout, logoutallDevice, permanentDeleteUser, register, resendForgetOTP, resendOTP,
     resetPassword, restoreUser, sellerRegister, updateProfile,
     verifyForgetOTP, verifySellerOTP } from '../controller/user.controller.js';
import { authorized, isAdmin } from '../middleware/auth.middleware.js';

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
userRoute.get('/admin/all-user',authorized, isAdmin, getAllUser)
userRoute.get('/admin/user/:id',authorized, isAdmin, getSingleUser)
userRoute.get('/admin/seller',authorized, isAdmin, getAllSeller)

userRoute.delete('/admin/delete-user/:id', authorized, isAdmin, deleteUser)
userRoute.delete('/admin/delete-user/bin/:binId', authorized, isAdmin, permanentDeleteUser)

userRoute.get('/admin/deleted-users', authorized, isAdmin, getDeletedUsers)
userRoute.post('/admin/restore-user/:binId', authorized, isAdmin, restoreUser)


export default userRoute


