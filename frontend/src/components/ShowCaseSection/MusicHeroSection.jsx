import React from 'react';
import { Link } from 'react-router-dom';
import { Music, ArrowRight } from 'lucide-react';
import guitar from '../../assets/Acoustic.png';
import electricGuitar from '../../assets/guitar.png'; 
import ukulele from '../../assets/ukulele.webp';
import Button from './Buttons';

const MusicHeroSection = () => {
  const categories = [
    {
      id: 1,
      name: 'Guitar',
      path: '/category/acoustic',
      image: guitar,
      description: 'Acoustic & Classical',
      stats: '24 Models Available',
      rotateDeg: '-6deg'
    },
    {
      id: 2,
      name: 'Electric',
      path: '/category/electric',
      image: electricGuitar,
      description: 'Electric & Bass',
      stats: '18 Models Available',
      rotateDeg: '4deg'
    },
    {
      id: 3,
      name: 'Ukulele',
      path: '/category/ukelele',
      image: ukulele,
      description: 'Hawaiian Vibes',
      stats: '12 Models Available',
      rotateDeg: '-3deg'
    }
  ];

  const primaryColor = {
    gradient: 'from-red-500 to-rose-600',
    light: 'from-red-50 to-rose-50',
    dark: 'from-red-950/40 to-rose-950/40',
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-black dark:to-neutral-900 text-black dark:text-white py-16 px-4'>
      
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
            className='group relative block transform transition-all duration-500 hover:-translate-y-2'
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Card Container - REMOVED the shine effect div */}
            <div className={`relative overflow-visible rounded-2xl bg-gradient-to-br ${primaryColor.light} dark:${primaryColor.dark} shadow-xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 border border-red-100 dark:border-red-900/30 h-full`}>
              
              {/* REMOVED: The transparent glass shine effect that slides across */}
              
              <div className='relative pt-20 pb-8 px-6'>
                
                {/* Image Container */}
                <div className='absolute -top-16 left-1/2 transform -translate-x-1/2 w-52 h-64 z-10'>
                  
                  {/* Glow effect behind image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                
                  {/* Image with hover rotation */}
                  <img 
                    src={category.image} 
                    alt={category.name}
                    loading="lazy"
                    className='w-full h-full object-contain transition-all duration-500 ease-out drop-shadow-2xl'
                    style={{
                      transform: `rotate(${category.rotateDeg})`,
                      filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.2))',
                      transition: 'transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'rotate(0deg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = `rotate(${category.rotateDeg})`;
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/200?text=Instrument';
                    }}
                  />
                  
                  {/* Animated gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-full"></div>
                </div>

                {/* Category Info */}
                <div className='text-center w-full space-y-3 mt-22'>
                  <h3 className={`text-3xl font-black uppercase tracking-wide bg-gradient-to-r ${primaryColor.gradient} bg-clip-text text-transparent`}>
                    {category.name}
                  </h3>
                  
                  <p className='text-base text-neutral-700 dark:text-neutral-300 font-medium'>
                    {category.description}
                  </p>
                  
                  {/* Shop Now Button */}
                  <div className="mt-6">
                    <Button text="shop now" size="sm" />
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${primaryColor.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full`}></div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-20">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-full">
          <span className="text-2xl">🎵</span>
          <p className="text-neutral-700 dark:text-neutral-300 font-medium">
            Every musician starts somewhere. Find your perfect instrument today!
          </p>
          <span className="text-2xl">✨</span>
        </div>
      </div>

      {/* Explore Collection Card */}
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

      {/* Custom Animations */}
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

        @keyframes float {
          0% {
            transform: translateY(0px) rotate(var(--rotate-start));
          }
          50% {
            transform: translateY(-8px) rotate(var(--rotate-start));
          }
          100% {
            transform: translateY(0px) rotate(var(--rotate-start));
          }
        }
      `}</style>
    </div>
  );
};

export default MusicHeroSection;