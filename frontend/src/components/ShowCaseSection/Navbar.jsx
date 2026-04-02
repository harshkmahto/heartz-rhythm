import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileMenu from './MenuBar';

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-15 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl shadow-[0_0_20px_rgba(255,60,56,0.1)] border-b border-neutral-200/50 dark:border-neutral-800/50 transition-colors duration-300"
      >
        {/* Logo - Left Side */}
        <Link 
          to="/" 
          className="text-2xl font-bold italic text-black dark:text-white tracking-tighter font-headline hover:scale-105 transition-transform duration-300"
        >
          HEARTZ RHYTHM
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {['SHOP', 'ABOUT', 'BLOGS', 'CONTACT'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="group relative font-headline tracking-tight text-neutral-700 dark:text-neutral-100 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors duration-300"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
          ))}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Search */}
          <div className="relative hidden md:block">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0, scale: 0.9 }}
                  animate={{ width: 220, opacity: 1, scale: 1 }}
                  exit={{ width: 0, opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-10 top-1/2 -translate-y-1/2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-neutral-900 dark:text-neutral-50 origin-right shadow-lg"
                  placeholder="Search guitars..."
                  autoFocus
                />
              )}
            </AnimatePresence>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Search size={20} className='cursor-pointer' />
            </motion.button>
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-400 text-white text-[10px] h-4 w-4 flex items-center justify-center rounded-full font-bold shadow-md">
                2
              </span>
            </motion.div>
          </Link>

          {/* Profile Icon */}
          <Link to="/profile" className="group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <User size={20} />
            </motion.div>
          </Link>

          {/* Menu Button - Visible on all screens */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-50 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Menu size={22} />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Component */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
}

export default Navbar;