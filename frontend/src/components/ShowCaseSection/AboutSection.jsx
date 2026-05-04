import React from 'react';
import { Guitar, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <div className="py-20 px-4 md:px-8 bg-gradient-to-br from-white via-red-50/30 to-white dark:from-black dark:via-red-950/20 dark:to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-950/40 dark:to-rose-950/40 rounded-full mb-4 animate-pulse">
            <Sparkles className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Our Story
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Heartz Rhythm
          </h1>
          
          {/* Decorative Line */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-12 h-1 bg-red-500 rounded-full"></div>
            <div className="w-6 h-1 bg-rose-500 rounded-full"></div>
            <div className="w-3 h-1 bg-pink-500 rounded-full"></div>
          </div>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-semibold">
            Where Music Finds Its Heartbeat
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Left Side - Image/Visual */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-950/30 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-1">
                <div className="bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-950/50 dark:to-rose-950/50 rounded-xl p-8">
                  <div className="relative h-64 flex items-center justify-center">
                    <div className="absolute animate-float-slow">
                      <Guitar className="w-32 h-32 text-red-500/20 dark:text-red-400/20" />
                    </div>
                    <div className="relative z-10 text-center">
                      <div className="text-8xl mb-4">🎸</div>
                      <p className="text-gray-600 dark:text-gray-400 italic">"Every strum tells a story"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - About Text */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              More Than Just an{' '}
              <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                Instrument Store
              </span>
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Heartz Rhythm was born from a deep passion for music and the belief that everyone deserves to experience the joy of creating beautiful sounds. Founded by musicians, for musicians, we've created a platform that celebrates the art of music making.
            </p>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our journey began with a simple mission: to provide premium quality instruments that inspire creativity and help musicians find their unique voice. Today, we're proud to be one of India's fastest-growing musical instrument e-commerce platforms.
            </p>

            {/* Signature */}
            <div className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-0.5 bg-gradient-to-r from-red-600 to-rose-600"></div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold italic">
                  — Heartz Rhythm Team
                </p>
              </div>
            </div>

            {/* About Button */}
            <div className="pt-6">
              <Link to="/about">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 rounded-full text-white font-semibold hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <span>Learn More About Us</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
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
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutSection;