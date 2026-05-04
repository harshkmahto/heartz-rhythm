import React, { useMemo, useEffect } from 'react';
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
import { useGetProductsQuery } from '../../utils/productApi';

const Categories = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const { data: productsData, isLoading, error, refetch } = useGetProductsQuery({
    limit: 1000
  });

  const allProducts = useMemo(() => {
    if (!productsData) return [];
  
    if (productsData?.data?.products && Array.isArray(productsData.data.products)) {
      return productsData.data.products;
    }

    if (Array.isArray(productsData)) return productsData;
    if (productsData?.products && Array.isArray(productsData.products)) return productsData.products;
    if (productsData?.data && Array.isArray(productsData.data)) return productsData.data;
    return [];
  }, [productsData]);


  const categories = useMemo(() => {
    const categoryMap = new Map();
    
    allProducts.forEach(product => {
      const categoryName = product.category;
      if (!categoryName) return;
      
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          id: categoryName,
          name: categoryName,
          path: categoryName.toLowerCase().split(' ')[0],
          productCount: 1,
          image: product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&auto=format',
        });
      } else {
        categoryMap.get(categoryName).productCount++;
      }
    });
    
    return Array.from(categoryMap.values());
  }, [allProducts]);


  const brands = useMemo(() => {
    const brandMap = new Map();
    
    allProducts.forEach(product => {
      const brandName = product.brand;
      if (!brandName) return;
      
      if (!brandMap.has(brandName)) {
        brandMap.set(brandName, {
          id: brandName,
          name: brandName,
          logo: brandName.charAt(0).toUpperCase(),
          image: product.images?.[0] || product.thumbnail ||  'https://images.unsplash.com/photo-1556440380-0d2c9e4b9d2c?w=800&auto=format',
          productCount: 1,
        });
      } else {
        brandMap.get(brandName).productCount++;
      }
    });
    
    return Array.from(brandMap.values()).sort((a, b) => b.productCount - a.productCount);
  }, [allProducts]);

 

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Loading collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">🎸</div>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">Failed to load collections</p>
          <p className="text-sm text-gray-500 mb-6">{error.message || 'Unknown error'}</p>
          <button 
            onClick={() => refetch()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              {allProducts.length} Products Available
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

        {/* Categories Section - ONLY from actual products */}
        {categories.length > 0 && (
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
                <p className="text-neutral-600 dark:text-neutral-400">
                  {categories.length} Categories • {allProducts.length} Total Products
                </p>
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
                  <Link to={`/category/${category.path}`}>
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-900 to-black">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
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
                        
                        <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
                          <span className="text-sm font-medium">Explore Now</span>
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
        )}

        {/* Brands Section  */}
        {brands.length > 0 && (
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
                <p className="text-neutral-600 dark:text-neutral-400">
                  {brands.length} Brands Available
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                <GuitarIcon size={20} />
                <span className="text-sm font-medium">Shop by Brand</span>
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
                  <Link to={`/seller/brand/${brand.name}`}>
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
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
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
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                              4.8 ★
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                          Premium {brand.name} instruments
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {brand.productCount} Products
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
        )}

        {/* No Data Message */}
        {categories.length === 0 && brands.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎸</div>
            <p className="text-neutral-600 dark:text-neutral-400">No products found in the collection.</p>
            <p className="text-sm text-gray-500 mt-2">Check console for debug info</p>
            <button 
              onClick={() => refetch()}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Trending Banner */}
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