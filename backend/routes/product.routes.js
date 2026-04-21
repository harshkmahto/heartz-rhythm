import {Router} from 'express'


import { createProduct, deleteProduct, getAllProducts, getAllPublicProducts, getMyProducts, getProductById, getProductStatistics, getSingleProductForAdmin, getSinglePublicProduct, updateProduct, updateProductStatus } from '../controller/product.controller.js';




import { authorized, isAdmin, isSeller, protect } from '../middleware/auth.middleware.js';
import { uploadProductImages } from '../middleware/upload.middleware.js';





const productRoute = Router();

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



//-----------PUBLIC----------
productRoute.get('/public/products', getAllPublicProducts)
productRoute.get('/public/products/:productId', getSinglePublicProduct)





export default productRoute;