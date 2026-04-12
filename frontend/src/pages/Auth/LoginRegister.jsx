import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../../components/Auth/Login';
import Register from '../../components/Auth/Register';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ShowCaseSection/Buttons';
import { useNavigate } from 'react-router-dom';

const MotionDiv = motion.div;

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);

  const {isAuthenticated, logout} = useAuth();
  const navigate = useNavigate();

  const toggleView = () => setIsLogin(!isLogin);

  const logoutHandle = async () => {
    await logout();
    navigate('/auth');
  }

  const home = ()=> {
    navigate('/')
  }


  if(isAuthenticated){
    return(
      <div className='min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white p-5'>
        <div className='shadow-md p-10 rounded-2xl'>
        <div className='text-center text-2xl font-bold '>You Are Already Login </div>
        <div className='flex justify-center items-center gap-6 mt-8'>

        <Button text="Logout" onClick={logoutHandle} />
        <Button text="go to home" onClick={home}/>
        </div>
        </div>

      </div>
    )
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-black dark:via-zinc-900 dark:to-black p-4 transition-colors duration-300 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div 
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-red-500/20 to-rose-500/20 dark:from-red-900/30 dark:to-rose-900/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute top-40 right-10 w-72 h-72 rounded-full bg-gradient-to-r from-rose-400/20 to-pink-400/20 dark:from-rose-900/30 dark:to-pink-900/30 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        <motion.div 
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-r from-red-600/20 to-orange-500/20 dark:from-red-800/30 dark:to-orange-900/30 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <motion.div 
          className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 dark:border-zinc-800/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative min-h-[600px] flex overflow-hidden">
            
            <AnimatePresence mode="wait">
              {isLogin ? (
                // LOGIN MODE: Image Left, Form Right
                <React.Fragment key="login">
                  {/* Image Side - Left */}
                  <div className="hidden lg:block relative w-1/2 flex-shrink-0 bg-gradient-to-br from-red-600 to-rose-700">
                    <motion.div
                      initial={{ x: 0, opacity: 1 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 300, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <img 
                        src="https://wallpapers.com/images/hd/vintage-electric-guitar-closeup-286lsrfprovmtbji.jpg"
                        alt="Login illustration"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </motion.div>
                    
                    <div className="absolute inset-0 flex flex-col justify-between p-8 text-white z-10">
                      <div>
                        <motion.h2 
                          className="text-3xl font-bold mb-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          Welcome Back!
                        </motion.h2>
                        <motion.p 
                          className="text-white/80 text-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          Sign in to continue your journey
                        </motion.p>
                      </div>
                      
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-8 h-[2px] bg-white/40 rounded-full" />
                          <span className="text-white/60">Secure Authentication</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-8 h-[2px] bg-white/40 rounded-full" />
                          <span className="text-white/60">24/7 Support</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Form Side - Right */}
                  <div className="w-full lg:w-1/2 flex-shrink-0 relative overflow-hidden">
                    <motion.div
                      initial={{ x: 0, opacity: 1 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="w-full h-full"
                    >
                      <Login onToggle={toggleView} />
                    </motion.div>
                  </div>
                </React.Fragment>
              ) : (
                // REGISTER MODE: Form Left, Image Right
                <React.Fragment key="register">
                  {/* Form Side - Left */}
                  <div className="w-full lg:w-1/2 flex-shrink-0 relative overflow-hidden">
                    <motion.div
                      initial={{ x: -300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="w-full h-full"
                    >
                      <Register onToggle={toggleView} />
                    </motion.div>
                  </div>

                  {/* Image Side - Right */}
                  <div className="hidden lg:block relative w-1/2 flex-shrink-0 bg-gradient-to-br from-red-600 to-rose-700">
                    <motion.div
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 300, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <img 
                        src="https://wallpapers.com/images/hd/vintage-electric-guitar-closeup-286lsrfprovmtbji.jpg"
                        alt="Register illustration"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </motion.div>
                    
                    <div className="absolute inset-0 flex flex-col justify-between p-8 text-white z-10">
                      <div>
                        <motion.h2 
                          className="text-3xl font-bold mb-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          Join Us Today!
                        </motion.h2>
                        <motion.p 
                          className="text-white/80 text-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          Create an account and start exploring
                        </motion.p>
                      </div>
                      
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-8 h-[2px] bg-white/40 rounded-full" />
                          <span className="text-white/60">Secure Authentication</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-8 h-[2px] bg-white/40 rounded-full" />
                          <span className="text-white/60">24/7 Support</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginRegister;