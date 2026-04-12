import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Award, X, ArrowRight, Sparkles, TrendingUp, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Buttons';

const BrandsHero = () => {
  const [hoveredBrand, setHoveredBrand] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  const brands = [
    { 
      name: 'FENDER', 
      fullName: 'Fender Musical Instruments', 
      founded: 1946, 
      origin: 'USA',
      description: 'Legendary electric guitars and amplifiers that shaped rock and roll history.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Fender_logo.svg/2560px-Fender_logo.svg.png',
      coverImage: 'https://images.unsplash.com/photo-1564186763535-6e6b8c1b2f2a?w=800&h=400&fit=crop',
      popupImage: 'https://images.unsplash.com/photo-1564186763535-6e6b8c1b2f2a?w=400&h=250&fit=crop',
      products: ['Stratocaster', 'Telecaster', 'Jazzmaster'],
      stats: '10k+ Sold',
      year: 'Since 1946'
    },
    { 
      name: 'GIBSON', 
      fullName: 'Gibson Brands', 
      founded: 1902, 
      origin: 'USA',
      description: 'Iconic Les Paul and SG models that define classic rock sound.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Gibson_logo.svg/2560px-Gibson_logo.svg.png',
      coverImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
      popupImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
      products: ['Les Paul', 'SG', 'Flying V'],
      stats: '8k+ Sold',
      year: 'Since 1902'
    },
    { 
      name: 'PRS', 
      fullName: 'Paul Reed Smith', 
      founded: 1985, 
      origin: 'USA',
      description: 'Premium handcrafted instruments blending art with innovation.',
      logo: 'https://www.prsguitars.com/cdn-cgi/image/format=auto,quality=85/static/img/PRS-Logo.png',
      coverImage: 'https://images.unsplash.com/photo-1564186763535-6e6b8c1b2f2a?w=800&h=400&fit=crop',
      popupImage: 'https://images.unsplash.com/photo-1564186763535-6e6b8c1b2f2a?w=400&h=250&fit=crop',
      products: ['Custom 24', 'McCarty 594', 'Silver Sky'],
      stats: '5k+ Sold',
      year: 'Since 1985'
    },
    { 
      name: 'IBANEZ', 
      fullName: 'Ibanez Guitars', 
      founded: 1957, 
      origin: 'Japan',
      description: 'Innovative rock and metal guitars pushing boundaries of speed.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ibanez_Logo.svg/2560px-Ibanez_Logo.svg.png',
      coverImage: 'https://images.unsplash.com/photo-1542729773-3b8b1dcb6fd9?w=800&h=400&fit=crop',
      popupImage: 'https://images.unsplash.com/photo-1542729773-3b8b1dcb6fd9?w=400&h=250&fit=crop',
      products: ['RG Series', 'JEM', 'Artcore'],
      stats: '15k+ Sold',
      year: 'Since 1957'
    },
    { 
      name: 'TAYLOR', 
      fullName: 'Taylor Guitars', 
      founded: 1974, 
      origin: 'USA',
      description: 'Premium acoustic excellence with bright, balanced tone.',
      logo: 'https://www.taylorguitars.com/sites/default/files/logo.png',
      coverImage: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&h=400&fit=crop',
      popupImage: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&h=250&fit=crop',
      products: ['814ce', '314ce', 'GS Mini'],
      stats: '12k+ Sold',
      year: 'Since 1974'
    },
    { 
      name: 'MARTIN', 
      fullName: 'C.F. Martin & Company', 
      founded: 1833, 
      origin: 'USA',
      description: 'Legendary acoustic craftsmanship since 1833.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Martin_Guitar_Logo.svg/2560px-Martin_Guitar_Logo.svg.png',
      coverImage: 'https://images.unsplash.com/photo-1510915364319-5f6f8b5c3e9e?w=800&h=400&fit=crop',
      popupImage: 'https://images.unsplash.com/photo-1510915364319-5f6f8b5c3e9e?w=400&h=250&fit=crop',
      products: ['D-28', 'OM-28', '000-15M'],
      stats: '7k+ Sold',
      year: 'Since 1833'
    }
  ];

  const handleMouseEnter = (e, brandName) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const popupWidth = 380; // Approximate popup width
    
    let leftPos = rect.right + 20;
    
    // If popup would go off screen to the right, position it to the left
    if (leftPos + popupWidth > viewportWidth) {
      leftPos = rect.left - popupWidth - 20;
    }
    
    setPopupPosition({
      x: leftPos,
      y: rect.top + rect.height / 2
    });
    setHoveredBrand(brandName);
  };

  const handleMouseLeave = () => {
    setHoveredBrand(null);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setHoveredBrand(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-950 dark:to-black">
      
      {/* Main Content - Full Width */}
      <section className="relative py-20 px-4 lg:px-8">
        <div className="w-full">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-full mb-6">
              <Award className="w-4 h-4 text-red-500" />
              <span className="text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider">
                Premium Partners
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
              Trusted by World-Class Brands
            </h2>
            
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
              We partner with the most respected instrument manufacturers in the world
            </p>
            
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-12 h-1 bg-red-500 rounded-full"></div>
              <div className="w-6 h-1 bg-red-500 rounded-full"></div>
              <div className="w-3 h-1 bg-red-500 rounded-full"></div>
            </div>
          </div>

          {/* Brands Grid - 2 Columns Full Width */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {brands.map((brand, index) => (
              <div
                key={brand.name}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={(e) => handleMouseEnter(e, brand.name)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Brand Card - Modern Design with Cover Image */}
                <div className="relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 border border-neutral-200 dark:border-neutral-800 hover:border-red-200 dark:hover:border-red-800 cursor-pointer">
                  
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={brand.coverImage} 
                      alt={brand.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Brand Logo on Cover */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <img 
                          src={brand.logo} 
                          alt={brand.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64x64?text=Logo';
                          }}
                        />
                      </div>
                      <div className="text-white">
                        <h3 className="text-2xl font-black tracking-tight">{brand.name}</h3>
                        <p className="text-sm text-white/80">{brand.fullName}</p>
                      </div>
                    </div>
                    
                    {/* Stats Badge */}
                    <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <div className="flex items-center gap-1 text-white text-xs font-bold">
                        <TrendingUp className="w-3 h-3" />
                        <span>{brand.stats}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Description */}
                    <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4 line-clamp-2">
                      {brand.description}
                    </p>
                    
                    {/* Info Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>🏢 {brand.year}</span>
                        <span>📍 {brand.origin}</span>
                      </div>
                      
                      {/* Arrow Button */}
                      <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-rose-500 transition-all duration-300">
                        <ChevronRight className={`w-5 h-5 text-red-500 transition-all duration-500 group-hover:translate-x-1 group-hover:text-white`} />
                      </div>
                    </div>
                    
                    {/* Popular Products Tags */}
                    <div className="flex flex-wrap gap-2">
                      {brand.products.slice(0, 3).map((product) => (
                        <span 
                          key={product}
                          className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs rounded-lg group-hover:bg-red-50 dark:group-hover:bg-red-950/30 transition-colors duration-300"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                    
                    {/* Bottom Border Animation */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500 transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modern Hover Popup - Centered & Compact */}
          {hoveredBrand && (
            <div 
              ref={popupRef}
              className="fixed z-50 animate-fadeIn"
              style={{
                left: `${popupPosition.x}px`,
                top: `${popupPosition.y}px`,
                transform: 'translateY(-50%)'
              }}
            >
              {brands.filter(b => b.name === hoveredBrand).map((brand) => (
                <div 
                  key={brand.name}
                  className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border-2 border-red-500 overflow-hidden w-96 animate-slideIn"
                >
                  {/* Popup Header with Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={brand.popupImage} 
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    {/* Brand Logo Overlay */}
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-lg p-1.5 shadow-lg">
                          <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h4 className="text-white text-lg font-black">{brand.name}</h4>
                          <p className="text-white/80 text-xs">{brand.fullName}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Close Button */}
                    <button 
                      onClick={() => setHoveredBrand(null)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  
                  {/* Popup Content - Compact */}
                  <div className="p-4">
                    {/* Quick Info */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-red-500">🏢</span>
                          <span className="text-neutral-600 dark:text-neutral-400">{brand.year}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-red-500">📍</span>
                          <span className="text-neutral-600 dark:text-neutral-400">{brand.origin}</span>
                        </div>
                      </div>
                      <div className="bg-red-100 dark:bg-red-950/50 px-2 py-0.5 rounded-full">
                        <span className="text-red-600 dark:text-red-400 text-xs font-bold">{brand.stats}</span>
                      </div>
                    </div>
                    
                    {/* Description - Short */}
                    <p className="text-neutral-600 dark:text-neutral-300 text-xs mb-3 leading-relaxed">
                      {brand.description}
                    </p>
                    
                    {/* Popular Models - Compact */}
                    <div className="mb-3">
                      <h5 className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">Popular Models</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {brand.products.map((product) => (
                          <span 
                            key={product}
                            className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs rounded-md"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Shop Button - Compact */}
                    <Link to={`/shop/brand/${brand.name.toLowerCase()}`}>
                      <button className="w-full py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-semibold text-xs hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group">
                        <span>Shop {brand.name} Collection</span>
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modern CTA Card */}
          <div className="flex justify-center items-center mt-24 px-6">
         <div className="w-full max-w-7xl bg-white/10 backdrop-blur-md hover:bg-rose-100 dark:hover:bg-rose-200 rounded-2xl shadow-xl hover:shadow-red-500 transition-all duration-300 transform hover:scale-105 overflow-hidden">

    <div className="grid md:grid-cols-2 items-center">

      {/* LEFT CONTENT */}
      <div className="p-10 md:p-14 text-black dark:text-white">
        
        <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          Start Your Musical Journey 🎸
        </h2>

        <p className="text-black dark:text-white text-sm md:text-base mb-6 max-w-md">
          Explore premium guitars, instruments, and accessories trusted by musicians worldwide. 
          Build your sound with the best brands.
        </p>

        {/* CTA */}
        <Link to="/brands">
          <Button text="Explore All Brands" />
        </Link>

        {/* Stats */}
        <div className="flex gap-8 mt-8 text-sm text-black dark:text-white">
          <div>
            <div className="font-bold text-lg">50+</div>
            <div className="">Brands</div>
          </div>
          <div>
            <div className="font-bold text-lg">100%</div>
            <div className="">Authentic</div>
          </div>
          <div>
            <div className="font-bold text-lg">24/7</div>
            <div className="">Support</div>
          </div>
        </div>

      </div>

      {/* RIGHT IMAGE */}
      <div className="relative h-full">
        <img
          src="https://img.freepik.com/premium-photo/musician-is-playing-acoustic-guitar-stage-spotlight-shines-him-audience-is-captivated-by-his-melodious-music-ciematic-lighting-double-exposure-photogra-ai-generative_143683-20103.jpg" // 👉 replace with your image
          alt="Musicians playing guitar"
          className="w-full h-full object-cover"
        />

        {/* subtle overlay for readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

    </div>
  </div>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.2s ease-out forwards;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BrandsHero;