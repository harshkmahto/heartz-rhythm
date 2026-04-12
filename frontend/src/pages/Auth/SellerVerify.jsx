import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resendOtpSeller, verifySeller } from '../../utils/apiRequest';

const SellerVerify = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email and tempToken from location state (passed from register page)
  const email = location.state?.email || '';
  const tempToken = location.state?.tempToken || '';

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    if (errors.otp) {
      setErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join(''); // Convert array to string (e.g., ['1','2','3','4','5','6'] -> "123456")
    
    if (otpValue.length !== 6) {
      setErrors({ otp: 'Please enter 6-digit OTP' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // FIX 1: Pass data as an object, not separate arguments
      const response = await verifySeller({ 
        email, 
        otp: otpValue, 
        tempToken 
      });
      
      console.log("Verification successful:", response);
      
      // FIX 2: Stop loading before navigation
      setIsLoading(false);
      
      // Navigate to login page on success
      navigate('/seller');
      
    } catch (error) {
      console.error('Verification error:', error);
      // Extract error message properly
      const errorMessage = error?.message || error?.error || 'Network error. Please try again.';
      setErrors({ otp: errorMessage });
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setErrors({ resend: 'Email not found. Please register again.' });
      return;
    }
    
    setResendLoading(true);
    
    try {
      // FIX 3: Pass email as an object
      await resendOtpSeller({ email });
      
      setErrors({ success: 'OTP resent successfully! Check your email.' });
      setResendLoading(false);
      
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      
      setTimeout(() => {
        setErrors({});
      }, 3000);
      
    } catch (error) {
      console.error('Resend error:', error);
      const errorMessage = error?.message || error?.error || 'Network error. Please try again.';
      setErrors({ resend: errorMessage });
      setResendLoading(false);
    }
  };

  if (!email || !tempToken) {
    return (
      <main className="relative flex flex-col z-0 pt-12 select-none pb-20 min-h-screen bg-gradient-to-b from-gray-200 to-slate-200 dark:from-black dark:to-gray-900">
        <div className="flex h-screen flex-col items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-rose-500">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white">Session Expired</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Please register again</p>
            <button
              onClick={() => navigate('/seller/signup')}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-rose-600 to-orange-500 text-white rounded-lg cursor-pointer"
            >
              Go to Register
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex flex-col z-0 pt-12 select-none pb-20 min-h-screen bg-gradient-to-b from-gray-200 to-slate-200 dark:from-black dark:to-gray-900">
    
      {/* Main Content */}
      <div className="flex h-screen flex-col items-center justify-center pt-20">
        <div className="w-[527px] max-md:w-full max-md:px-5">
          
          {/* Header Text */}
          <div className="mb-12.5 max-md:mb-5 text-center">
            <div className="font-manrope font-bold max-md:text-[2.125rem] text-[2.813rem] leading-[3.125rem] max-md:leading-[3.7rem] text-black dark:text-white">
              Verify Email
            </div>
            <div className="font-manrope font-normal text-xl max-md:text-[1.063rem] mt-2">
              <span className="text-gray-600 dark:text-gray-400">
                Enter the 6-digit code sent to
              </span>
              <p className="text-rose-500 font-semibold mt-1">{email}</p>
            </div>
          </div>

          {/* Success Message */}
          {errors.success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm text-center">
              {errors.success}
            </div>
          )}

          {/* Error Message */}
          {errors.resend && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm text-center">
              {errors.resend}
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-5 max-md:gap-3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-md:gap-2">
              
              {/* OTP Input */}
              <div>
                <div className="flex flex-col gap-2 placeholder-[#898989] rounded-lg text-lg max-md:text-[.925rem]">
                  <label htmlFor="otp" className="font-manrope font-light text-xl max-md:text-[1.063rem] leading-10 text-black dark:text-white">
                    Enter OTP
                  </label>
                  <div className="flex gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border ${
                          errors.otp ? 'border-red-500' : 'border-[#232323]'
                        } bg-[#000000] focus:border-rose-500 focus:ring-2 focus:ring-rose-500 disabled:cursor-not-allowed text-white transition outline-none`}
                      />
                    ))}
                  </div>
                  {errors.otp && <p className="text-red-500 text-xs mt-3 text-center">{errors.otp}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="w-full">
                <div className="w-full flex items-center justify-center mt-10 rounded-lg">
                  <button
                    className="text-black dark:text-white text-center py-4 px-20 rounded-lg w-full text-lg transition-all duration-300 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <span className='cursor-pointer'>Verify & Continue</span>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Resend OTP */}
            <div className="text-center mt-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="text-rose-500 hover:text-rose-400 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <span className="inline-flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </span>
                  ) : (
                    <span className='cursor-pointer'>Resend OTP</span>
                  )}
                </button>
              </p>
            </div>

            {/* Back to Login */}
            <div className="text-center mt-2">
              <button
                onClick={() => navigate('/seller/login')}
                className="text-gray-500 dark:text-gray-500 text-sm hover:text-rose-500 transition cursor-pointer"
              >
                ← Back to Login
              </button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-800"></div>
              </div>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Check your spam folder if you don't see the email
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SellerVerify;