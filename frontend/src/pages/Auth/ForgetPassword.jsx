import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeClosed } from 'lucide-react';
import { forgotPassword, verifyForgetOTP, resendForgetOTP } from '../../utils/apiRequest';

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await forgotPassword({ email });
      setStep(2);
      setIsLoading(false);
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error?.message || 'Failed to send OTP. Please try again.';
      setErrors({ email: errorMessage });
      setIsLoading(false);
    }
  };

  // Handle OTP change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    if (errors.otp) {
      setErrors({});
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setErrors({ otp: 'Please enter 6-digit OTP' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Note: You'll need to collect newPassword in step 3
      // For now, we'll just verify OTP and move to next step
      // The actual password reset will happen in step 3
      setStep(3);
      setIsLoading(false);
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error?.message || 'Invalid or expired OTP. Please try again.';
      setErrors({ otp: errorMessage });
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newPassword) {
      setErrors({ newPassword: 'New password is required' });
      return;
    }
    
    if (newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const otpValue = otp.join('');
      await verifyForgetOTP({ 
        email, 
        otp: otpValue, 
        newPassword 
      });
      
      setIsLoading(false);
      
      // Show success message and redirect to login
      alert('Password reset successfully! Please login with your new password.');
      navigate('/auth'); // or '/login' depending on your route
      
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = error?.message || 'Failed to reset password. Please try again.';
      setErrors({ submit: errorMessage });
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setResendLoading(true);
    setErrors({});
    
    try {
      await resendForgetOTP({ email });
      setErrors({ success: 'OTP resent successfully! Check your email.' });
      setResendLoading(false);
      
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      
      setTimeout(() => {
        setErrors({});
      }, 3000);
      
    } catch (error) {
      console.error('Resend error:', error);
      const errorMessage = error?.message || 'Failed to resend OTP. Please try again.';
      setErrors({ resend: errorMessage });
      setResendLoading(false);
    }
  };

  // Render email step
  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
      <div>
        <label className="font-manrope font-light text-xl max-md:text-[1.063rem] leading-10 text-black dark:text-white">
          Email Address
        </label>
        <div className="relative mt-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail size={20} />
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            className={`w-full bg-[#000000] text-white border ${
              errors.email ? 'border-red-500' : 'border-[#232323]'
            } focus:border-rose-500 rounded-lg py-3.5 px-12 outline-none transition`}
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:from-rose-700 hover:to-orange-600 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Sending OTP...</span>
          </div>
        ) : (
          'Send Reset OTP'
        )}
      </button>
    </form>
  );

  // Render OTP step
  const renderOtpStep = () => (
    <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
      <div>
        <label className="font-manrope font-light text-xl max-md:text-[1.063rem] leading-10 text-black dark:text-white">
          Enter OTP
        </label>
        <div className="flex gap-3 justify-center mt-4">
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
              } bg-[#000000] focus:border-rose-500 focus:ring-2 focus:ring-rose-500 text-white outline-none transition`}
            />
          ))}
        </div>
        {errors.otp && <p className="text-red-500 text-xs mt-3 text-center">{errors.otp}</p>}
        {errors.success && (
          <p className="text-green-500 text-xs mt-3 text-center">{errors.success}</p>
        )}
        {errors.resend && (
          <p className="text-red-500 text-xs mt-3 text-center">{errors.resend}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:from-rose-700 hover:to-orange-600 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Verifying...</span>
          </div>
        ) : (
          'Verify OTP'
        )}
      </button>
      
      <div className="text-center mt-2">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendLoading}
          className="text-rose-500 hover:text-rose-400 text-sm font-semibold transition disabled:opacity-50"
        >
          {resendLoading ? 'Sending...' : 'Resend OTP'}
        </button>
      </div>
    </form>
  );

  // Render reset password step
  const renderResetPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
      <div>
        <label className="font-manrope font-light text-xl max-md:text-[1.063rem] leading-10 text-black dark:text-white">
          New Password
        </label>
        <div className="relative mt-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock size={20} />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className={`w-full bg-[#000000] text-white border ${
              errors.newPassword ? 'border-red-500' : 'border-[#232323]'
            } focus:border-rose-500 rounded-lg py-3.5 px-12 outline-none transition pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition"
          >
            {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
          </button>
        </div>
        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
      </div>
      
      <div>
        <label className="font-manrope font-light text-xl max-md:text-[1.063rem] leading-10 text-black dark:text-white">
          Confirm Password
        </label>
        <div className="relative mt-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock size={20} />
          </span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className={`w-full bg-[#000000] text-white border ${
              errors.confirmPassword ? 'border-red-500' : 'border-[#232323]'
            } focus:border-rose-500 rounded-lg py-3.5 px-12 outline-none transition pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition"
          >
            {showConfirmPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>
      
      {errors.submit && (
        <p className="text-red-500 text-xs text-center">{errors.submit}</p>
      )}
      
      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:from-rose-700 hover:to-orange-600 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Resetting Password...</span>
          </div>
        ) : (
          'Reset Password'
        )}
      </button>
    </form>
  );

  return (
    <main className="relative flex flex-col z-0 pt-12 select-none pb-20 min-h-screen bg-gradient-to-b from-gray-200 to-slate-200 dark:from-black dark:to-gray-900">
      <div className="flex h-screen flex-col items-center justify-center pt-20">
        <div className="w-[527px] max-md:w-full max-md:px-5">
          
          {/* Header */}
          <div className="mb-12.5 max-md:mb-5 text-center">
            <button
              onClick={() => step === 1 ? navigate('/auth') : setStep(step - 1)}
              className="absolute left-4 top-8 text-gray-500 hover:text-rose-500 transition"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="font-manrope font-bold max-md:text-[2.125rem] text-[2.813rem] leading-[3.125rem] max-md:leading-[3.7rem] text-black dark:text-white">
              {step === 1 && 'Forgot Password'}
              {step === 2 && 'Verify OTP'}
              {step === 3 && 'Reset Password'}
            </div>
            <div className="font-manrope font-normal text-xl max-md:text-[1.063rem] mt-2">
              <span className="text-gray-600 dark:text-gray-400">
                {step === 1 && 'Enter your email to receive a reset code'}
                {step === 2 && `Enter the 6-digit code sent to ${email}`}
                {step === 3 && 'Create your new password'}
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-5 max-md:gap-3">
            {step === 1 && renderEmailStep()}
            {step === 2 && renderOtpStep()}
            {step === 3 && renderResetPasswordStep()}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgetPassword;