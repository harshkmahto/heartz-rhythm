import api from './axios';

//--------------SELLER REVIEWS-------------

export const createSellerReview = async (panelId, data) => {
    try {
        const response = await api.post(`/reviews/seller/create/${panelId}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Seller review creation failed' };
    }

}

export const getSellerReview = async (panelId) => {
    try {
        const response = await api.get(`/reviews/seller/get/${panelId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch seller reviews' };
    }
}

export const getAverageSellerRating = async (panelId) => {
    try {
        const response = await api.get(`/reviews/seller/get/average/${panelId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch average seller rating' };
    }

}

export const deleteSellerReview = async (panelId, reviewId) => {
    try {
        const response = await api.delete(`/reviews/seller/delete/${panelId}/${reviewId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Seller review deletion failed' };
    
    }
}