import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Category = () => {
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');

  const categories = [
    { name: 'ALL', path: 'all' },
    { name: 'ACOUSTIC', path: 'acoustic' },
    { name: 'ELECTRIC', path: 'electric' },
    { name: 'BASS', path: 'bass' },
    { name: 'SEMI ACOUSTIC', path: 'semi-acoustic' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      // Update sticky state based on scroll direction and position
      if (scrollDirection === 'down' && currentScrollY > 48) {
        setIsSticky(true);
      } else if (scrollDirection === 'up') {
        setIsSticky(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, scrollDirection]);

  return (
    <motion.div
      animate={{ 
        top: isSticky ? 0 : 48,
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`fixed w-full z-40 ${
        isSticky 
          ? 'bg-white/10 dark:bg-neutral-950/95 shadow-lg' 
          : 'bg-white/20 dark:bg-neutral-950/60'
      } backdrop-blur-xl `}
      style={{ top: isSticky ? 0 : 48 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6 md:gap-12 lg:gap-20 py-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const isActive = location.pathname === `/shop/${category.path}` || 
                           (category.path === 'all' && location.pathname === '/shop');
            
            return (
              <Link
                key={category.path}
                to={category.path === 'all' ? '/shop' : `/category/${category.path}`}
                className="group relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-xl md:text-2xl filter drop-shadow-lg">
                    {category.icon}
                  </span>
                  <div className={`
                    text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap
                    transition-all duration-300
                    ${isActive 
                      ? 'text-red-500 dark:text-red-400' 
                      : 'text-[#FF3C38] dark:text-[#f31714] group-hover:text-red-500 dark:group-hover:text-red-400'
                    }
                    ${isActive ? 'glow-text' : 'group-hover:glow-text'}
                  `}>
                    <div className='group relative overflow-hidden '>
                    <div className='transition-transform duration-300 ease-out group-hover:-translate-y-full'>
                      {category.name}
                    </div>
                    <div className='absolute inset-0 transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0'>
                    {category.name}
                    </div>
                    </div>


                  </div>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover Effect */}
                  <span className={`
                    absolute -bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500/50 to-red-600/50 
                    rounded-full transition-all duration-300 scale-x-0 group-hover:scale-x-100
                    ${isActive ? 'hidden' : ''}
                  `} />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Add custom styles for glow effect */}
      <style jsx>{`
        .glow-text {
          text-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            text-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
          }
          50% {
            text-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
          }
        }
        
        /* Hide scrollbar but keep functionality */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
};

export default Category;