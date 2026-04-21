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

// GET MY PRODUCTS
export const getMyProducts = async (params) => {
    try {
        // Build the URL with query parameters
        const queryString = params ? `?${params.toString()}` : '';
        const url = `/product/seller/my-products${queryString}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch products' };
    }
}

// GET MY SINGLE PRODUCT
export const getMySingleProduct = async (productId) => {
    try {
        const response = await api.get(`/product/seller/my-products/${productId}`);
        return response.data;
 } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch product' };
 }
}

// UPDATE PRODUCTS BY SELLER
export const updateProduct = async (productId, data) => {
    try {
        const response = await api.put(`/product/seller/update-product/${productId}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Product update failed' };
    }
};

// UPDATE PRODUCT STATUS BY SELLER
export const updateProductStatus = async (productId, status) => {
    try {
        const response = await api.patch(`/product/seller/update-product/status/${productId}`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Product status update failed' };
    }
}



// DELETE PRODUCT BY SELLER
export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/product/seller/delete-product/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Product deletion failed' };
    }
};


//-----------------ADMIN----------------

//GET ALL PRODUCTS
export const getAllProducts = async (params) => {
    try {
        const queryString = params ? `?${params.toString()}` : '';
        const url = `/product/admin/products${queryString}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch products' };
    
        
    }
}

//GET SINGLE PRODUCT
export const getSingleProduct = async (productId) => {
    try {
        const response = await api.get(`/product/admin/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch product' };
    
    }
}

// GET PRODUCTS STATICS
export const getProductStatistics = async (days) => {
    try {
        const response = await api.get(`/product/admin/products/statistics?days=${days}`);
        return response.data;
    } catch(error){
        throw error.response?.data || { message: 'Failed to fetch product statistics' };
    
    }
}


//-----------------PUBLIC------------------------

//GET ALL PRODUCTS
export const getAllPublicProducts = async(params)=> {
    try {
        const queryString = params ? `?${params.toString()}` : '';
        const url = `/product/public/products${queryString}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch products' };
    }
        
}

// GET SINGLE PRODUCT
export const getSinglePublicProduct = async (productId) => {
    try {
        const response = await api.get(`/product/public/products/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch product' };
    }
    }