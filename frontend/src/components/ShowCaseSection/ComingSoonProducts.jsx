import React, { useState, useEffect, useRef } from 'react';
import { getComingSoon } from '../../utils/product.apiRequest';
import { Calendar, Clock, Bell, Tag, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComingSoonProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const carouselRef = useRef(null);

  useEffect(() => {
    fetchComingSoonProducts();
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchComingSoonProducts = async () => {
    try {
      setLoading(true);
      const response = await getComingSoon();
      if (response.success) {
        // Sort products: nearest release date first, then latest created
        const sortedProducts = [...response.data.products].sort((a, b) => {
          // If both have scheduled dates
          if (a.scheduledAt && b.scheduledAt) {
            const dateA = new Date(a.scheduledAt);
            const dateB = new Date(b.scheduledAt);
            const now = new Date();
            
            // Calculate days remaining
            const daysA = Math.ceil((dateA - now) / (1000 * 60 * 60 * 24));
            const daysB = Math.ceil((dateB - now) / (1000 * 60 * 60 * 24));
            
            // Sort by days remaining (smaller first)
            if (daysA !== daysB) return daysA - daysB;
          }
          
          // If only one has scheduled date
          if (a.scheduledAt && !b.scheduledAt) return -1;
          if (!a.scheduledAt && b.scheduledAt) return 1;
          
          // If both don't have scheduled dates or same days, sort by createdAt (newest first)
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        setProducts(sortedProducts);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 640) setSlidesToShow(1);
    else if (window.innerWidth < 768) setSlidesToShow(2);
    else if (window.innerWidth < 1024) setSlidesToShow(3);
    else setSlidesToShow(4);
  };

  const nextSlide = () => {
    if (currentIndex < products.length - slidesToShow) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(products.length - slidesToShow); // Loop to end
    }
  };

  // Countdown timer component
  const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });

    useEffect(() => {
      const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const difference = target - now;

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(timer);
    }, [targetDate]);

    return (
      <div className="flex gap-2 justify-center mt-3">
        <div className="text-center">
          <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-lg px-2 py-1 min-w-[45px]">
            <span className="text-xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Days</p>
        </div>
        <div className="text-center">
          <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-lg px-2 py-1 min-w-[45px]">
            <span className="text-xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hours</p>
        </div>
        <div className="text-center">
          <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-lg px-2 py-1 min-w-[45px]">
            <span className="text-xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mins</p>
        </div>
        <div className="text-center">
          <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-lg px-2 py-1 min-w-[45px]">
            <span className="text-xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Secs</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/20 dark:to-black">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-red-200 dark:border-red-900/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-red-600 border-r-red-500 border-b-red-400 border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/20 dark:to-black">
        <div className="text-center max-w-md mx-auto p-8 bg-red-50 dark:bg-red-950/20 rounded-2xl backdrop-blur-sm">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          <button 
            onClick={fetchComingSoonProducts}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + slidesToShow);

  return (
    <div className="py-16 px-4 md:px-8 bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/20 dark:to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-950/40 dark:to-rose-950/40 rounded-full mb-4 animate-pulse">
            <Sparkles className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Coming Soon
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Coming Soon Products
          </h1>
          
          {/* Decorative Line */}
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-12 h-1 bg-red-500 rounded-full"></div>
            <div className="w-6 h-1 bg-rose-500 rounded-full"></div>
            <div className="w-3 h-1 bg-pink-500 rounded-full"></div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Stay tuned for our upcoming premium instruments. Be the first to experience our latest collection!
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {products.length > slidesToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300 group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300 group"
              >
                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{ transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)` }}
            >
              {products.map((product, index) => (
                <Link to= {`/product/coming-soon/${product._id}`} >
                <div
                  key={product._id}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Glassmorphism Card */}
                  <div className="relative backdrop-blur-xl bg-white/30 dark:bg-black/30 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 border border-white/20 dark:border-white/10 hover:-translate-y-2 h-full">
                    
                    {/* Coming Soon Overlay Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        <Bell className="w-3 h-3" />
                        <span>COMING SOON</span>
                      </div>
                    </div>

                    {/* Scheduled Badge with Date */}
                    {product.scheduledAt && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(product.scheduledAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}

                    {/* Image Container with Coming Soon Text in Middle */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-950/50 dark:to-rose-950/50">
                      {/* Coming Soon Text in Middle of Image */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-red-500/50 transform -rotate-12">
                          <span className="text-white font-bold text-lg tracking-wider flex items-center gap-2">
                            <Clock className="w-5 h-5 animate-pulse" />
                            COMING SOON
                          </span>
                        </div>
                      </div>

                      {/* Product Image */}
                      
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl">🎸</div>
                        </div>
                      )}
                       

                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {product.title}
                      </h3>
                      
                      {/* Subtitle */}
                      {product.subtitle && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {product.subtitle}
                        </p>
                      )}

                      {/* Category and Subcategory */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {product.category && (
                          <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full">
                            {product.category}
                          </span>
                        )}
                        {product.subcategory && (
                          <span className="text-xs px-2 py-1 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-full">
                            {product.subcategory}
                          </span>
                        )}
                      </div>

                      {/* Brand Info with Logo */}
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        {product.sellerPanel?.logo ? (
                          <img
                            src={product.sellerPanel.logo}
                            alt={product.brand}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <Tag className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {product.brand || product.sellerPanel?.brandName || 'Heartz Rhythm'}
                        </span>
                      </div>

                      {/* Discount Display - Simplified */}
                      {product.discount && product.discount.value > 0 && (
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 rounded-full">
                            <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Launch Offer</span>
                            <span className="text-sm font-bold text-red-600 dark:text-red-400">
                              {product.discount.value}{product.discount.type === 'percentage' ? '% OFF' : ' OFF'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Countdown Timer if scheduled */}
                      {product.scheduledAt && product.releaseInfo?.daysRemaining > 0 && (
                        <div className="mb-4">
                          <CountdownTimer targetDate={product.scheduledAt} />
                        </div>
                      )}

                      {/* Days remaining text */}
                      {product.releaseInfo?.daysRemaining > 0 && (
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                          {product.releaseInfo.daysRemaining === 1 
                            ? 'Tomorrow!' 
                            : `${product.releaseInfo.daysRemaining} days remaining`}
                        </p>
                      )}

                      
                    </div>

                    {/* Bottom Glow Effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        {products.length > slidesToShow && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(products.length / slidesToShow) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx * slidesToShow)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / slidesToShow) === idx
                    ? 'w-8 bg-gradient-to-r from-red-600 to-rose-600'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-red-400'
                }`}
              />
            ))}
          </div>
        )}
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
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default ComingSoonProducts;