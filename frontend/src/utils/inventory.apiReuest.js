import api from './axios'




//-------------------DRAFT INVENTORY----------------

// CREATE DRAFT INVENTROY
export const createDraftInventory = async (data) => {
    try {
        const response = await api.post('/seller/inventory/create-inventory', data,);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Draft inventory creation failed' };
    }
};


//UPDATE DRAFT INVENTORY
export const updateDraftInventory = async (noteId, data) => {
    try {
        const response = await api.patch(`/seller/inventory/update-inventory/${noteId}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Draft inventory update failed' };
    }
};


//DELETE DRAFT INVENTORY
export const deleteDraftInventory = async (noteId,) => {
    try {
        const response = await api.delete(`/seller/inventory/delete-inventory/${noteId}`);
        return response.data;
    } catch (error){
        throw error.response?.data || { message: 'Draft inventory deletion failed' };
    }
}

//BULK DELETE DRAFT INVENTORY
export const bulkDeleteDraftInventory = async (noteIds) => {
    try {
        const response = await api.post(`/seller/inventory/delete-all`,{noteIds});
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Bulk draft inventory deletion failed' };
    }
}


//GET ALL DRAFT INVENTORY
export const getAllDraftInventory = async () => {
    try {
        const response = await api.get('/seller/inventory/inventory');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch draft inventory' };
    }
}  

//GET SINGLE DRAFT INVENTORY
export const getSingleDraftInventory = async (noteId) => {
    try {
        const response = await api.get(`/seller/inventory/inventory//${noteId}` );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch single draft inventory' };
        
    }
}



//-----------------INVENTORY-------------------

// CREATE INVENTORY
export const createInventory = async (data) => {
    try {
        const response = await api.post('/seller/inventory/create/inventory-notes', data);
        return response.data;
    
    } catch (error) {
        throw error.response?.data || { message: 'Inventory creation failed' };
        
    }
}

//UPDATE INVENTORY
export const updateInventory = async (noteId, data) => {
    try {
        const response = await api.patch(`/seller/inventory/update/inventory-notes/${noteId}`, data);
        return response.data;
    } catch(error) {
        throw error.response?.data || { message: 'Inventory update failed' };
    }
}

//DELETE INVENTORY
export const deleteInventory = async (noteId) => {
    try {
        const response = await api.delete(`/seller/inventory/delete/inventory-notes/${noteId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Inventory deletion failed' };
    }
}

//GET ALL INVENTORY
export const getAllInventory = async () => {
    try {
        const response = await api.get('/seller/inventory/inventory/notes');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch inventory' };
        
    }
}

