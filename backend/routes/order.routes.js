import { Router } from 'express'
import { createAddress, deleteAddress, getAddressById, getMyAddresses, getSelectedAddress, setSelectedAddress, updateAddress } from '../controller/address.controller.js';
import { authorized } from '../middleware/auth.middleware.js';





const orderRoute = Router();

orderRoute.post('/address/create', authorized, createAddress);
orderRoute.get('/address/my', authorized, getMyAddresses);
orderRoute.get('/address/:addressId', authorized, getAddressById);
orderRoute.get('/address/selected', authorized, getSelectedAddress);
orderRoute.patch('/address/update/:addressId', authorized, updateAddress);
orderRoute.delete('/address/delete/:addressId', authorized, deleteAddress);
orderRoute.patch('/address/select/:addressId', authorized, setSelectedAddress);





export default orderRoute;