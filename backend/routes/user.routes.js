import { Router} from 'express'
import { deleteProfilePicture, deleteUser, forgetPassword, getAllSeller, getAllUser, getDeletedUsers, getProfile, getSellerWithPanelById, getSingleDeletedUser, getSingleUser,
     login, logout, logoutallDevice, permanentDeleteUser, register, resendForgetOTP, resendOTP,
     resetPassword, restoreUser, sellerRegister, updateProfile,
     updateProfilePicture,
     updateUserByAdmin,
     verifyForgetOTP, verifySellerOTP } from '../controller/user.controller.js';


import { authorized, isAdmin, isSeller, protect } from '../middleware/auth.middleware.js';
import { upload, uploadSellerImages } from '../middleware/upload.middleware.js';
import { createSellerPannel, getAllSellerPanels, getMySellerPanel, getMySellerPanelById, getSellerByIdForAdmin, getSellerForAdmin, getSellerPanelById, storeOpenClose, updateBasicDetails, updatePersonalDetails, updateSellerMedia, updateStatus, } from '../controller/sellerPannel.controller.js';



const userRoute = Router();


userRoute.post('/register', register)
userRoute.post('/seller/register', sellerRegister)
userRoute.post('/seller/verify-otp', verifySellerOTP)
userRoute.post('/seller/resend-otp', resendOTP)

userRoute.post('/login', login)

userRoute.post('/logout', logout)
userRoute.post('/logout/all', logoutallDevice)

userRoute.patch('/update/profile',authorized, protect, updateProfile)
userRoute.patch('/update/profile-picture', authorized, protect, upload.single('profilePicture'), updateProfilePicture)
userRoute.delete('/delete/profile-picture', authorized, protect, deleteProfilePicture)

userRoute.post('/forget-password', forgetPassword)
userRoute.post('/password/otp-verify', verifyForgetOTP)
userRoute.post('/password/resend-otp', resendForgetOTP)
userRoute.post('/password/reset', authorized, protect, resetPassword)


userRoute.get('/profile',authorized, getProfile)

// route for admin
userRoute.get('/admin/all-user',authorized, isAdmin, getAllUser)
userRoute.get('/admin/user/:id',authorized, isAdmin, getSingleUser)
userRoute.get('/admin/seller',authorized, isAdmin, getAllSeller)

userRoute.patch('/admin/update-user/:id', authorized, isAdmin, updateUserByAdmin)

userRoute.delete('/admin/delete-user/:id', authorized, isAdmin, deleteUser)
userRoute.delete('/admin/delete-user/permanent/:binId', authorized, isAdmin, permanentDeleteUser)

userRoute.get('/admin/deleted-users', authorized, isAdmin, getDeletedUsers)
userRoute.get('/admin/deleted-user/single/:binId', authorized, isAdmin, getSingleDeletedUser)
userRoute.post('/admin/restore-user/:binId', authorized, isAdmin, restoreUser)

userRoute.get('/admin/seller-profile/:userId', authorized, isAdmin, getSellerWithPanelById)

//Seller pannel

userRoute.post('/seller/pannel/:userId', authorized, protect, isSeller, uploadSellerImages, createSellerPannel)
userRoute.patch('/seller/pannel-update/media/:userId', authorized, protect, isSeller, uploadSellerImages, updateSellerMedia)
userRoute.patch('/seller/pannel-update/:userId', authorized, isSeller, protect, updateBasicDetails)
userRoute.patch('/seller/pannel-update/personal/:userId', authorized, protect, isSeller, updatePersonalDetails)
userRoute.patch('/seller/pannel-update/status/:userId', authorized, protect, isSeller, updateStatus)
userRoute.patch('/seller/store', authorized, protect, isSeller, storeOpenClose)

userRoute.get('/seller/my-pannel', authorized, protect, isSeller, getMySellerPanel)
userRoute.get('/seller/my-pannel/:panelId', authorized, protect, isSeller, getMySellerPanelById)

//PUBLIC
userRoute.get('/seller/brands', getAllSellerPanels)
userRoute.get('/seller/brand/:panelId', getSellerPanelById)

//ADMIN
userRoute.get('/seller/pannel', getSellerForAdmin)
userRoute.get('/seller/pannel/:panelId', getSellerByIdForAdmin)


export default userRoute


