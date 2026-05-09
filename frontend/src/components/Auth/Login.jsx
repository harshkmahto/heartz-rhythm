import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeClosed } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../utils/apiRequest'; 
import { useAuth } from '../../context/AuthContext';

const Login = ({ onToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSeen, setIsSeen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const newErrors = { email: "", password: "" };
    let hasError = false;
    
    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please enter a valid email address";
      hasError = true;
    }
    
    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }
    
    // If validation fails, show errors and stop
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({ email: "", password: "" });
    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });
      
      if (response && response.user) {
        await checkAuth();
        navigate("/");
      } else {
        setErrors({ email: "", password: "Invalid email or password" });
      }
    } catch(error) {
      console.error("Login error:", error);
      const errorMessage = error.message || "Something went wrong. Please try again.";
      setErrors({ email: "", password: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors({ ...errors, email: "" });
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors({ ...errors, password: "" });
  };

  const seenToggle = () => {
    setIsSeen(!isSeen);
  };

  return (
    <div className="p-8 sm:p-10 h-full flex flex-col justify-center grow">
      <div className="mb-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
          Welcome Back
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">Sign in to sync your rhythm.</p>
      </div>

      <form className="space-y-5" onSubmit={handleLogin}>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors">
                <Mail size={20} strokeWidth={2.5} />
              </span>
              <input 
                value={email}
                onChange={handleEmail}
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/50 rounded-2xl px-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 placeholder:text-zinc-400"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-sm ml-4">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors">
                <Lock size={20} strokeWidth={2.5} />
              </span>
              <input 
                value={password}
                onChange={handlePassword}
                type={isSeen ? "text" : "password"} 
                placeholder="Password" 
                className="w-full bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/50 rounded-2xl px-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 placeholder:text-zinc-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors cursor-pointer">
                <div onClick={seenToggle}>
                  {isSeen ? <Eye size={20} strokeWidth={2.5} /> : <EyeClosed size={20} strokeWidth={2.5} />}
                </div>
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 dark:text-red-400 text-sm ml-4">{errors.password}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-1 ">
          <Link to='/forgot-password'>
            <button type="button" className="cursor-pointer text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Forgot Password?
            </button>
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl py-4 font-bold tracking-wide shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 group mt-2  ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Signing in...
            </>
          ) : (
            <>
              <span className='cursor-pointer'>Sign In</span>
              <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-auto pt-8 text-center text-zinc-500 dark:text-zinc-400 font-medium">
        Don't have an account?{' '}
        <button 
          onClick={onToggle}
          className="font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors tracking-wide underline-offset-4 hover:underline cursor-pointer"
        >
          Register here
        </button>
      </div>
     
    </div>
  );
};

export default Login;