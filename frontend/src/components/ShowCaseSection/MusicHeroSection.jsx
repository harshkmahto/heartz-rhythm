import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Guitar, Zap, Wind, ArrowRight, Sparkles } from 'lucide-react';
import guitar from '../../assets/guitar.png';
import Button from './Buttons';

const MusicHeroSection = () => {
  const categories = [
    {
      id: 1,
      name: 'Guitar',
      path: '/shop/category/guitar',
      icon: Guitar,
      image: guitar,
      description: 'Acoustic & Classical',
      stats: '24 Models Available'
    },
    {
      id: 2,
      name: 'Electric',
      path: '/shop/category/electric',
      icon: Zap,
      image: null,
      description: 'Electric & Bass',
      stats: '18 Models Available'
    },
    {
      id: 3,
      name: 'Ukulele',
      path: '/shop/category/ukelele',
      icon: Wind,
      image: guitar,
      description: 'Hawaiian Vibes',
      stats: '12 Models Available'
    }
  ];

  const primaryColor = {
    gradient: 'from-red-500 to-rose-600',
    light: 'from-red-50 to-rose-50',
    dark: 'from-red-950/40 to-rose-950/40',
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-black dark:to-neutral-900 text-black dark:text-white py-16 px-4'>
      
      {/* Header with improved design */}
      <div className='flex items-center gap-4 mb-16 max-w-7xl mx-auto'>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-300 to-transparent dark:via-red-800"></div>
        <div className="text-center relative">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <Music className="w-10 h-10 text-red-500 animate-pulse" />
            </div>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mt-4">
            FIND AMAZING CATEGORIES
          </h2>
          <div className="flex justify-center gap-2 mt-3">
            <div className="w-12 h-1 bg-red-500 rounded-full"></div>
            <div className="w-6 h-1 bg-rose-500 rounded-full"></div>
            <div className="w-3 h-1 bg-pink-500 rounded-full"></div>
          </div>
          <p className="text-base text-neutral-600 dark:text-neutral-400 mt-4">
            Choose your instrument and start your musical journey
          </p>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-300 to-transparent dark:via-red-800"></div>
      </div>

      {/* Categories Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full mx-auto'>
        
        {categories.map((category, index) => (
          <Link 
            key={category.id}
            to={category.path}
            className='group relative block transform transition-all duration-500 hover:scale-105 animate-fadeInUp'
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Card with improved styling */}
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${primaryColor.light} dark:${primaryColor.dark} shadow-xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 border border-red-100 dark:border-red-900/30`}>
              
              {/* Animated Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Top Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {category.stats}
                </div>
              </div>

              {/* Content Container */}
              <div className='relative p-8 flex flex-col items-center'>
                
                {/* Image/Icon Container with improved design */}
                <div className='relative w-52 h-52 mb-6 flex items-center justify-center'>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className='w-full h-full object-contain transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 drop-shadow-2xl' 
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 rounded-full'>
                      <category.icon className="w-36 h-36 text-red-500 transition-all duration-500 group-hover:scale-110 group-hover:text-red-600" strokeWidth={1.5} />
                    </div>
                  )}
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-full`}></div>
                </div>

                {/* Category Info */}
                <div className='text-center w-full space-y-3'>
                  <h3 className={`text-3xl font-black uppercase tracking-wide bg-gradient-to-r ${primaryColor.gradient} bg-clip-text text-transparent`}>
                    {category.name}
                  </h3>
                  
                  <p className='text-base text-neutral-700 dark:text-neutral-300 font-medium'>
                    {category.description}
                  </p>
                  
                  {/* Shop Now Button with improved design */}
                  <div className="mt-6">
                    <Button text="shop now" size="sm"  />
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${primaryColor.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full`}></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Improved CTA Section */}
      <div className="text-center mt-20">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-full">
          <span className="text-2xl">🎵</span>
          <p className="text-neutral-700 dark:text-neutral-300 font-medium">
            Every musician starts somewhere. Find your perfect instrument today!
          </p>
          <span className="text-2xl">✨</span>
        </div>
      </div>

      {/* Improved Explore Collection Card */}
      <div className='flex justify-center items-center mt-16'>
        <div className='relative group max-w-2xl w-full'>
          {/* Background with animation */}
          <div className='absolute inset-0 bg-gradient-to-r from-red-500 via-rose-500 to-red-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse'></div>
          
          {/* Main Card */}
          <div className='relative bg-gradient-to-br from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 rounded-2xl shadow-2xl overflow-hidden'>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
            
            <div className='p-8 text-center relative z-10'>
              <div className='font-serif font-bold text-2xl md:text-3xl tracking-wide text-white mb-4'>
                Ready to Start Your Journey?
              </div>
              <p className="text-white/90 text-sm md:text-base mb-6 max-w-md mx-auto">
                Explore our complete collection of premium instruments and accessories
              </p>
              <Link to='/categories'>
              <button className='bg-white text-red-600 px-8 py-3 rounded-full font-bold cursor-pointer hover:bg-black hover:text-white active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 group'>
                <span>EXPLORE FULL COLLECTION</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default MusicHeroSection;