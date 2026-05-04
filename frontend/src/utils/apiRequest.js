
import api from "./axios";

// ==================== USER AUTHENTICATION ====================

// POST request - Register User
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/user/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// POST request - Register Seller
export const registerSeller = async (sellerData) => {
  try {
    const response = await api.post('/user/seller/register', sellerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Seller registration failed' };
  }
};

// POST request - Verify Seller OTP
export const verifySeller = async (otpData) => {
  try {
    const response = await api.post('/user/seller/verify-otp', otpData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'OTP verification failed' };
  }
};

// POST request - Resend Seller OTP
export const resendOtpSeller = async (emailData) => {
  try {
    const response = await api.post('/user/seller/resend-otp', emailData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to resend OTP' };
  }
};

// POST request - Login User
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/user/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// POST request - Logout
export const logoutUser = async () => {
  try {
    const response = await api.post('/user/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Logout failed' };
  }
};

// POST request - Logout from all devices
export const logoutAllDevices = async () => {
  try {
    const response = await api.post('/user/logout/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Logout from all devices failed' };
  }
};

// PATCH request - Update Profile
export const updateUserProfile = async (data) => {
  try {
    const response = await api.patch('/user/update/profile', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Profile update failed' };
  }
};

export const updateProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await api.patch('/user/update/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Profile picture update failed' };
  }
};

export const deleteProfilePicture = async () => {
  try {
    const response = await api.delete('/user/delete/profile-picture');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Profile picture deletion failed' };
  }
}

// POST request Forgot Password 

export const forgotPassword = async (emailData) => {
  try {
    const response = await api.post('/user/forget-password', emailData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Forgot password failed' };
  }

}

// POST request - Verify OTP for Password Reset
export const verifyForgetOTP = async (otpData) => {
  try {
    const response = await api.post('/user/password/otp-verify', otpData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'OTP verification failed' };
  }
};

// POST request - Resend OTP for Password Reset
export const resendForgetOTP = async (emailData) => {
  try {
    const response = await api.post('/user/password/resend-otp', emailData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to resend OTP' };
  }
};

export const resetPassword = async (passwordData) => {
  try {
    const response = await api.post('/user/password/reset', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Password reset failed' };
  }
};


// GET request - Get User Profile (Get Me)
export const getMe = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};


// ADMIN ROUTES


// GET - ALL USERS -
export const getAllUser = async () => {
  try {
    const response = await api.get('/user/admin/all-user');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch all users' };
  }
};


// GET - SINGLE USER -
export const getSingleUser = async (userId) => {
  try {
    const response = await api.get(`/user/admin/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch single user' };
  }
}

// GET - ALL SELLERS -
export const getAllSeller = async () => {
  try {
    const response = await api.get('/user/admin/seller');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch all sellers' };
  } 
}

// PATCH - UPDATE USER BY ADMIN -
export const updateUserByAdmin = async (userId, userData) => {
  try {
    const response = await api.patch(`/user/admin/update-user/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Update user by admin failed' };
  }
}

// DELETE request -Admin Delete User
export const deleteUser = async (userId, reason ) => {
  try {
    const response = await api.delete(`/user/admin/delete-user/${userId}`,{data: { reason: reason }});
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Delete user failed' };
  }
};


// GET - GETTING DDELETED USERS -
export const getDeletedUsers = async () => {
  try {
    const response = await api.get('/user/admin/deleted-users');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch deleted users' };

  }
}

// GET - GETTING SINGLE DELETED USER -
export const getSingleDeletedUser = async (binId) => {
  try {
    const response = await api.get(`/user/admin/deleted-user/single/${binId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch single deleted user' };
  }
  }

// POST - RESTORE USERS -
export const restoreUser = async (userId, restoreData) => {
  try {
    const response = await api.post(`/user/admin/restore-user/${userId}`,restoreData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Restore user failed' };
  }
}

// DELETE - PERMANENT DELETE USER -
export const permanentDeleteUser = async (userId) => {
  try {
    const response = await api.delete(`/user/admin/delete-user/permanent/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Permanent delete user failed' };
  }
}

// GET - SELLER PROFILE -
export const getSellerWithPanelById = async (userId) => {
  try {
    const response = await api.get(`/user/admin/seller-profile/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch seller profile' };
  }
}


// Seller Panel API Functions

// CREATE - Create new seller panel
export const createSellerPannel = async (formData, userId) => {
  try {
    const response = await api.post(`/user/seller/pannel/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Seller panel creation failed' };
  }
};

// UPDATE MEDIA - Update cover, logo, and preview images
export const updateSellerMedia = async (formData, userId) => {
  try {
    const response = await api.patch(`/user/seller/pannel-update/media/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Media update failed' };
  }
};

// UPDATE BASIC DETAILS - Update public-facing brand information
export const updateBasicDetails = async (data, userId) => {
  try {
    const response = await api.patch(`/user/seller/pannel-update/${userId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Basic details update failed' };
  }
};

// UPDATE PERSONAL DETAILS - Update private seller information
export const updatePersonalDetails = async (data, userId) => {
  try {
    const response = await api.patch(`/user/seller/pannel-update/personal/${userId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Personal details update failed' };
  }
};

// UPDATE STATUS - Update seller status
export const updateStatus = async (data, userId) => {
  try {
    const response = await api.patch(`/user/seller/pannel-update/status/${userId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Status update failed' };
  }
};


// GET SELLER PANEL - Get seller panel data 
export const getMySellerPannel = async () => {
  try {
    const response = await api.get(`/user/seller/my-pannel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch seller panel' };
  }
};

// GET SELLER BRAND
export const getAllSellerPanels = async () => {
  try {
    const response = await api.get(`/user/seller/brands`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch seller brands' };
  }

  }

  // GET SINGLE SELLER BRAND
export const getSellerPanelById = async (panelId) => {
    try {
      const response = await api.get(`/user/seller/brand/${panelId}`);
      return response.data; 
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch single seller brand' };
    }
    }

// GET SELLER FOR ADMIN
export const getSellerForAdmin = async () => {
  try {
    const response = await api.get(`/user/seller/pannel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch seller for admin' };
  }

  }

// GET SINGLE SELLER FOR ADMIN
export const getSellerByIdForAdmin = async (panelId) => {
  try {
    const response = await api.get(`/user/seller/pannel/${panelId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch single seller for admin' };
  }

  
  }