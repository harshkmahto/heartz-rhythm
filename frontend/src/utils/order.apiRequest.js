import axios from './axios'


//-------------------------ADDRESS------------------

//Craete Address
export const createAddress = async (addressData) => {
    try {
        const response = await axios.post('/order/address/create', addressData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Address creation failed' };
    }
}

//Get My Addresses
export const getMyAddresses = async () => {
    try {
        const response = await axios.get('/order/address/my');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch addresses' };
    }
}

//Get single address
export const getSingleAddress = async (addressId) => {
    try {
        const response = await axios.get(`/order/address/${addressId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch single address' };
    }

    }

//Get selected address
export const getSelectedAddress = async () => {
    try {
        const response = await axios.get('/order/address/selected');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch selected address' };
    
    }
}   

//Update address
export const updateAddress = async (addressId, addressData) => {
    try {
        const response = await axios.patch(`/order/address/update/${addressId}`, addressData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Address update failed' };
    }
}

//Delete address
export const deleteAddress = async (addressId) => {
    try {
        const response = await axios.delete(`/order/address/delete/${addressId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Address deletion failed' };
    }
}

//Set selected address
export const setSelectedAddress = async (addressId) => {
    try {
        const response = await axios.patch(`/order/address/select/${addressId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Selected address update failed' };
    }
}

//------------------CHECKOUT------------------
export const createCheckout = async (checkoutData) => {
    try {
        const response = await axios.post('/order/checkout', checkoutData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Checkout creation failed' };
    }
}

export const getMyCheckout = async () => {
    try {
        const response = await axios.get('/order/my/checkout');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch checkout' };
    }

}

//------------------------------ORDERS--------------------------------

//COD Order
export const createOrder = async (orderData) => {
    try {
        const response = await axios.post('/order/create/cod', orderData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Order creation failed' };
    }
}

//ONLINE Order
export const onlineCreateOrder = async (orderData) => {
    try {
        const response = await axios.post('/order/create/online', orderData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Order creation failed' };
    }
    }
 
export const verifyPayment = async (paymentData) =>{
    try {
        const response = await axios.post('/order/verify/payment', paymentData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Payment verification failed' };
    }
}   


//GET MY ORDER
export const getMyOrders = async () => {
    try {
        const response = await axios.get('/order/my/orders');
        return response.data;
    } catch (error){
        throw error.response?.data || { message: 'Failed to fetch orders' };
    }

    }

export const getOrderById = async (orderId) => {
    try {
        const response = await axios.get(`/order/my/orders/${orderId}`);
        return response.data;
    } catch (error){
        throw error.response?.data || { message: 'Failed to fetch order' };
    }

    }



//----------------------------------SELLER------------------
export const getSellerOrders = async () => {
    try {
        const response = await axios.get('/order/seller/all/orders');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch orders' };
    
    }
}

export const getSellerOrderById = async (orderId) => {
    try {
        const response = await axios.get(`/order/seller/all/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch order' };
    
    }

    }



//------------------------------------ADMIN-----------------------------
export const getAllOrders = async () => {
    try {
        const response = await axios.get('/order/admin/all/orders');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch orders' };
    
    }

    }

export const getAllOrderDetails = async (orderId) => {
    try {
        const response = await axios.get(`/order/admin/all/orders/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch order' };
    
    }

    
    }  


export const updateOrderStatus = async (orderId, status, reason = '') => {
    try {
        const response = await axios.patch(`/order/admin/status/${orderId}`, { 
            orderStatus: status,
            reason: reason 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Order status update failed' };
    }
}

export const deleteOrder = async (orderId) => {
    try {
        const response = await axios.delete(`/order/admin/delete/${orderId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Order deletion failed' };
    }
}


