import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileMenu from './MenuBar';
import { useAuth } from '../../context/AuthContext';
import Button from './Buttons';
import { useCart } from '../../context/CartContext';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const {isAuthenticated} = useAuth();
  const {cartCount} = useCart();

  const navigate = useNavigate();


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

  // Close mobile menu
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
        className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-15 bg-white/10 backdrop-blur  transition-colors duration-300"
      >
        {/* Logo - Left Side */}
        <Link 
          to="/" 
          className="text-2xl font-bold italic text-black dark:text-white tracking-tighter font-headline hover:scale-105 transition-transform duration-300"
        >
          HEARTZ RHYTHM
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10 bg-white/10 backdrop-blur shadow-sm rounded-2xl p-3">
          {['SHOP', 'ABOUT', 'SELLERS', 'CONTACT'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="group relative overflow-hidden font-headline tracking-tight text-black/90 dark:text-white/90"
            >
              {/* Original text - slides up on hover */}
              <div className="transition-transform duration-300 ease-out group-hover:-translate-y-full">
                {item}
              </div>
              
              {/* Duplicate text - slides up from bottom on hover */}
              <div className="absolute inset-0 transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0">
                {item}
              </div>
              
            </Link>
          ))}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Search */}
          <div className="relative hidden md:block">
          
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/search')} 
              className="text-gray-500 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Search size={20} className='cursor-pointer' />
            </motion.button>
          </div>

          {isAuthenticated ? ( 
            <div className='flex items-center justify-center gap-4'>
                {/* Cart */}
          <Link to="/cart" className="relative group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-500 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-400 text-white text-[10px] h-4 w-4 flex items-center justify-center rounded-full font-bold shadow-md">
                {cartCount}
              </span>
            </motion.div>
          </Link>

          {/* Profile Icon */}
          <Link to="/profile" className="group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-500 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <User size={20} />
            </motion.div>
          </Link>
            </div>

          ):(
            <div>
              <Link to='/auth'>
              <Button 
               text="Login" 
               size='sm' 
               fromColor='transparent'
               toColor='transparent'
               textColor='black'
               darkText='white'
               hoverColor='red-500'
               />
               </Link>
            </div>
          ) }

        

          {/* Menu Button - Visible on all screens */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-gray-500 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-50 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
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