import api from "./axios";

// CREATE PRODUCT BY SELLER
export const createProduct = async (data) => {
    try {
        const response = await api.post('/product/seller/create-product', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Product creation failed' };
    }
};