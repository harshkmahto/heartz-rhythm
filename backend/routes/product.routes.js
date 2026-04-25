import {Router} from 'express'


import { blockProduct, createProduct, createProductReport, deleteProduct, getAllProducts, getAllPublicProducts, getAllReports, getMyProducts, getProductById, getProductStatistics, getReportById, getReportedProductsForSeller, getReportStatistics, getSingleProductForAdmin, getSinglePublicProduct, sellerRespondToReport, takeActionOnReport, updateProduct, updateProductStatus, updateReport, updateReportStatus } from '../controller/product.controller.js';




import { authorized, isAdmin, isSeller, protect } from '../middleware/auth.middleware.js';
import { uploadProductImages } from '../middleware/upload.middleware.js';
import { addToWishlist, checkInWishlist, clearWishlist, getWishlist, getWishlistCount, removeFromWishlist } from '../controller/wishlist.controller.js';
import { applyPriceRules, createPriceRule, deletePriceRule, getAllPriceRules, getPriceRuleOptions, updatePriceRule } from '../controller/priceRule.controller.js';





const productRoute = Router();

//--------------------------PRODUCTS-----------------------------------

//-------SELLER----------

productRoute.post('/seller/create-product',authorized, isSeller, uploadProductImages, createProduct)

productRoute.get('/seller/my-products',authorized, isSeller, protect, getMyProducts )
productRoute.get('/seller/my-products/:productId',authorized, isSeller, protect, getProductById )

productRoute.put('/seller/update-product/:productId',authorized, isSeller, protect, uploadProductImages, updateProduct)
productRoute.patch('/seller/update-product/status/:productId',authorized, isSeller, protect, updateProductStatus)

productRoute.delete('/seller/delete-product/:productId',authorized, isSeller, protect, deleteProduct )

//---------ADMIN--------

productRoute.get('/admin/products', authorized, isAdmin,  getAllProducts)
productRoute.get('/admin/products/:productId', authorized, isAdmin, getSingleProductForAdmin)
productRoute.get('/admin/products/statistics', authorized, isAdmin, getProductStatistics)

productRoute.patch('/admin/block-product/:productId', authorized, isAdmin, blockProduct)


//-----------PUBLIC----------
productRoute.get('/public/products', getAllPublicProducts)
productRoute.get('/public/products/:productId', getSinglePublicProduct)



//-----------------------------------------WISHLIST------------------------------------

productRoute.post('/wishlist/add', authorized, addToWishlist)
productRoute.delete('/wishlist/remove/:productId', authorized, removeFromWishlist)
productRoute.delete('/wishlist/clear/all', authorized, clearWishlist)

productRoute.get('/wishlist/count', authorized, getWishlistCount)
productRoute.get('/wishlist', authorized, getWishlist)
productRoute.get('/wishlist/check/:productId', authorized, checkInWishlist )

//----------------------------------------------PRICING RULES-----------------------------------
productRoute.post('/price/create', authorized, isAdmin, createPriceRule)
productRoute.patch('/price/update/:ruleId', authorized, isAdmin, updatePriceRule)

productRoute.delete('/price/delete/:ruleId', authorized, isAdmin, deletePriceRule)

productRoute.get('/price/get-all', authorized, isAdmin, getAllPriceRules)

productRoute.post('/price/apply', authorized, isAdmin, applyPriceRules)

productRoute.get('/price/options', authorized, isAdmin, getPriceRuleOptions)


//---------------------------------------REPORTS----------------------------------------
//-----------ADMIN-------------
productRoute.post('/report/create/:productId', authorized, isAdmin, createProductReport)
productRoute.get('/report/get-all', authorized, isAdmin, getAllReports)
productRoute.get('/report/get/:reportId', authorized, isAdmin, getReportById)
productRoute.put('/report/update/all/:reportId', authorized, isAdmin, updateReport)
productRoute.patch('/report/update/:reportId', authorized, isAdmin,takeActionOnReport)
productRoute.patch('/report/update/status/:reportId', authorized, isAdmin, updateReportStatus)
productRoute.get('/report/report-stats', authorized, isAdmin, getReportStatistics)

//-----------SELLER--------------
productRoute.get('/report/my-reports', authorized, isSeller, protect, getReportedProductsForSeller)
productRoute.post('/report/respond/:reportId', authorized, isSeller, protect, sellerRespondToReport)
productRoute.get('/report/get-my/:reportId', authorized, isSeller, protect, getReportById)





export default productRoute;