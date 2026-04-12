import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeClosed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../utils/apiRequest';

const Register = ({ onToggle }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSeen, setIsSeen] = useState(false);
  const [isConfirmSeen, setIsConfirmSeen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };
    let hasError = false;
    
    if (!name.trim()) {
      newErrors.name = "Full name is required";
      hasError = true;
    } else if (name.trim().length < 3) {
      newErrors.name = "Full name must be at least 3 characters";
      hasError = true;
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Please enter a valid email address";
      hasError = true;
    }
    
    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({ name: "", email: "", password: "", confirmPassword: "" });
    setIsLoading(true);

    try {
       await registerUser({ name, email, password });
       setIsLoading(false)
        setTimeout(() => navigate("/"), 100);
    
    } catch (error) {
      const errorMessage = error?.message || "Something went wrong. Please try again.";
      setErrors({ name: "", email: "", password: errorMessage, confirmPassword: "" });
      setIsLoading(false);
    }
  };

  const handleFullName = (e) => {
    setName(e.target.value);
    if (errors.name) setErrors({ ...errors, name: "" });
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors({ ...errors, email: "" });
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors({ ...errors, password: "" });
    // Clear confirm password error when password changes
    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
  };

  const seenToggle = () => {
    setIsSeen(!isSeen);
  };

  const confirmSeenToggle = () => {
    setIsConfirmSeen(!isConfirmSeen);
  };

  const sellerHandle = () => {
    navigate("/seller/signup");
  };

  return (
    <div className="p-8 sm:p-10 h-full flex flex-col justify-center grow">
      <div className="mb-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
          Create Account
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">Join the HeartzRhythm community.</p>
      </div>

      <form className="space-y-4" onSubmit={handleRegister}>
        <div className="space-y-1">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors">
              <User size={20} strokeWidth={2.5} />
            </span>
            <input 
              value={name}
              onChange={handleFullName}
              type="text" 
              placeholder="Full Name" 
              className="w-full bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/50 rounded-2xl px-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 placeholder:text-zinc-400"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 dark:text-red-400 text-sm ml-4">{errors.name}</p>
          )}
        </div>

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
        
        <div className="space-y-1">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors">
              <Lock size={20} strokeWidth={2.5} />
            </span>
            <input 
              value={confirmPassword}
              onChange={handleConfirmPassword}
              type={isConfirmSeen ? "text" : "password"} 
              placeholder="Confirm Password" 
              className="w-full bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/50 rounded-2xl px-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 placeholder:text-zinc-400"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors cursor-pointer">
              <div onClick={confirmSeenToggle}>
                {isConfirmSeen ? <Eye size={20} strokeWidth={2.5} /> : <EyeClosed size={20} strokeWidth={2.5} />}
              </div>
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 dark:text-red-400 text-sm ml-4">{errors.confirmPassword}</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl py-4 font-bold tracking-wide shadow-lg shadow-red-600/25 hover:shadow-red-600/40 transition-all flex items-center justify-center gap-2 group mt-4 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </>
          ) : (
            <>
              <span>Sign Up</span>
              <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-auto pt-6 text-center text-zinc-500 dark:text-zinc-400 font-medium">
        Already have an account?{' '}
        <button 
          onClick={onToggle}
          className="font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors tracking-wide underline-offset-4 hover:underline"
        >
          Sign In
        </button>
      </div>
      <div className=" text-center text-zinc-500 dark:text-zinc-400 font-medium">
        Wants to become a Seller?{' '}
        <button 
          onClick={sellerHandle}
          className="font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors tracking-wide underline-offset-4 hover:underline cursor-pointer"
        >
          Seller Register
        </button>
      </div>
    </div>
  );
};

export default Register;