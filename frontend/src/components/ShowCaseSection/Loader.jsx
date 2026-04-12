// components/Loader.jsx - Minimalist
import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center gap-4">
      {/* Spinning Guitar Pick */}
      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-spin" />
      
      {/* Text */}
      <div className="flex gap-1">
        <span className="text-red-500 animate-bounce">♪</span>
        <span className="text-gray-500 dark:text-gray-400 text-sm animate-pulse">
          Loading...
        </span>
        <span className="text-red-500 animate-bounce delay-200">♫</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;