import React, { useState } from 'react';
import SellerLogin from '../../components/Auth/SellerLogin';
import SellerRegister from '../../components/Auth/SellerRegister';

const SellerAuth = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-rose-50 dark:from-black dark:via-gray-900 dark:to-rose-950/20">
      {/* Decorative musical notes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 text-rose-400 text-4xl animate-bounce">♪</div>
        <div className="absolute bottom-20 right-10 text-rose-400 text-5xl animate-pulse">♫</div>
        <div className="absolute top-40 right-20 text-orange-400 text-3xl animate-spin-slow">♩</div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-5xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <i className="fas fa-heartbeat text-4xl text-rose-600 dark:text-rose-400 rhythm-heart"></i>
              <i className="fas fa-guitar text-xl text-orange-500 dark:text-orange-400"></i>
              <span className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
                Heartz Rhythm
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Seller <span className="text-rose-600 dark:text-rose-400">Portal</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3">
              Join our community of musicians and start selling your passion
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white dark:bg-gray-900/60 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-4 text-center font-semibold transition-all duration-300 relative ${
                  activeTab === 'login'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Sign In
                {activeTab === 'login' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-orange-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-4 text-center font-semibold transition-all duration-300 relative ${
                  activeTab === 'register'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <i className="fas fa-user-plus mr-2"></i>
                Create Account
                {activeTab === 'register' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-orange-500"></div>
                )}
              </button>
            </div>

            {/* Content Area */}
            <div className="flex flex-col lg:flex-row">
              {/* Form Section */}
              <div className="flex-1 p-6 md:p-8">
                <div className="transition-all duration-300">
                  {activeTab === 'login' ? <SellerLogin /> : <SellerRegister />}
                </div>
              </div>

              {/* Right Side Panel with Guitar Background */}
              <div className="hidden md:flex lg:w-80 relative overflow-hidden">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1461784121038-f088ca1e7714?w=800&h=1200&fit=crop')"
                  }}
                ></div>
                {/* Dark Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-900/80 to-orange-900/80 dark:from-rose-950/90 dark:to-orange-950/90"></div>
                
                {/* Content */}
                <div className="relative z-10 p-6 md:p-8 flex flex-col justify-center min-h-[400px] text-white">
                  {activeTab === 'login' ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-white/30 shadow-lg mb-4">
                          <img 
                            src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=150&h=150&fit=crop" 
                            alt="Musician"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-bold">Welcome Back!</h3>
                        <p className="text-white/80 text-sm mt-1">Access your seller dashboard</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                          <i className="fas fa-chart-line text-rose-300"></i>
                          <span>Track sales & revenue</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                          <i className="fas fa-box text-rose-300"></i>
                          <span>Manage inventory</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                          <i className="fas fa-comments text-rose-300"></i>
                          <span>Customer messages</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-6">
                        <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-white/30 shadow-lg mb-4">
                          <img 
                            src="https://images.unsplash.com/photo-1453738773917-9c3eff1db985?w=150&h=150&fit=crop" 
                            alt="Studio"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-bold">Start Selling!</h3>
                        <p className="text-white/80 text-sm mt-1">Join 3,500+ active sellers</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                          <i className="fas fa-percent text-rose-300"></i>
                          <span>0% commission for 3 months</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                          <i className="fas fa-globe text-rose-300"></i>
                          <span>50K+ active buyers</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                          <i className="fas fa-shield-alt text-rose-300"></i>
                          <span>Seller protection program</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/20 text-center">
                        <div className="flex items-center justify-between text-sm">
                          <span>Active Sellers</span>
                          <span className="font-bold text-rose-300 text-xl">3,500+</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Musical notes decoration */}
                  <div className="mt-4 text-center">
                    <i className="fas fa-music text-white/40 text-sm mx-1"></i>
                    <i className="fas fa-music text-white/60 text-base mx-1"></i>
                    <i className="fas fa-music text-white/80 text-lg mx-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By continuing, you agree to our <a href="#" className="text-rose-600 hover:underline">Terms of Service</a> and <a href="#" className="text-rose-600 hover:underline">Privacy Policy</a>
            </p>
            <a href="/" className="inline-block text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600 mt-3 transition-colors">
              <i className="fas fa-arrow-left mr-1"></i> Back to Home
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .rhythm-heart {
          animation: pulse 1.6s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); text-shadow: 0 0 10px #e11d48; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-bounce {
          animation: bounce 4s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SellerAuth;