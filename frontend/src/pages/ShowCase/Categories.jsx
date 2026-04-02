import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight,
  Star,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Music2,
  Guitar as GuitarIcon
} from 'lucide-react';
import Button from '../../components/ShowCaseSection/Buttons';

const Categories = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const categories = [
    {
      id: 1,
      name: 'Acoustic Guitars',
      path: 'acoustic',
      color: 'from-amber-500 to-orange-500',
      image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&auto=format',
      description: 'Warm tones, timeless sound',
      productCount: 42,
      gradient: 'from-amber-900/80 to-orange-900/80'
    },
    {
      id: 2,
      name: 'Electric Guitars',
      path: 'electric',
      color: 'from-blue-500 to-purple-500',
      image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&auto=format',
      description: 'Powerful, versatile, iconic',
      productCount: 68,
      gradient: 'from-blue-900/80 to-purple-900/80'
    },
    {
      id: 3,
      name: 'Bass Guitars',
      path: 'bass',
      color: 'from-green-500 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800&auto=format',
      description: 'Deep rhythm, solid foundation',
      productCount: 35,
      gradient: 'from-green-900/80 to-emerald-900/80'
    },
    {
      id: 4,
      name: 'Semi-Acoustic',
      path: 'semi-acoustic',
      color: 'from-red-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&auto=format',
      description: 'Best of both worlds',
      productCount: 28,
      gradient: 'from-red-900/80 to-pink-900/80'
    },
    {
      id: 5,
      name: 'Accessories',
      path: 'accessories',
      color: 'from-purple-500 to-indigo-500',
      image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&auto=format',
      description: 'Everything you need',
      productCount: 156,
      gradient: 'from-purple-900/80 to-indigo-900/80'
    },
    {
      id: 6,
      name: 'Amplifiers',
      path: 'amplifiers',
      color: 'from-yellow-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1540827459-7c6e5a7e9b0b?w=800&auto=format',
      description: 'Power your sound',
      productCount: 45,
      gradient: 'from-yellow-900/80 to-red-900/80'
    }
  ];

  const brands = [
    {
      id: 1,
      name: 'Fender',
      logo: 'F',
      image: 'https://images.unsplash.com/photo-1556440380-0d2c9e4b9d2c?w=800&auto=format',
      description: 'Legendary American craftsmanship since 1946',
      productCount: 89,
      color: 'from-red-600 to-red-700',
      stats: '4.9 ★',
      year: '1946'
    },
    {
      id: 2,
      name: 'Gibson',
      logo: 'G',
      image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&auto=format',
      description: 'Iconic shapes that defined rock history',
      productCount: 67,
      color: 'from-amber-700 to-amber-800',
      stats: '4.8 ★',
      year: '1902'
    },
    {
      id: 3,
      name: 'Ibanez',
      logo: 'I',
      image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&auto=format',
      description: 'Precision engineering for modern players',
      productCount: 54,
      color: 'from-blue-700 to-blue-800',
      stats: '4.7 ★',
      year: '1957'
    },
    {
      id: 4,
      name: 'Martin',
      logo: 'M',
      image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&auto=format',
      description: 'Acoustic excellence since 1833',
      productCount: 43,
      color: 'from-amber-600 to-amber-700',
      stats: '4.9 ★',
      year: '1833'
    },
    {
      id: 5,
      name: 'PRS',
      logo: 'P',
      image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&auto=format',
      description: 'Artistry in sound and design',
      productCount: 38,
      color: 'from-purple-700 to-purple-800',
      stats: '4.8 ★',
      year: '1985'
    },
    {
      id: 6,
      name: 'Taylor',
      logo: 'T',
      image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&auto=format',
      description: 'Modern innovation in acoustics',
      productCount: 41,
      color: 'from-orange-600 to-orange-700',
      stats: '4.9 ★',
      year: '1974'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const brandVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-24 pb-16 overflow-x-hidden">
      {/* Animated Background Element */}
      <motion.div 
        style={{ scale }}
        className="fixed top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-0"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="text-center mb-20"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-amber-500/10 dark:from-red-500/20 dark:to-amber-500/20 backdrop-blur-sm border border-red-500/20 mb-6"
          >
            <Sparkles size={16} className="text-red-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
              Find Your Perfect Sound
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold italic text-neutral-900 dark:text-neutral-50 mb-6"
          >
            Explore Our
            <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent"> Collections</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
          >
            Discover premium instruments crafted for musicians who demand excellence
          </motion.p>
        </motion.div>

        {/* Categories Section */}
        <div className="mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                Instrument Categories
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">Choose your weapon of choice</p>
            </div>
            <Link 
              to="/shop" 
              className="group hidden md:flex items-center gap-2 px-6 py-2 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <span className="text-sm font-medium">View All</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative"
              >
                <Link to={`/shop/${category.path}`}>
                  <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} group-hover:opacity-90 transition-opacity duration-300`} />
                    </div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                          {category.productCount} Products
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm mb-4">
                        {category.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
                        <Button text="Explore Now"/>
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    
                    {/* Decorative Element */}
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Music2 size={20} className="text-white" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Brands Section */}
        <div className="mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                Premium Brands
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">Trusted by legends worldwide</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <GuitarIcon size={20} />
              <span className="text-sm font-medium">Est. since 1800s</span>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {brands.map((brand) => (
              <motion.div
                key={brand.id}
                variants={brandVariants}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="group"
              >
                <Link to={`/shop?brand=${brand.name.toLowerCase()}`}>
                  <div className="relative overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-red-500/50 transition-all duration-300">
                    {/* Brand Image Preview */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={brand.image} 
                        alt={brand.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${brand.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                          {brand.logo}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-red-500 transition-colors">
                            {brand.name}
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Since {brand.year}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                            {brand.stats}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                        {brand.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {brand.productCount}+ Products
                        </span>
                        <span className="text-xs text-red-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Shop Collection <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trending Banner with Parallax */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 to-amber-600 p-10 md:p-14"
        >
          <motion.div 
            className="absolute inset-0 opacity-20"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black rounded-full blur-3xl" />
          </motion.div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <TrendingUp size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  Trending Now
                </h3>
                <p className="text-white/90">
                  Discover our most popular instruments this month
                </p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/shop?sort=trending"
                className="px-8 py-3 bg-white text-red-600 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 group"
              >
                <span>View Trending</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;