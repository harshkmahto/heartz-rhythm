import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../../utils/productApi';
import CategoryProductCard from '../../components/Products/CategoryProductCard';
import guitarPng from '../../assets/guitar.png';

const ElectricCategory = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  
  const { 
    data: productsData, 
    isLoading, 
    error,
    refetch 
  } = useGetProductsQuery({
    category: 'Electric Guitars', 
    limit: 100
  });
  const products = productsData?.data?.products || [];
  
 
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play();
      const handleEnded = () => {
        video.currentTime = 0;
        video.play();
      };
      video.addEventListener('ended', handleEnded);
      return () => video.removeEventListener('ended', handleEnded);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-100/50 to-white dark:from-black dark:via-red-950/30 dark:to-black relative overflow-x-hidden">
      
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
                           repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 2px, transparent 2px, transparent 8px)`
        }} />
      </div>

      {/* Animated Electric Lines Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent animate-pulse" />
        <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500/20 to-transparent animate-pulse delay-700" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent animate-pulse delay-300" />
      </div>
      
      {/* Banner Section - Looping Video */}
      <div className="relative w-full h-screen overflow-hidden">
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/vid/electric.mp4"
          muted
          playsInline
          preload="auto"
          loop={false}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-red-900/40 to-black/80" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="w-12 h-px bg-red-500/50" />
            <span className="text-red-400 text-sm tracking-[0.3em]">HEARTZ RHYTHM</span>
            <div className="w-12 h-px bg-red-500/50" />
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.2em] text-white mb-6">
            ELECTRIC
          </h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="text-amber-400 text-sm tracking-wider">POWER. PRECISION. PERFORMANCE.</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
          
          <p className="text-xl md:text-2xl font-light tracking-[0.3em] text-amber-500/90">
            POWER. SPEED. ATTITUDE.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="relative z-20 px-4 md:px-8 lg:px-16 py-20">
        
        {/* About Card */}
        <div className="max-w-5xl mx-auto mb-20 p-8 md:p-12 rounded-2xl backdrop-blur-lg bg-gradient-to-br from-white/80 to-red-100/50 dark:from-white/5 dark:to-red-950/20 border border-gray-200 dark:border-white/10 shadow-2xl">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-light text-center text-black dark:text-white mb-4 tracking-wide">
              The Power of <span className="text-red-500 font-medium">Electric</span>
            </h2>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto" />
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-center text-lg md:text-xl leading-relaxed mt-8">
            Experience the raw power and precision of electric guitars. From classic rock to modern metal, 
            our electric collection delivers unparalleled performance, cutting-edge electronics, 
            and iconic designs that have shaped music history.
          </p>
        </div>

        {/* Three Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          
          {/* Card 1 */}
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/90 to-red-50/50 dark:from-white/10 dark:to-red-950/30 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-500 hover:shadow-red-500/20 hover:shadow-xl">
            <div className="relative pt-6 px-6">
              <div className="relative h-64 overflow-hidden rounded-xl shadow-lg">
                <img 
                  src={guitarPng} 
                  alt="Electric Guitar"
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-2">High Output Humbuckers</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Powerful pickups delivering maximum tone and sustain for legendary rock sounds.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/90 to-red-50/50 dark:from-white/10 dark:to-red-950/30 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-500 hover:shadow-red-500/20 hover:shadow-xl">
            <div className="relative pt-6 px-6">
              <div className="relative h-64 overflow-hidden rounded-xl shadow-lg">
                <img 
                  src={guitarPng} 
                  alt="Electric Guitar"
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-2">Precision Craftsmanship</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ergonomically designed body with premium materials for ultimate playability.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/90 to-red-50/50 dark:from-white/10 dark:to-red-950/30 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-500 hover:shadow-red-500/20 hover:shadow-xl">
            <div className="relative pt-6 px-6">
              <div className="relative h-64 overflow-hidden rounded-xl shadow-lg">
                <img 
                  src={guitarPng} 
                  alt="Electric Guitar"
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-2">Advanced Electronics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                State-of-the-art circuitry and controls for endless tonal possibilities.
              </p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-4xl font-light text-black dark:text-white mb-3 tracking-wide">
            Explore The <span className="text-red-500">Electric Collection</span>
          </h3>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Premium electric guitars for every style</p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-12 h-12 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">
            <p>Failed to load products. Please try again.</p>
            <button 
              onClick={() => refetch()}
              className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-20">
            <div className="text-6xl mb-4">🎸</div>
            <p className="text-lg">No electric products found in the collection.</p>
            <p className="text-sm mt-2 text-gray-500">Category filter: "Electric Guitars"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {products.map((product, index) => (
              <CategoryProductCard 
                key={product._id || product.id || index} 
                product={product}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="relative max-w-2xl mx-auto p-8 rounded-2xl backdrop-blur-sm bg-gradient-to-r from-red-100/50 to-gray-100/50 dark:from-red-950/20 dark:to-black/40 border border-red-500/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">⚡</span>
              </div>
            </div>
            <h4 className="text-xl font-light text-black dark:text-white mb-3 pt-4">Unleash Your Sound</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              From shred machines to vintage classics, find the electric guitar that matches your style.
            </p>
            <button 
              onClick={() => navigate('/shop')}
              className="group px-8 py-3 bg-gradient-to-r from-red-600/20 to-amber-600/20 backdrop-blur-md border border-red-500/30 text-red-600 dark:text-red-400 rounded-full hover:from-red-600 hover:to-amber-600 hover:text-white dark:hover:text-black cursor-pointer transition-all duration-500 hover:scale-105"
            >
              View All Guitars
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-500 text-xs tracking-wider">
          <div className="flex justify-center gap-4 mb-2">
            <span className="hover:text-red-500 transition-colors cursor-pointer">High Output</span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span className="hover:text-red-500 transition-colors cursor-pointer">Precision Electronics</span>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <span className="hover:text-red-500 transition-colors cursor-pointer">Road Ready</span>
          </div>
          <p>Electric Collection — Power your performance</p>
        </div>
      </div>
    </div>
  );
};

export default ElectricCategory;