import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeClosed, EyeIcon } from 'lucide-react';
import { registerSeller } from '../../utils/apiRequest';

const SellerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  setIsLoading(true);

  try {
    const data = await registerSeller(formData);
        
    setIsLoading(false);
    
    navigate('/seller/verify', { 
      state: { 
        email: data.email, 
        tempToken: data.tempToken  
      } 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error?.message || error?.error || 'Network error. Please try again.';
    setErrors({ submit: errorMessage });
    setIsLoading(false);
  }
};

  return (
    <main className="relative flex flex-col z-0 pt-12 select-none pb-20 min-h-screen bg-gradient-to-b from-gray-200 to-slate-200 dark:from-black dark:to-gray-900">
    
      {/* Main Content */}
      <div className="flex h-screen flex-col items-center justify-center pt-20">
        <div className="w-[527px] max-md:w-full max-md:px-5">
          
          {/* Header Text */}
          <div className="mb-12.5 max-md:mb-5">
            <div className="font-manrope font-bold max-md:text-[2.125rem] text-[2.813rem] leading-[3.125rem] max-md:leading-[3.7rem] text-black dark:text-white">
              Sign Up
            </div>
            <div className="font-manrope font-normal flex items-center gap-3 text-2xl max-md:text-[1.063rem]">
              <span className="text-grey-400 dark:text-gray-400 text-gray-800">Already have an account?</span>
              <button 
                onClick={() => navigate('/seller/login')}
                className="cursor-pointer text-rose-500 hover:text-rose-400 transition"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm text-center">
              {errors.submit}
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-5 max-md:gap-3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-md:gap-2">
              
              {/* Full Name */}
              <div className="text-black dark:text-white">
                <div className="flex flex-col gap-2 placeholder-[#898989] text-black dark:text-white rounded-lg text-lg focus:border-black max-md:text-[.925rem] w-full">
                  <label htmlFor="name" className="font-manrope font-light text-xl max-md:text-[1.063rem] leading-10">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className={`border ${errors.name ? 'border-red-500' : 'border-[#232323]'} bg-[#000000] focus:border-rose-500 disabled:cursor-not-allowed py-2 w-full rounded-lg px-5 text-lg outline-none max-md:h-12 placeholder-[#898989] text-white transition`}
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <div className="flex flex-col gap-2 placeholder-[#898989] me-1 rounded-lg text-lg font-manrope font-normal focus:border-black max-md:text-[.925rem]">
                  <label htmlFor="phone" className="font-manrope font-light text-xl max-md:text-[1.063rem] leading-10">
                    Phone Number
                  </label>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number here"
                    maxLength="10"
                    className={`border ${errors.phone ? 'border-red-500' : 'border-[#232323]'} bg-[#000000] focus:border-rose-500 disabled:cursor-not-allowed py-2 w-full rounded-lg px-5 text-lg outline-none max-md:h-12 placeholder-[#898989] text-white transition`}
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="w-full">
                <div className="flex flex-col gap-2 placeholder-[#898989] rounded-lg text-lg max-md:text-[.925rem]">
                  <label htmlFor="email" className="font-manrope font-light text-xl max-md:text-[1.063rem] leading-10">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    placeholder="Enter your email here"
                    className={`border ${errors.email ? 'border-red-500' : 'border-[#232323]'} bg-[#000000] focus:border-rose-500 disabled:cursor-not-allowed py-2 w-full rounded-lg px-5 text-lg outline-none max-md:h-12 placeholder-[#898989] text-white transition`}
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="flex-1">
                  <div className="flex flex-col gap-2 placeholder-[#898989] rounded-lg text-lg max-md:text-[.925rem]">
                    <label htmlFor="password" className="font-manrope font-light text-xl max-md:text-[1.063rem] leading-10">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        className={`border ${errors.password ? 'border-red-500' : 'border-[#232323]'} bg-[#000000] focus:border-rose-500 disabled:cursor-not-allowed py-2 w-full rounded-lg px-5 text-lg outline-none max-md:h-12 placeholder-[#898989] text-white transition pr-12`}
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition"
                      >
                        {showPassword ? <EyeIcon/> : <EyeClosed/>}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col gap-2 placeholder-[#898989] rounded-lg text-lg max-md:text-[.925rem]">
                    <label htmlFor="confirmPassword" className="font-manrope font-light text-xl max-md:text-[1.063rem] leading-10">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        className={`border ${errors.confirmPassword ? 'border-red-500' : 'border-[#232323]'} bg-[#000000] focus:border-rose-500 disabled:cursor-not-allowed py-2 w-full rounded-lg px-5 text-lg outline-none max-md:h-12 placeholder-[#898989] text-white transition pr-12`}
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition"
                      >
                       {showConfirmPassword ? <EyeIcon/> : <EyeClosed/>}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
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
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      'Register Now'
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Terms & Conditions */}
            <div className="flex items-center gap-3 mt-2">
              <label htmlFor="privacy-policy" className="text-gray-800 dark:text-gray-400 text-sm font-manrope cursor-pointer">
                I agree to the <a href="#" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">Terms & Conditions</a>, 
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline ml-1">Privacy Policy</a> and anti-piracy policy.
              </label>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-800"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SellerRegister;