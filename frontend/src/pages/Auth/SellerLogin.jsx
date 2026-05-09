import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeClosed, EyeIcon } from 'lucide-react';
import { loginUser } from '../../utils/apiRequest';
import { useAuth } from '../../context/AuthContext';


const SellerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { checkAuth, logout } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
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
      const response = await loginUser({
        email: formData.email,
        password: formData.password
      });
      
      if (response && response.user) {
        
        if (response.user.role === 'seller') {
          await checkAuth();
          navigate('/seller');
        } else {
          alert("it's seems like you are not seller, you are not seller")
         await logout();
        }
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: error.message || 'Invalid credentials' });
    } finally {
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
              Seller Sign In
            </div>
            <div className="font-manrope font-normal flex items-center gap-3 text-2xl max-md:text-[1.063rem]">
              <span className="text-grey-400 dark:text-gray-400 text-gray-800">Don't have a seller account?</span>
              <button 
                onClick={() => navigate('/seller/signup')}
                className="cursor-pointer text-rose-500 hover:text-rose-400 transition"
              >
                Sign Up
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
              
              {/* Email */}
              <div className="w-full">
                <div className="flex flex-col gap-2 placeholder-[#898989] rounded-lg text-lg max-md:text-[.925rem]">
                  <label htmlFor="email" className="font-manrope font-light text-xl max-md:text-[1.063rem] leading-10 text-black dark:text-white">
                    Email Address
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

              {/* Password */}
              <div>
                <div className="flex flex-col gap-2 placeholder-[#898989] rounded-lg text-lg max-md:text-[.925rem]">
                  <label htmlFor="password" className="font-manrope font-light text-xl max-md:text-[1.063rem] leading-10 text-black dark:text-white">
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
                      {showPassword ? <EyeIcon size={20} /> : <EyeClosed size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-rose-500 hover:text-rose-400 transition cursor-pointer"
                >
                  Forgot Password?
                </button>
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
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <span className='cursor-pointer'>Sign In</span>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-500 dark:text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <div className="border border-[#4E4A48] bg-gradient-to-b from-[#171212] to-[#100B0B] hover:bg-[linear-gradient(180deg,#171212,70%,#100B0B,100%)] flex w-full items-center justify-center gap-2 rounded-lg border-[.5px] px-4 py-3.5 text-center text-lg max-md:py-3 max-md:text-[.925rem] cursor-pointer transition-all duration-500 hover:border-rose-500/50 group">
              <i className="fab fa-google text-white/70 group-hover:text-rose-500 transition"></i>
              <span className="text-white/70 group-hover:text-rose-500 transition">Continue with Google</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SellerLogin;