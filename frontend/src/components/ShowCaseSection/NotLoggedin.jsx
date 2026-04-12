// components/NotLoggedin.jsx - With Guitar Theme
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotLoggedin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Guitar strings background */}
      <div className="absolute inset-0 flex justify-center gap-4 opacity-5">
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <div key={i} className="w-0.5 h-full bg-white" />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md">
        
        {/* Musical Notes Animation */}
        <div className="mb-8 flex justify-center gap-2">
          {['♪', '♫', '♪', '♫'].map((note, i) => (
            <span
              key={i}
              className="text-4xl text-red-500 animate-bounce"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              {note}
            </span>
          ))}
        </div>

        {/* Message */}
        <div className="bg-black/50 backdrop-blur-md rounded-2xl p-8 border border-red-500/20">
          <h1 className="text-3xl font-bold text-white mb-3">
            Access Denied
          </h1>
          
          <p className="text-gray-300 mb-6">
            You need to be logged in to view this page.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/auth')}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
            >
              Login to Continue
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
            >
              Return to Homepage
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-gray-400 text-sm">
          HeartzRhythm - Find your perfect rhythm 🎸
        </p>
      </div>
    </div>
  );
};

export default NotLoggedin;