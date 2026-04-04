import React from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = ({ onToggle }) => {
  return (
    <div className="p-8 sm:p-10 h-full flex flex-col justify-center grow">
      <div className="mb-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
          Welcome Back
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">Sign in to sync your rhythm.</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-4">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors">
              <Mail size={20} strokeWidth={2.5} />
            </span>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/50 rounded-2xl px-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 placeholder:text-zinc-400"
            />
          </div>

          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition-colors">
              <Lock size={20} strokeWidth={2.5} />
            </span>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/50 rounded-2xl px-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 placeholder:text-zinc-400"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button type="button" className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            Forgot Password?
          </button>
        </div>

        <button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl py-4 font-bold tracking-wide shadow-lg shadow-red-600/25 hover:shadow-red-600/40 transition-all flex items-center justify-center gap-2 group mt-2">
          <span>Sign In</span>
          <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="mt-auto pt-8 text-center text-zinc-500 dark:text-zinc-400 font-medium">
        Don't have an account?{' '}
        <button 
          onClick={onToggle}
          className="font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors tracking-wide underline-offset-4 hover:underline"
        >
          Register here
        </button>
      </div>
    </div>
  );
};

export default Login;