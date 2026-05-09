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