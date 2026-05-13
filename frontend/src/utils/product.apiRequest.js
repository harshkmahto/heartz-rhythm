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


//BLOCK PRODUCT
export const blockProduct = async (productId, data) => {
    try {
        const response = await api.patch(`/product/admin/block-product/${productId}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to block product' };
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

export const getComingSoon = async () => {
    try {
        const response = await api.get('/product/public/comingsoon');
        return response.data;
    } catch(error){
        throw error.response?.data || { message: 'Failed to fetch coming soon products' };
    }
    }

export const getComingSoonDetails = async (productId) => {
    try {
        const response = await api.get(`/product/public/comingsoon/${productId}`);
        return response.data;
    } catch(error){
        throw error.response?.data || { message: 'Failed to fetch coming soon product details' };
    }
    }  

export const getProductCoupon = async (productId) => {
    try {
        const response = await api.get(`/product/public/coupon/${productId}`);
        return response.data;
    } catch (error){
        throw error.response?.data || { message: 'Failed to fetch coupon' };
    }
    }

// In order.apiRequest.js
export const couponApplied = async (productId, data) => {
    try {
        const response = await api.post(`/product/public/coupon/apply/${productId}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Coupon application failed' };
    }
};
//-----------------WISHLIST----------------
export const addToWishlist = async (productId) => {
    try {
        const response = await api.post('/product/wishlist/add', { productId });
        return response.data;

    } catch(error) {
        throw error.response?.data || { message: 'Failed to add product to wishlist' };
    }
}

export const removeFromWishlist = async (productId) => {
    try {
        const response = await api.delete(`/product/wishlist/remove/${productId}`);
        return response.data;
    } catch(error) {
        throw error.response?.data || { message: 'Failed to remove product from wishlist' };
    }
}

export const clearWishlist = async () => {
    try {
        const response = await api.delete('/product/wishlist/clear/all');
        return response.data;
    } catch(error) {
        throw error.response?.data || { message: 'Failed to clear wishlist' };
    }
}

export const checkInWishlist = async (productId) => {
    try {
        const response = await api.get(`/product/wishlist/check/${productId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to check wishlist' };
    }
}

export const getWishlistCount = async () => {
    try {
        const response = await api.get('/product/wishlist/count');
        return response.data;
    } catch(error) {
        throw error.response?.data || { message: 'Failed to get wishlist count' };
    }
}

export const getWishlist = async () => {
    try {
        const response = await api.get('/product/wishlist');
        return response.data;
    } catch(error){
        throw error.response?.data || { message: 'Failed to get wishlist' };
    }

    }


//----------------------------------------CART-------------------------------------------

// Get user's cart
export const getCart = async () => {
    try {
        const response = await api.get('/product/cart');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch cart' };
    }
};

// Add item to cart
export const addToCart = async (productId, variantId, quantity = 1) => {
    try {
        const response = await api.post('/product/cart/add', { 
            productId, 
            variantId, 
            quantity 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to add item to cart' };
    }
};

// Update cart item quantity
export const updateCartQuantity = async (cartItemId, quantity) => {
    try {
        const response = await api.patch(`/product/cart/update/${cartItemId}`, { 
            quantity 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update quantity' };
    }
};

// Change variant
export const changeVariant = async (cartItemId, newVariantId, quantity = 1) => {
    try {
        const response = await api.patch(`/product/cart/change-variant/${cartItemId}`, { 
            newVariantId, 
            quantity 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to change variant' };
    }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
    try {
        const response = await api.delete(`/product/cart/remove/${cartItemId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to remove item from cart' };
    }
};

export const checkVariantInCart = async (productId, variantId) => {
    try {
        const response = await api.get(`/product/cart/variant/${productId}/${variantId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to check cart' };
    }
};


//-----------------PRICING RULES----------------

// CREATE PRICE RULE
export const createPriceRule = async (ruleData) => {
    try {
        const response = await api.post('/product/price/create', ruleData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create price rule' };
    }
};

// GET ALL PRICE RULES
export const getAllPriceRules = async () => {
    try {
        const response = await api.get('/product/price/get-all');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch price rules' };
    }
};

// UPDATE PRICE RULE
export const updatePriceRule = async (ruleId, updateData) => {
    try {
        const response = await api.patch(`/product/price/update/${ruleId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update price rule' };
    }
};

// DELETE PRICE RULE
export const deletePriceRule = async (ruleId) => {
    try {
        const response = await api.delete(`/product/price/delete/${ruleId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete price rule' };
    }
};

// APPLY PRICE RULES MANUALLY
export const applyPriceRules = async () => {
    try {
        const response = await api.post('/product/price/apply');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to apply price rules' };
    }
};

// GET PRICE RULE OPTIONS (for dropdowns in UI)
export const getPriceRuleOptions = async () => {
    try {
        const response = await api.get('/product/price/options');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch price rule options' };
    }
};

// Add these report-related functions to your api.js file

//-----------------REPORTS----------------

// ADMIN: Create a product report
export const createProductReport = async (productId, reportData) => {
    try {
        const response = await api.post(`/product/report/create/${productId}`, reportData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create report' };
    }
};

// ADMIN: Get all reports (with filters)
export const getAllReports = async (params = {}) => {
    try {
        const response = await api.get('/product/report/get-all', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch reports' };
    }
};

// ADMIN: Get single report by ID
export const getReportById = async (reportId) => {
    try {
        const response = await api.get(`/product/report/get/${reportId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch report' };
    }
};

// ADMIN: Update a report
export const updateReport = async (reportId, updateData) => {
    try {
        const response = await api.put(`/product/report/update/all/${reportId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update report' };
    }
 };

// ADMIN: Take action on report 
export const takeActionOnReport = async (reportId, actionData) => {
    try {
        const response = await api.patch(`/product/report/update/${reportId}`, actionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update report' };
    }
};

// ADMIN: Update report status
export const updateReportStatus = async (reportId, status) => {
    try {
        const response = await api.patch(`/product/report/update/status/${reportId}`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update report status' };
    }
};

// ADMIN: Get report statistics
export const getReportStatistics = async (days = 30) => {
    try {
        const response = await api.get(`/product/report/report-stats?days=${days}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch report statistics' };
    }
};

// SELLER: Get my reported products (products owned by seller that have reports)
export const getMyReportedProducts = async (params = {}) => {
    try {
        const response = await api.get('/product/report/my-reports', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch reported products' };
    }
};

// SELLER: Respond to a report about their product
export const sellerRespondToReport = async (reportId, response) => {
    try {
        const responseData = await api.post(`/product/report/respond/${reportId}`, { response });
        return responseData.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to submit response' };
    }
};

// SELLER: Get single report by ID (only for their own products)
export const getMyReportById = async (reportId) => {
    try {
        const response = await api.get(`/product/report/get-my/${reportId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch report' };
    }
};