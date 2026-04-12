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

// GET request - Get User Profile (Get Me)
export const getMe = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

// DELETE request - Delete User
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Delete user failed' };
  }
};