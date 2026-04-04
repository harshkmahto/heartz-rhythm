import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../../components/Auth/Login';
import Register from '../../components/Auth/Register';

const MotionDiv = motion.div;

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleView = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-red-500/10 dark:bg-red-900/20 blur-3xl mix-blend-multiply dark:mix-blend-lighten opacity-70"></div>
        <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-rose-400/10 dark:bg-rose-900/20 blur-3xl mix-blend-multiply dark:mix-blend-lighten opacity-50"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-red-600/10 dark:bg-red-800/20 blur-3xl mix-blend-multiply dark:mix-blend-lighten opacity-70"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/50 dark:border-zinc-800/50 overflow-hidden relative min-h-[550px] sm:min-h-[600px] flex flex-col transition-all duration-300">
          
          <AnimatePresence mode="wait" initial={false}>
            {isLogin ? (
              <MotionDiv
                key="login"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full grow flex flex-col"
              >
                <Login onToggle={toggleView} />
              </MotionDiv>
            ) : (
              <MotionDiv
                key="register"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full grow flex flex-col"
              >
                <Register onToggle={toggleView} />
              </MotionDiv>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default LoginRegister;