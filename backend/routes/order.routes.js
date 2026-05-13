import { Router } from 'express'
import { createAddress, deleteAddress, getAddressById, getMyAddresses, getSelectedAddress, setSelectedAddress, updateAddress } from '../controller/address.controller.js';
import { authorized, isAdmin, isSeller, protect } from '../middleware/auth.middleware.js';
import { createCheckout, getMyCheckout } from '../controller/cart.controller.js';
import { createOrder, deleteOrder, getAllOrderDetails, getAllOrders, getMyOrders, getOrderById, getSellerOrderDetails, getSellerOrders, onlineCreateOrder, updateOrderStatus, verifyPayment } from '../controller/order.controller.js';





const orderRoute = Router();
//-------------------ADDRESS-----------------------
orderRoute.post('/address/create', authorized, createAddress);
orderRoute.get('/address/my', authorized, getMyAddresses);
orderRoute.get('/address/selected', authorized, getSelectedAddress);
orderRoute.get('/address/:addressId', authorized, getAddressById);
orderRoute.patch('/address/update/:addressId', authorized, updateAddress);
orderRoute.delete('/address/delete/:addressId', authorized, deleteAddress);
orderRoute.patch('/address/select/:addressId', authorized, setSelectedAddress);

//------------------------CHECKOUT--------------------------------
orderRoute.post('/checkout', authorized, createCheckout);
orderRoute.get('/my/checkout', authorized, getMyCheckout)

//------------------------------ORDERS---------------------------------------

//COD Order
orderRoute.post('/create/cod', authorized, createOrder)
//ONLINE Order
orderRoute.post('/create/online', authorized, onlineCreateOrder)
orderRoute.post('/verify/payment', authorized, verifyPayment)

orderRoute.get('/my/orders', authorized, getMyOrders)
orderRoute.get('/my/orders/:orderId', authorized, getOrderById)

//-------------------------SELLER-------------------------------------------------
orderRoute.get('/seller/all/orders', authorized, isSeller, protect, getSellerOrders)
orderRoute.get('/seller/all/orders/:orderId', authorized, isSeller, protect, getSellerOrderDetails)



//---------------------------------------ADMIN----------------------------------
orderRoute.get('/admin/all/orders', authorized, isAdmin, getAllOrders)
orderRoute.get('/admin/all/orders/:orderId', authorized, isAdmin, getAllOrderDetails)

orderRoute.patch('/admin/status/:orderId', authorized, isAdmin, updateOrderStatus)

orderRoute.delete('/admin/delete/:orderId', authorized, isAdmin, deleteOrder)

export default orderRoute;